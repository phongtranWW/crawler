import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Minio from 'minio';
import {
  Html,
  HtmlDocument,
} from '@processors/html-placement/processes/store-html/html-schema';
import { randomUUID } from 'crypto';

@Injectable()
export class StoreHtmlProcess {
  constructor(
    @InjectModel(Html.name)
    private readonly htmlModel: Model<HtmlDocument>,
    @Inject('MinioClient')
    private readonly minioClient: Minio.Client,
  ) {}

  async execute(url: string, html: string): Promise<HtmlDocument> {
    const bucket = new URL(url).hostname;
    const file = `${randomUUID()}.html`;

    const buffer = Buffer.from(html, 'utf-8');

    if ((await this.minioClient.bucketExists(bucket)) === false) {
      await this.minioClient.makeBucket(bucket);
    }

    await this.minioClient.putObject(bucket, file, buffer, buffer.length, {
      contentType: 'text/html',
    });

    return await this.htmlModel.create(new Html(url, file, bucket));
  }
}
