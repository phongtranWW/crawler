import { UrlQueue } from '@definitions/types/url-queue';

export class StoreHtmlInput {
  constructor(
    public readonly url: UrlQueue,
    public readonly html: string,
  ) {}
}
