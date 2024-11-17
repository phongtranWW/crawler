import { Model } from 'mongoose';
import {
  Url,
  UrlDocument,
  UrlSchema,
  UrlStatus,
} from '@processors/url-placement/processes/store-url/url-schema';
import { StoreUrlProcess } from '@processors/url-placement/processes/store-url/store-url-process';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

describe('StoreUrlProcess', () => {
  let storeUrlProcess: StoreUrlProcess;
  let urlModel: Model<UrlDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://crawler:crawler123@localhost:27017', {
          dbName: 'crawler',
        }),
        MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
      ],
      providers: [StoreUrlProcess],
    }).compile();

    storeUrlProcess = module.get<StoreUrlProcess>(StoreUrlProcess);
    urlModel = module.get<Model<UrlDocument>>(getModelToken(Url.name));
  });

  it('should store url', async () => {
    const url = new Url(
      'https://careerviet.vn/vi/tim-viec-lam/chuyen-vien-kinh-doanh-bds-inhouse.35C219DC.html',
      0,
      UrlStatus.DOWNLOADED,
    );

    await storeUrlProcess.execute(url);

    expect(
      await urlModel.findOne({
        url: 'https://careerviet.vn/vi/tim-viec-lam/chuyen-vien-kinh-doanh-bds-inhouse.35C219DC.html',
      }),
    ).not.toBeNull();
  });

  it('should store urls', async () => {
    const urls = [
      new Url(
        'https://careerviet.vn/vi/tim-viec-lam/chuyen-vien-kinh-doanh-bds-inhouse.35C219DC.html',
        0,
        UrlStatus.DOWNLOADED,
      ),
      new Url('https://careerviet.vn/vi', 0, UrlStatus.PENDING),
      new Url(
        'https://careerviet.vn/vi/tim-viec-lam/qc-team-leader.35C236B9.html',
        0,
        UrlStatus.DOWNLOADED,
      ),
    ];

    await storeUrlProcess.execute(urls);

    expect(
      await urlModel.findOne({
        url: 'https://careerviet.vn/vi/tim-viec-lam/qc-team-leader.35C236B9.html',
      }),
    ).not.toBeNull();
  });
});
