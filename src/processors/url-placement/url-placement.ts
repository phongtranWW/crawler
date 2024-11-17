import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExtractUrlProcess } from '@processors/url-placement/processes/extract-url/extract-url-process';
import { ExtractUrlInput } from '@processors/url-placement/processes/extract-url/extract-url-input';
import { ExtractedUrlEvent } from '@processors/url-placement/processes/extract-url/extracted-url-event';
import { FilterUrlProcess } from '@processors/url-placement/processes/filter-url/filter-url-process';
import { FilterUrlInput } from '@processors/url-placement/processes/filter-url/filter-url-input';
import { FilteredUrlEvent } from '@processors/url-placement/processes/filter-url/filtered-url-event';
import { VerifyUrlProcess } from '@processors/url-placement/processes/verify-url/verify-url-process';
import { VerifyUrlInput } from '@processors/url-placement/processes/verify-url/verify-url-input';
import { VerifiedUrlEvent } from '@processors/url-placement/processes/verify-url/verified-url-event';
import { StoreUrlInput } from '@processors/url-placement/processes/store-url/store-url-input';
import { StoreUrlProcess } from '@processors/url-placement/processes/store-url/store-url-process';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('url-placement')
export class UrlPlacement {
  private readonly logger = new Logger(UrlPlacement.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly extractUrlProcess: ExtractUrlProcess,
    private readonly filterUrlProcess: FilterUrlProcess,
    private readonly verifyUrlProcess: VerifyUrlProcess,
    private readonly storeUrlProcess: StoreUrlProcess,
  ) {}

  @Process('extract')
  async extract(job: Job<ExtractUrlInput>) {
    const { url, html } = job.data;
    return this.extractUrlProcess.execute(url.url, html);
  }

  @OnQueueCompleted({ name: 'extract' })
  onExtractCompleted(job: Job<ExtractUrlInput>, result: string[]) {
    this.eventEmitter.emit(
      'url-placement.extracted',
      new ExtractedUrlEvent(job.data.url, result),
    );

    this.logger.log({
      message: 'Extracted urls',
      content: {
        length: result.length,
        urls: result
          .slice(0, 3)
          .map((url) => url.substring(0, 100).concat('...')),
      },
    });
  }

  @Process('filter')
  async filter(job: Job<FilterUrlInput>) {
    const { url, urls } = job.data;
    return this.filterUrlProcess.execute(url.url, urls);
  }

  @OnQueueCompleted({ name: 'filter' })
  onFilterCompleted(job: Job<FilterUrlInput>, result: string[]) {
    this.eventEmitter.emit(
      'url-placement.filtered',
      new FilteredUrlEvent(job.data.url, result),
    );

    this.logger.log({
      message: 'Filtered urls',
      content: {
        length: result.length,
        urls: result
          .slice(0, 3)
          .map((url) => url.substring(0, 100).concat('...')),
      },
    });
  }

  @Process('verify')
  async verify(job: Job<VerifyUrlInput>) {
    const { urls } = job.data;
    return this.verifyUrlProcess.execute(urls);
  }

  @OnQueueCompleted({ name: 'verify' })
  onVerifyCompleted(job: Job<VerifyUrlInput>, result: string[]) {
    this.eventEmitter.emit(
      'url-placement.verified',
      new VerifiedUrlEvent(job.data.url, result),
    );

    this.logger.log({
      message: 'Verified urls',
      content: {
        length: result.length,
        urls: result
          .slice(0, 3)
          .map((url) => url.substring(0, 100).concat('...')),
      },
    });
  }

  @Process('store')
  async store(job: Job<StoreUrlInput>) {
    const { urls } = job.data;
    await this.storeUrlProcess.execute(urls);
  }

  @OnQueueCompleted({ name: 'store' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStoreCompleted(job: Job<StoreUrlInput>) {
    const { urls } = job.data;
    this.logger.log({
      message: 'Stored url',
      content: {
        length: urls.length,
        urls: urls
          .slice(0, 3)
          .map((url) => url.url.substring(0, 100).concat('...')),
        depth: urls[0].depth,
      },
    });
  }
}
