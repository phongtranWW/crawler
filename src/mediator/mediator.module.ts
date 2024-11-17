import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SelectPattern, SelectPatternSchema } from './select-pattern-schema';
import { Router, RouterSchema } from '@mediator/router-schema';
import { Mediator } from '@mediator/mediator';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Router.name, schema: RouterSchema },
      { name: SelectPattern.name, schema: SelectPatternSchema },
    ]),
    BullModule.registerQueueAsync({
      name: 'url-placement',
      useFactory: async (configService: ConfigService) => {
        return await configService.getOrThrow('urlPlacement');
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'html-placement',
      useFactory: async (configService: ConfigService) => {
        return await configService.getOrThrow('htmlPlacement');
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'html-downloader-host-one',
      useFactory: async (configService: ConfigService) => {
        return await configService.getOrThrow('htmlDownloader');
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'html-downloader-host-two',
      useFactory: async (configService: ConfigService) => {
        return await configService.getOrThrow('htmlDownloader');
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'html-downloader-host-three',
      useFactory: async (configService: ConfigService) => {
        return await configService.getOrThrow('htmlDownloader');
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forFeature({
      name: 'html-placement',
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'url-placement',
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'html-downloader-host-one',
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'html-downloader-host-two',
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'html-downloader-host-three',
      adapter: BullAdapter,
    }),
  ],
  providers: [Mediator],
})
export class MediatorModule {}
