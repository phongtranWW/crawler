import { Module } from '@nestjs/common';
import { ExtractUrlProcess } from '@processors/url-placement/processes/extract-url/extract-url-process';

@Module({
  providers: [ExtractUrlProcess],
  exports: [ExtractUrlProcess],
})
export class ExtractUrlProcessModule {}
