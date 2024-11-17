import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { StoreHtmlProcess } from '@processors/html-placement/processes/store-html/store-html-process';
import * as Minio from 'minio';
import { Model } from 'mongoose';
import {
  Html,
  HtmlDocument,
  HtmlSchema,
} from '@processors/html-placement/processes/store-html/html-schema';
import { createHash } from 'crypto';

describe('StoreHtmlProcess', () => {
  let storeHtmlProcess: StoreHtmlProcess;
  let htmlModel: Model<HtmlDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://crawler:crawler123@localhost:27017', {
          dbName: 'crawler',
        }),
        MongooseModule.forFeature([{ name: Html.name, schema: HtmlSchema }]),
      ],
      providers: [
        StoreHtmlProcess,
        {
          provide: 'MinioClient',
          useValue: new Minio.Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: 'crawler',
            secretKey: 'crawler123',
          }),
        },
      ],
    }).compile();

    storeHtmlProcess = module.get<StoreHtmlProcess>(StoreHtmlProcess);
    htmlModel = module.get<Model<HtmlDocument>>(getModelToken(Html.name));
  });

  it('should store html and create html', async () => {
    // Arrange
    const url =
      'https://careerviet.vn/vi/tim-viec-lam/110122-accounting-assistant-manager-real-estate.35C17759.html';
    const html =
      '<h1>URL Extractor Test</h1><p>Dưới đây là danh sách các liên kết:</p><a href=/ ></a> <a href="/viec-lam/chuyen-vien-quan-ly-du-lieu-va-khai-thac-thong-tin-data-analytics/1511125.html?ta_source=BoxFeatureJob_LinkDetail"></a> <a href="/viec-lam/assistant-brand-manager-thu-nhap-tu-14tr-nhan-hang-beauty/1493472.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730093588337%3A%3A1493472%3A%3A3"></a> <a href="/viec-lam/truong-phong-kinh-doanh-bat-dong-san-tai-ha-noi/1503194.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730094544889%3A%3A1503194%3A%3A2"></a> <a href=/cong-ty/cong-ty-co-phan-bat-dong-san-g-empire/100311.html></a> <a href="/brand/educa/tuyen-dung/nhan-vien-telesale-tu-van-tuyen-sinh-tu-6-thang-kn-telesale-100-data-san-ti-le-chot-cao-luong-cung-9tr-11tr-hoa-hong-thuong-nong-j1503983.html?ta_source=BoxFeatureJob_LinkDetail"></a>';
    const hash = createHash('sha256').update(html).digest('hex');

    // Act
    const htmlMongo = await storeHtmlProcess.execute(url, hash);

    // Assert
    const storedHtml = await htmlModel.findOne({ file: `${hash}.html` });
    expect(storedHtml).toBe(htmlMongo);
  });
});
