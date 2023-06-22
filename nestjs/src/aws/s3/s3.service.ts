import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  constructor(@Inject('S3') private s3: S3Client) {}

  async uploadFile(file: Express.Multer.File, bucket: string): Promise<string> {
    const fileName = `${uuid()}${extname(file.originalname)}`;

    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      return fileName;
    } catch (err) {
      console.error('Error uploading file to S3', err);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteFile(fileName: string, bucket: string): Promise<void> {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(params));
    } catch (err) {
      console.error('Error deleting file from S3', err);
      throw new Error('Failed to delete file from S3');
    }
  }
}
