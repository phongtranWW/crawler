import { createClient, RedisClientType } from 'redis';
import { VerifyUrlProcess } from '@processors/url-placement/processes/verify-url/verify-url-process';
import { Test, TestingModule } from '@nestjs/testing';

describe('VerifyUrlProcess', () => {
  let redis: RedisClientType;
  let verifyUrlProcess: VerifyUrlProcess;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyUrlProcess,
        {
          provide: 'RedisClient',
          useFactory: async () => {
            const client = createClient({
              url: 'redis://localhost:6379',
            });
            await client.connect();
            return client;
          },
        },
      ],
    }).compile();

    redis = module.get<RedisClientType>('RedisClient');
    verifyUrlProcess = module.get<VerifyUrlProcess>(VerifyUrlProcess);
  });

  afterEach(async () => {
    await redis.flushAll();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('should be return 0/6 urls', async () => {
    // Arrange
    const urls = [
      'https://www.topcv.vn/',
      'https://www.topcv.vn/viec-lam/chuyen-vien-quan-ly-du-lieu-va-khai-thac-thong-tin-data-analytics/1511125.html?ta_source=BoxFeatureJob_LinkDetail',
      'https://www.topcv.vn/viec-lam/assistant-brand-manager-thu-nhap-tu-14tr-nhan-hang-beauty/1493472.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730093588337%3A%3A1493472%3A%3A3',
      'https://www.topcv.vn/viec-lam/truong-phong-kinh-doanh-bat-dong-san-tai-ha-noi/1503194.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730094544889%3A%3A1503194%3A%3A2',
      'https://www.topcv.vn/cong-ty/cong-ty-co-phan-bat-dong-san-g-empire/100311.html',
      'https://www.topcv.vn/brand/educa/tuyen-dung/nhan-vien-telesale-tu-van-tuyen-sinh-tu-6-thang-kn-telesale-100-data-san-ti-le-chot-cao-luong-cung-9tr-11tr-hoa-hong-thuong-nong-j1503983.html?ta_source=BoxFeatureJob_LinkDetail',
    ];
    if (!(await redis.exists('urls'))) {
      await redis.bf.reserve('urls', 0.01, 1000000);
    }
    await redis.bf.mAdd('urls', urls);

    // Act
    const newUrls = await verifyUrlProcess.execute(urls);

    // Assert
    expect(newUrls).toHaveLength(0);
  });

  it('should be return 6/6 urls', async () => {
    // Arrange
    const urls = [
      'https://www.topcv.vn/',
      'https://www.topcv.vn/viec-lam/chuyen-vien-quan-ly-du-lieu-va-khai-thac-thong-tin-data-analytics/1511125.html?ta_source=BoxFeatureJob_LinkDetail',
      'https://www.topcv.vn/viec-lam/assistant-brand-manager-thu-nhap-tu-14tr-nhan-hang-beauty/1493472.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730093588337%3A%3A1493472%3A%3A3',
      'https://www.topcv.vn/viec-lam/truong-phong-kinh-doanh-bat-dong-san-tai-ha-noi/1503194.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730094544889%3A%3A1503194%3A%3A2',
      'https://www.topcv.vn/cong-ty/cong-ty-co-phan-bat-dong-san-g-empire/100311.html',
      'https://www.topcv.vn/brand/educa/tuyen-dung/nhan-vien-telesale-tu-van-tuyen-sinh-tu-6-thang-kn-telesale-100-data-san-ti-le-chot-cao-luong-cung-9tr-11tr-hoa-hong-thuong-nong-j1503983.html?ta_source=BoxFeatureJob_LinkDetail',
    ];
    if (!(await redis.exists('urls'))) {
      await redis.bf.reserve('urls', 0.01, 1000000);
    }

    // Act
    const newUrls = await verifyUrlProcess.execute(urls);

    // Assert
    expect(newUrls).toHaveLength(6);
  });

  it('should be return 3/6 urls', async () => {
    // Arrange
    const urls = [
      'https://www.topcv.vn/',
      'https://www.topcv.vn/viec-lam/chuyen-vien-quan-ly-du-lieu-va-khai-thac-thong-tin-data-analytics/1511125.html?ta_source=BoxFeatureJob_LinkDetail',
      'https://www.topcv.vn/viec-lam/assistant-brand-manager-thu-nhap-tu-14tr-nhan-hang-beauty/1493472.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730093588337%3A%3A1493472%3A%3A3',
      'https://www.topcv.vn/viec-lam/truong-phong-kinh-doanh-bat-dong-san-tai-ha-noi/1503194.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730094544889%3A%3A1503194%3A%3A2',
      'https://www.topcv.vn/cong-ty/cong-ty-co-phan-bat-dong-san-g-empire/100311.html',
      'https://www.topcv.vn/brand/educa/tuyen-dung/nhan-vien-telesale-tu-van-tuyen-sinh-tu-6-thang-kn-telesale-100-data-san-ti-le-chot-cao-luong-cung-9tr-11tr-hoa-hong-thuong-nong-j1503983.html?ta_source=BoxFeatureJob_LinkDetail',
    ];
    if (!(await redis.exists('urls'))) {
      await redis.bf.reserve('urls', 0.01, 1000000);
    }
    await redis.bf.mAdd('urls', [urls[0], urls[1], urls[2]]);

    // Act
    const newUrls = await verifyUrlProcess.execute(urls);

    // Assert
    expect(newUrls).toHaveLength(3);
  });
});
