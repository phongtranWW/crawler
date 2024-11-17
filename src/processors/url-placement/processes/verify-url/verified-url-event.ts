import { UrlQueue } from '@definitions/types/url-queue';

export class VerifiedUrlEvent {
  constructor(
    public readonly url: UrlQueue,
    public readonly urls: string[],
  ) {}
}
