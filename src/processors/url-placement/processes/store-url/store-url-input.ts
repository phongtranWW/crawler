import { Url } from '@processors/url-placement/processes/store-url/url-schema';

export class StoreUrlInput {
  constructor(public readonly urls: Url[]) {}
}
