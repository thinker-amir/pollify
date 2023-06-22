import { registerAs } from '@nestjs/config';

function getConfig() {
  return {
    region: process.env.AWS_S3_REGION,
    forcePathStyle: true,
    endpoint: process.env.AWS_S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
  };
}

export default registerAs('aws.s3', () => getConfig());
