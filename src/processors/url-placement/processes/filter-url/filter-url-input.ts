import { UrlQueue } from '@definitions/types/url-queue';

export class FilterUrlInput {
  constructor(
    public readonly url: UrlQueue,
    public readonly urls: string[],
  ) {}
}
