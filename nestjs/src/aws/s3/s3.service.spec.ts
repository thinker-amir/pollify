import { S3Client } from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';

describe('S3Service', () => {
  let service: S3Service;
  let s3Client: jest.Mocked<S3Client>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: 'S3',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    s3Client = module.get('S3');
    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload file to S3', async () => {
      const file = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const bucket = 'testBucket';

      const fileName = await service.uploadFile(file, bucket);

      // Capture the sent command and extract its input property
      const sentCommand = s3Client.send.mock.calls[0][0].input;

      // Create the expected command input
      const expectedCommand = {
        Bucket: bucket,
        Key: fileName,
        Body: file.buffer,
      };

      expect(sentCommand).toEqual(expectedCommand);
    });
  });

  describe('deleteFile', () => {
    it('should delete file from S3', async () => {
      const fileName = 'testFile.jpg';
      const bucket = 'testBucket';

      await service.deleteFile(fileName, bucket);

      // Capture the sent command and extract its input property
      const sentCommand = s3Client.send.mock.calls[0][0].input;

      // Create the expected command input
      const expectedCommand = {
        Bucket: bucket,
        Key: fileName,
      };

      expect(sentCommand).toEqual(expectedCommand);
    });
  });
});
