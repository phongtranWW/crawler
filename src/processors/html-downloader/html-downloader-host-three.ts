import {
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HtmlDownloader } from '@processors/html-downloader/html-downloader';
import { Job } from 'bull';
import { DownloadHtmlInput } from '@processors/html-downloader/download-html-input';

@Processor('html-downloader-host-three')
export class htmlDownloaderHostThree extends HtmlDownloader {
  constructor(eventEmitter: EventEmitter2) {
    super(eventEmitter);
  }

  @Process('download')
  async download(job: Job<DownloadHtmlInput>) {
    return super.download(job);
  }

  @OnQueueCompleted({ name: 'download' })
  onHtmlDownloaded(
    job: Job<DownloadHtmlInput>,
    result: {
      status: number;
      html: string;
    },
  ) {
    super.onHtmlDownloaded(job, result);
  }

  @OnQueueError({ name: 'download' })
  onHtmlDownloadFailed(job: Job<DownloadHtmlInput>, error: Error) {
    super.onHtmlDownloadFailed(job, error);
  }
}
