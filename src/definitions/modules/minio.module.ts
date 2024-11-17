import { Module, Global, DynamicModule } from '@nestjs/common';
import * as Minio from 'minio';

@Global()
@Module({})
export class MinioModule {
  static forRootAsync(options: {
    useFactory: (
      ...args: any[]
    ) => Promise<Minio.ClientOptions> | Minio.ClientOptions;
    inject?: any[];
  }): DynamicModule {
    const minioProvider = {
      provide: 'MinioClient',
      useFactory: async (...args: any[]) => {
        const minioOptions = await options.useFactory(...args);
        return new Minio.Client(minioOptions);
      },
      inject: options.inject || [],
    };

    return {
      module: MinioModule,
      providers: [minioProvider],
      exports: [minioProvider],
    };
  }
}
