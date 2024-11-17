import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => {
  return {
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_USER,
    secretKey: process.env.MINIO_PASSWORD,
  };
});
