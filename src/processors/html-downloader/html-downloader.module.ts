import { Module } from '@nestjs/common';
import { HtmlDownloaderHostOne } from './html-downloader-host-one';
import { HtmlDownloaderHostTwo } from './html-downloader-host-two';
import { htmlDownloaderHostThree } from './html-downloader-host-three';

@Module({
  providers: [
    HtmlDownloaderHostOne,
    HtmlDownloaderHostTwo,
    htmlDownloaderHostThree,
  ],
})
export class HtmlDownloaderModule {}
