import { UrlQueue } from '@definitions/types/url-queue';

export class VerifiedHtmlEvent {
  constructor(
    public readonly url: UrlQueue,
    public readonly html: string,
    public readonly hasSeen: boolean,
  ) {}
}
