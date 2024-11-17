import { ExtractUrlProcess } from '@processors/url-placement/processes/extract-url/extract-url-process';

describe('ExtractUrlProcess', () => {
  let extractUrlProcess: ExtractUrlProcess;

  beforeAll(() => {
    extractUrlProcess = new ExtractUrlProcess();
  });

  it('should extract urls from html', async () => {
    // Arange
    const url = 'https://www.topcv.vn/';
    const html =
      '<h1>URL Extractor Test</h1><p>Dưới đây là danh sách các liên kết:</p><a href=/ ></a> <a href="/viec-lam/chuyen-vien-quan-ly-du-lieu-va-khai-thac-thong-tin-data-analytics/1511125.html?ta_source=BoxFeatureJob_LinkDetail"></a> <a href="/viec-lam/assistant-brand-manager-thu-nhap-tu-14tr-nhan-hang-beauty/1493472.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730093588337%3A%3A1493472%3A%3A3"></a> <a href="/viec-lam/truong-phong-kinh-doanh-bat-dong-san-tai-ha-noi/1503194.html?ta_source=SuggestSimilarJob_LinkDetail&jr_i=rule-based-v0%3A%3A1730094544889%3A%3A1503194%3A%3A2"></a> <a href=/cong-ty/cong-ty-co-phan-bat-dong-san-g-empire/100311.html></a> <a href="/brand/educa/tuyen-dung/nhan-vien-telesale-tu-van-tuyen-sinh-tu-6-thang-kn-telesale-100-data-san-ti-le-chot-cao-luong-cung-9tr-11tr-hoa-hong-thuong-nong-j1503983.html?ta_source=BoxFeatureJob_LinkDetail"></a>';

    // Act
    const result = await extractUrlProcess.execute(url, html);

    // Assert
    expect(result).toHaveLength(6);
  });
});
