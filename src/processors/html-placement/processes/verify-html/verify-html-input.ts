import { UrlQueue } from '@definitions/types/url-queue';

export class VerifyHtmlInput {
  constructor(
    readonly url: UrlQueue,
    readonly html: string,
  ) {}
}
