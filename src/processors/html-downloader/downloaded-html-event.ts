import { UrlQueue } from '@definitions/types/url-queue';

export class DownloadedHtmlEvent {
  constructor(
    public readonly url: UrlQueue,
    public readonly html: string,
  ) {}
}
