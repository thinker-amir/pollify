import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import s3 from './config/s3';
import { S3Service } from './s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [s3],
    }),
  ],
  providers: [
    S3Service,
    {
      provide: 'S3',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const s3Config = configService.get('aws.s3');
        return new S3Client(s3Config);
      },
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
