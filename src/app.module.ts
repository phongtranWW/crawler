import { BullBoardModule } from '@bull-board/nestjs';
import bullConfig from '@config/bull.config';
import minioConfig from '@config/minio.config';
import mongoConfig from '@config/mongodb.config';
import redisConfig from '@config/redis.config';
import winstonConfig from '@config/winston.config';
import { MinioModule } from '@definitions/modules/minio.module';
import { RedisModule } from '@definitions/modules/redis.module';
import { MediatorModule } from '@mediator/mediator.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { HtmlDownloaderModule } from '@processors/html-downloader/html-downloader.module';
import { HtmlPlacementModule } from '@processors/html-placement/html-placement.module';
import { UrlPlacementModule } from '@processors/url-placement/url-placement.module';
import { WinstonModule } from 'nest-winston';
import { ExpressAdapter } from '@bull-board/express';
import urlPlacementConfig from '@config/url-placement.config';
import htmlPlacementConfig from '@config/html-placement.config';
import htmlDownloaderConfig from '@config/html-downloader.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [
        redisConfig,
        mongoConfig,
        winstonConfig,
        bullConfig,
        minioConfig,
        urlPlacementConfig,
        htmlPlacementConfig,
        htmlDownloaderConfig,
      ],
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return await configService.getOrThrow('bull');
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.getOrThrow('mongodb');
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.getOrThrow('winston');
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.getOrThrow('redis');
      },
      inject: [ConfigService],
    }),
    MinioModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return configService.getOrThrow('minio');
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    UrlPlacementModule,
    HtmlPlacementModule,
    MediatorModule,
    HtmlDownloaderModule,
  ],
})
export class AppModule {}
