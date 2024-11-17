import { BullModuleOptions } from '@nestjs/bull';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'urlPlacement',
  () =>
    ({
      limiter: {
        max: parseInt(process.env.URL_PLACEMENT_LIMITER_MAX, 10) || 10,
        duration:
          parseInt(process.env.URL_PLACEMENT_LIMITER_DURATION, 10) || 1000,
        bounceBack: process.env.URL_PLACEMENT_LIMITER_BOUNCE_BACK === 'true',
      },
      defaultJobOptions: {
        removeOnComplete:
          process.env.URL_PLACEMENT_DEFAULT_JOB_OPTIONS_REMOVE_ON_COMPLETE ===
          'true',
        removeOnFail:
          process.env.URL_PLACEMENT_DEFAULT_JOB_OPTIONS_REMOVE_ON_FAIL ===
          'true',
        backoff:
          parseInt(process.env.URL_PLACEMENT_DEFAULT_JOB_OPTIONS_BACKOFF, 10) ||
          0,
        attempts:
          parseInt(
            process.env.URL_PLACEMENT_DEFAULT_JOB_OPTIONS_ATTEMPTS,
            10,
          ) || 0,
      },
    }) as BullModuleOptions,
);
