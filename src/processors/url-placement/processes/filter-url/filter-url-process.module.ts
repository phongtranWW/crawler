import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlPattern, UrlPatternSchema } from './url-pattern-schema';
import { FilterUrlProcess } from '@processors/url-placement/processes/filter-url/filter-url-process';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UrlPattern.name, schema: UrlPatternSchema },
    ]),
  ],
  providers: [FilterUrlProcess],
  exports: [FilterUrlProcess],
})
export class FilterUrlProcessModule {}
