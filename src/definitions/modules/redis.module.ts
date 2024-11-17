import { DynamicModule, Global, Module } from '@nestjs/common';
import { createClient, RedisClientOptions } from 'redis';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(options: {
    useFactory: (
      ...args: any[]
    ) => Promise<RedisClientOptions> | RedisClientOptions;
    inject?: any[];
  }): DynamicModule {
    const redisProvider = {
      provide: 'RedisClient',
      useFactory: async (...args: any[]) => {
        const redisOptions = await options.useFactory(...args);
        const client = createClient(redisOptions);
        await client.connect();
        return client;
      },
      inject: options.inject || [],
    };

    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
