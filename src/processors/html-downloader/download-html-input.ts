import { UrlQueue } from '@definitions/types/url-queue';

export class DownloadHtmlInput {
  constructor(
    public readonly url: UrlQueue,
    public readonly delay?: number,
  ) {}
}
