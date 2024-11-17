import { UrlQueue } from '@definitions/types/url-queue';

export class ExtractUrlInput {
  constructor(
    public readonly url: UrlQueue,
    public readonly html: string,
  ) {}
}
