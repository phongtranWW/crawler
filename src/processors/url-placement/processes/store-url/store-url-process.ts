import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Url,
  UrlDocument,
} from '@processors/url-placement/processes/store-url/url-schema';
import { Model } from 'mongoose';

@Injectable()
export class StoreUrlProcess {
  constructor(
    @InjectModel(Url.name)
    private readonly urlModel: Model<UrlDocument>,
  ) {}

  async execute(urls: Url[]) {
    try {
      await this.urlModel.insertMany(urls, { ordered: false });
    } catch (error) {
      // ignore
    }
  }
}
