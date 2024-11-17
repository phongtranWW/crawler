import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => {
  return {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  };
});
