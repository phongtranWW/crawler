import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Hash,
  HashSchema,
} from '@processors/html-placement/processes/verify-html/hash-schema';
import { VerifyHtmlProcess } from '@processors/html-placement/processes/verify-html/verify-html-process';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hash.name, schema: HashSchema }]),
  ],
  providers: [VerifyHtmlProcess],
  exports: [VerifyHtmlProcess],
})
export class VerifyHtmlProcessModule {}
