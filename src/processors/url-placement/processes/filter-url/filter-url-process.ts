import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UrlPattern,
  UrlPatternDocument,
} from '@processors/url-placement/processes/filter-url/url-pattern-schema';

@Injectable()
export class FilterUrlProcess {
  constructor(
    @InjectModel(UrlPattern.name)
    private readonly urlPatternModel: Model<UrlPatternDocument>,
  ) {}

  async execute(url: string, urls: string[]) {
    const hostName = new URL(url).hostname;
    const urlPattern = await this.urlPatternModel.findOne({
      hostName,
    });
    if (!urlPattern) {
      throw new Error(`No filter regex found for ${hostName}`);
    }

    return urls.filter((url) => {
      return urlPattern.regexes.some((regex) => {
        return new RegExp(regex).test(url);
      });
    });
  }
}
