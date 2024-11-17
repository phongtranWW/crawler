import { FilterUrlProcess } from '@processors/url-placement/processes/filter-url/filter-url-process';
import {
  UrlPattern,
  UrlPatternDocument,
  UrlPatternSchema,
} from '@processors/url-placement/processes/filter-url/url-pattern-schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('ExtractUrlProcess', () => {
  let filterUrlProcess: FilterUrlProcess;
  let urlPatternModel: Model<UrlPatternDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://crawler:crawler123@localhost:27017', {
          dbName: 'crawler',
        }),
        MongooseModule.forFeature([
          { name: UrlPattern.name, schema: UrlPatternSchema },
        ]),
      ],
      providers: [FilterUrlProcess],
    }).compile();

    filterUrlProcess = module.get<FilterUrlProcess>(FilterUrlProcess);
    urlPatternModel = module.get<Model<UrlPatternDocument>>(
      getModelToken(UrlPattern.name),
    );
  });

  afterEach(async () => {
    await urlPatternModel.deleteMany({});
  });

  it('should be return 6/6 urls', async () => {
    // Arrange
    const urlPattern = new UrlPattern('careerviet.vn', [
      '^https:\\/\\/careerviet.vn(\\/(vi|en)|)\\/tim-viec-lam\\/[a-z0-9-]+.[A-Za-z0-9]*.html?(?:\\?.*)?(?:#.*)?$',
      '^https:\\/\\/careerviet.vn(\\/(vi|en)|)\\/viec-lam\\/[a-z0-9-]+.[A-Za-z0-9]*.html?(?:\\?.*)?(?:#.*)?$',
      '^https:\\/\\/careerviet.vn(\\/(vi|en)|)\\/nha-tuyen-dung\\/[a-z0-9-]+.[A-Za-z0-9]*.html?(?:\\?.*)?(?:#.*)?$',
    ]);
    await urlPatternModel.create(urlPattern);

    const urls = [
      'https://careerviet.vn/viec-lam/tat-ca-viec-lam-trang-5-vi.html',
      'https://careerviet.vn/viec-lam/ban-hang-kinh-doanh-c31-trang-2-vi.html',
      'https://careerviet.vn/vi/nha-tuyen-dung/cong-ty-tnhh-bat-dong-san-tsh-land.35A9278C.html',
      'https://careerviet.vn/vi/nha-tuyen-dung/cong-ty-co-phan-hai-bon-bay.35A91C9F.html',
      'https://careerviet.vn/vi/nha-tuyen-dung/cong-ty-co-phan-giai-phap-tu-dong-hoa-etek.35A83292.html',
      'https://careerviet.vn/vi/tim-viec-lam/truong-buu-cuc-toan-quoc.35C225C7.html',
    ];

    // Act
    const filteredUrls = await filterUrlProcess.execute(
      'https://careerviet.vn/vi',
      urls,
    );

    // Assert
    expect(filteredUrls).toHaveLength(6);
  });
});
