import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StoreHtmlInput } from '@processors/html-placement/processes/store-html/store-html-input';
import { StoreHtmlProcess } from '@processors/html-placement/processes/store-html/store-html-process';
import { VerifyHtmlProcess } from '@processors/html-placement/processes/verify-html/verify-html-process';
import { VerifyHtmlInput } from '@processors/html-placement/processes/verify-html/verify-html-input';
import { VerifiedHtmlEvent } from '@processors/html-placement/processes/verify-html/verified-html-event';
import { Logger } from '@nestjs/common';
import { Html } from '@processors/html-placement/processes/store-html/html-schema';

@Processor('html-placement')
export class HtmlPlacement {
  private readonly logger = new Logger(HtmlPlacement.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly storeHtmlProcess: StoreHtmlProcess,
    private readonly verifyHtmlProcess: VerifyHtmlProcess,
  ) {}

  @Process('verify')
  async verify(job: Job<VerifyHtmlInput>) {
    const { html } = job.data;
    return await this.verifyHtmlProcess.execute(html);
  }

  @OnQueueCompleted({ name: 'verify' })
  onVerifyCompleted(job: Job<VerifyHtmlInput>, result: boolean) {
    const { url, html } = job.data;
    this.eventEmitter.emit(
      'html-placement.verified',
      new VerifiedHtmlEvent(url, html, result),
    );

    this.logger.log({
      message: 'Verified html',
      content: {
        url: url.url.substring(0, 100).concat('...'),
        html: html.substring(0, 100).concat('...'),
        hasSeen: result,
      },
    });
  }

  @Process('store')
  async store(job: Job<StoreHtmlInput>): Promise<Html> {
    const { url, html } = job.data;
    return await this.storeHtmlProcess.execute(url.url, html);
  }

  @OnQueueCompleted({ name: 'store' })
  onStoreCompleted(job: Job<StoreHtmlInput>, result: Html) {
    const { url, html } = job.data;
    this.logger.log({
      message: 'Stored html',
      content: {
        url: url.url.substring(0, 100).concat('...'),
        html: html.substring(0, 100).concat('...'),
        minio: {
          bucket: result.bucket,
          file: result.file,
        },
      },
    });
  }
}
