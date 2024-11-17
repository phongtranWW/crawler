import { UrlQueue } from '@definitions/types/url-queue';

export class VerifyUrlInput {
  constructor(
    public readonly url: UrlQueue,
    public readonly urls: string[],
  ) {}
}