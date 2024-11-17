import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Url,
  UrlSchema,
} from '@processors/url-placement/processes/store-url/url-schema';
import { StoreUrlProcess } from '@processors/url-placement/processes/store-url/store-url-process';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  providers: [StoreUrlProcess],
  exports: [StoreUrlProcess],
})
export class StoreUrlProcessModule {}
