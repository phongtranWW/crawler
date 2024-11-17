import { Module } from '@nestjs/common';
import { HtmlPlacement } from '@processors/html-placement/html-placement';
import { StoreHtmlProcessModule } from '@processors/html-placement/processes/store-html/store-html-process.module';
import { VerifyHtmlProcessModule } from '@processors/html-placement/processes/verify-html/verify-html-process.module';

@Module({
  imports: [StoreHtmlProcessModule, VerifyHtmlProcessModule],
  providers: [HtmlPlacement],
})
export class HtmlPlacementModule {}
