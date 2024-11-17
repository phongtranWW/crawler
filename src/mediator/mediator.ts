import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { DownloadedHtmlEvent } from '@processors/html-downloader/downloaded-html-event';
import { ExtractedUrlEvent } from '@processors/url-placement/processes/extract-url/extracted-url-event';
import { FilteredUrlEvent } from '@processors/url-placement/processes/filter-url/filtered-url-event';
import { VerifiedUrlEvent } from '@processors/url-placement/processes/verify-url/verified-url-event';
import { FilterUrlInput } from '@processors/url-placement/processes/filter-url/filter-url-input';
import { VerifyUrlInput } from '@processors/url-placement/processes/verify-url/verify-url-input';
import { Job, Queue } from 'bull';
import {
  QueueProcessor,
  Router,
  RouterDocument,
} from '@mediator/router-schema';
import { Model } from 'mongoose';
import { UrlQueue } from '@definitions/types/url-queue';
import {
  Url,
  UrlStatus,
} from '@processors/url-placement/processes/store-url/url-schema';
import { StoreUrlInput } from '@processors/url-placement/processes/store-url/store-url-input';
import { VerifiedHtmlEvent } from '@processors/html-placement/processes/verify-html/verified-html-event';
import { ExtractUrlInput } from '@processors/url-placement/processes/extract-url/extract-url-input';
import {
  SelectPattern,
  SelectPatternDocument,
} from '@mediator/select-pattern-schema';
import { StoreHtmlInput } from '@processors/html-placement/processes/store-html/store-html-input';
import { VerifyHtmlInput } from '@processors/html-placement/processes/verify-html/verify-html-input';
import { DownloadHtmlInput } from '@processors/html-downloader/download-html-input';

@Injectable()
export class Mediator {
  private readonly logger = new Logger(Mediator.name);
  private htmlDownloaders: Map<number, Queue> = new Map();
  constructor(
    @InjectModel(Router.name)
    private readonly routerModel: Model<RouterDocument>,
    @InjectModel(SelectPattern.name)
    private readonly selectPatternModel: Model<SelectPatternDocument>,
    @InjectQueue('html-placement')
    private readonly htmlPlacement: Queue,
    @InjectQueue('url-placement')
    private readonly urlPlacement: Queue,
    @InjectQueue('html-downloader-host-one')
    htmlDownloaderHostOne: Queue,
    @InjectQueue('html-downloader-host-two')
    htmlDownloaderHostTwo: Queue,
    @InjectQueue('html-downloader-host-three')
    htmlDownloaderHostThree: Queue,
  ) {
    this.htmlDownloaders.set(QueueProcessor.HOST_ONE, htmlDownloaderHostOne);
    this.htmlDownloaders.set(QueueProcessor.HOST_TWO, htmlDownloaderHostTwo);
    this.htmlDownloaders.set(
      QueueProcessor.HOST_THREE,
      htmlDownloaderHostThree,
    );
  }

  // HTML DOWNLOADER
  @OnEvent('html-downloader.downloaded')
  async onHtmlDownloaded(event: DownloadedHtmlEvent) {
    const { url, html } = event;

    await this.htmlPlacement.add('verify', new VerifyHtmlInput(url, html));
    this.logger.log({
      message: 'Added html to Html Placement to verify',
      content: {
        url: url.url.substring(0, 100).concat('...'),
        html: html.substring(0, 100).concat('...'),
      },
    });

    await this.urlPlacement.add(
      'store',
      new StoreUrlInput([new Url(url.url, url.depth, UrlStatus.DOWNLOADED)]),
    );
    await this.logger.log({
      message: 'Added url to Url Placement to store',
      content: {
        url: url.url.substring(0, 100).concat('...'),
      },
    });
  }

  // HTML PLACEMENT
  @OnEvent('html-placement.verified')
  async onHtmlStored(event: VerifiedHtmlEvent) {
    const { url, html, hasSeen } = event;

    if (hasSeen) return;

    if (url.depth < 5) {
      await this.urlPlacement.add('extract', new ExtractUrlInput(url, html));
      this.logger.log({
        message: 'Added html to Url Placement to extract',
        content: {
          url: url.url.substring(0, 100).concat('...'),
          html: html.substring(0, 100).concat('...'),
        },
      });
    }

    const selectPattern = await this.selectPatternModel.findOne({
      hostName: new URL(url.url).hostname,
    });
    if (selectPattern) {
      const shouldStore = selectPattern.regexes.some((regex) => {
        return new RegExp(regex).test(url.url);
      });

      if (shouldStore) {
        await this.htmlPlacement.add('store', new StoreHtmlInput(url, html));
        this.logger.log({
          message: 'Added html to Html Placement to store',
          content: {
            url: url.url.substring(0, 100).concat('...'),
            html: html.substring(0, 100).concat('...'),
          },
        });
      }
    }
  }

  // URL PLACEMENT
  @OnEvent('url-placement.extracted')
  async onUrlExtracted(event: ExtractedUrlEvent) {
    const { url, urls } = event;
    if (urls.length < 1) return;
    await this.urlPlacement.add('filter', new FilterUrlInput(url, urls));
    this.logger.log({
      message: 'Added urls to Url Placement to filter',
      content: {
        length: urls.length,
        urls: urls
          .slice(0, 3)
          .map((url) => url.substring(0, 100).concat('...')),
      },
    });
  }

  @OnEvent('url-placement.filtered')
  async onUrlFiltered(event: FilteredUrlEvent) {
    const { url, urls } = event;
    if (urls.length < 1) return;
    await this.urlPlacement.add('verify', new VerifyUrlInput(url, urls));
    this.logger.log({
      message: 'Added urls to Url Placement to verify',
      content: {
        length: urls.length,
        urls: urls
          .slice(0, 3)
          .map((url) => url.substring(0, 100).concat('...')),
      },
    });
  }

  @OnEvent('url-placement.verified')
  async onUrlVerified(event: VerifiedUrlEvent) {
    const { url, urls } = event;
    if (urls.length < 1) return;

    const hostName = new URL(url.url).hostname;
    const router = await this.routerModel.findOne({
      hostName,
    });

    if (!router) {
      this.logger.warn({
        message: `No router found`,
        url: url.url.substring(0, 100).concat('...'),
      });
      return;
    }

    if (
      (await this.htmlDownloaders.get(router.queueProcessor).count()) +
        urls.length <=
      50000
    ) {
      const newJobs: Array<Job<DownloadHtmlInput>> = urls.map((newUrls) => {
        return {
          name: 'download',
          data: new DownloadHtmlInput(
            new UrlQueue(newUrls, url.depth + 1),
            router.delay,
          ),
        } as Job<DownloadHtmlInput>;
      });
      await this.htmlDownloaders.get(router.queueProcessor).addBulk(newJobs);
      this.logger.log({
        message: 'Added urls to Html Downloader to download',
        content: {
          length: newJobs.length,
          urls: newJobs
            .slice(0, 3)
            .map((url) => url.data.url.url.substring(0, 100).concat('...')),
          depth: url.depth + 1,
          queue: router.queueProcessor,
        },
      });
    } else {
      const newUrls = urls.map((newUrls) => {
        return new Url(newUrls, url.depth + 1);
      });
      await this.urlPlacement.add('store', new StoreUrlInput(newUrls));
      this.logger.log({
        message: 'Added urls to Url Placement to store',
        content: {
          length: newUrls.length,
          urls: newUrls
            .slice(0, 3)
            .map((url) => url.url.substring(0, 100).concat('...')),
          depth: url.depth + 1,
        },
      });
    }
  }
}
