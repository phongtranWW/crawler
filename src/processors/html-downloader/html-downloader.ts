import { Job } from 'bull';
import puppeteer, { Browser, Page } from 'puppeteer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DownloadedHtmlEvent } from '@processors/html-downloader/downloaded-html-event';
import { DownloadHtmlInput } from '@processors/html-downloader/download-html-input';
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { minify } from 'html-minifier';
export abstract class HtmlDownloader implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(HtmlDownloader.name);
  private browser: Browser;
  private page: Page;

  private blockedResourceTypes: string[] = [
    'stylesheet',
    'font',
    'image',
    'media',
  ];
  private blockedTags: string[] = [
    'meta',
    'link',
    'iframe',
    'img',
    'style',
    'noscript',
    'script',
    'input',
  ];
  private blockedAttributes: string[] = ['onclick', 'style'];

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--ignore-certificate-errors',
        '--window-size=1920,1080',
      ],
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent(
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36',
    );
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    });

    this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      if (
        this.blockedResourceTypes.some((type) => req.resourceType() == type)
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  async onModuleDestroy() {
    await this.page.close();
    await this.browser.close();
  }

  protected async download(job: Job<DownloadHtmlInput>) {
    const { url } = job.data;
    const delay = job.data.delay || 0;

    await new Promise((resolve) => setTimeout(resolve, delay));

    const response = await this.page.goto(url.url, {
      waitUntil: 'networkidle2',
      timeout: 15000,
    });

    if (![200, 410].includes(response.status())) {
      this.logger.warn({
        message: `Unexpected status code ${response.status()}`,
        content: {
          url: url.url.substring(0, 100).concat('...'),
          statusCode: response.status(),
        },
      });
      throw new Error(`Unexpected status code ${response.status()}`);
    }

    // minifier
    await this.page.evaluate(
      (blockedTags, blockedAttributes) => {
        blockedTags.forEach((tag) => {
          document.querySelectorAll(tag).forEach((el) => {
            el.remove();
          });
        });

        blockedAttributes.forEach((attribute) => {
          document.querySelectorAll('*').forEach((el) => {
            el.removeAttribute(attribute);
          });
        });
      },
      this.blockedTags,
      this.blockedAttributes,
    );

    const html = await this.page.content();
    const minifiedHtml = minify(html, {
      continueOnParseError: true,
      collapseBooleanAttributes: true,
      minifyCSS: true,
      minifyJS: true,
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyElements: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
    });

    return {
      status: response.status(),
      html: minifiedHtml,
    };
  }

  protected onHtmlDownloaded(
    job: Job<DownloadHtmlInput>,
    result: {
      status: number;
      html: string;
    },
  ) {
    const { url } = job.data;
    this.logger.log({
      message: 'Download Successfully',
      content: {
        url: url.url.substring(0, 100).concat('...'),
        html: result.html.substring(0, 100).concat('...'),
        status: result.status,
      },
    });
    this.eventEmitter.emit(
      'html-downloader.downloaded',
      new DownloadedHtmlEvent(url, result.html),
    );
  }

  protected onHtmlDownloadFailed(job: Job<DownloadHtmlInput>, error: Error) {
    this.logger.error({
      message: 'Download Failed',
      content: {
        url: job.data.url.url.substring(0, 100).concat('...'),
        stack: error.stack.substring(0, 100).concat('...'),
      },
    });
  }
}
