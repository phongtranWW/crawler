import { RedisModule } from '@definitions/modules/redis.module';
import { Module } from '@nestjs/common';
import { VerifyUrlProcess } from '@processors/url-placement/processes/verify-url/verify-url-process';

@Module({
  imports: [RedisModule],
  providers: [VerifyUrlProcess],
  exports: [VerifyUrlProcess],
})
export class VerifyUrlProcessModule {}
