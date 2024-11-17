import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class VerifyUrlProcess {
  private key = 'urls';

  constructor(
    @Inject('RedisClient')
    private readonly redisClient: RedisClientType,
  ) {}

  async execute(urls: string[]): Promise<string[]> {
    const newUrls: string[] = [];

    for (const url of urls) {
      const exists = await this.redisClient.bf.exists(this.key, url);

      if (!exists) {
        newUrls.push(url);
        await this.redisClient.bf.add(this.key, url);
      }
    }

    return newUrls;
  }
}
