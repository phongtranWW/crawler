import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Model } from 'mongoose';
import { QueueRouter, QueueRouterDocument } from '@schemas/queue-router.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('Crawler (e2e)', () => {
  let app: INestApplication;
  let queueRouterModel: Model<QueueRouterDocument>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    queueRouterModel = moduleFixture.get<Model<QueueRouterDocument>>(
      getModelToken(QueueRouter.name),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be run successfully', () => {});
});
