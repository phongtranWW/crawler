import { MinioModule } from '@definitions/modules/minio.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Html,
  HtmlSchema,
} from '@processors/html-placement/processes/store-html/html-schema';
import { StoreHtmlProcess } from '@processors/html-placement/processes/store-html/store-html-process';

@Module({
  imports: [
    MinioModule,
    MongooseModule.forFeature([{ name: Html.name, schema: HtmlSchema }]),
  ],
  providers: [StoreHtmlProcess],
  exports: [StoreHtmlProcess],
})
export class StoreHtmlProcessModule {}
