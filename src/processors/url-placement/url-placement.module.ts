import { Module } from '@nestjs/common';
import { UrlPlacement } from '@processors/url-placement/url-placement';
import { ExtractUrlProcessModule } from '@processors/url-placement/processes/extract-url/extract-url-process.module';
import { FilterUrlProcessModule } from '@processors/url-placement/processes/filter-url/filter-url-process.module';
import { StoreUrlProcessModule } from '@processors/url-placement/processes/store-url/store-url-process.module';
import { VerifyUrlProcessModule } from './processes/verify-url/verify-url-process.module';

@Module({
  imports: [
    VerifyUrlProcessModule,
    ExtractUrlProcessModule,
    FilterUrlProcessModule,
    StoreUrlProcessModule,
  ],
  providers: [UrlPlacement],
})
export class UrlPlacementModule {}
