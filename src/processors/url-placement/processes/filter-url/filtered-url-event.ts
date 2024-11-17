import { UrlQueue } from '@definitions/types/url-queue';

export class FilteredUrlEvent {
  constructor(
    public readonly url: UrlQueue,
    public readonly urls: string[],
  ) {}
}
