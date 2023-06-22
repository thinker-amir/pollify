import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from 'test/helper/type/mockRepository.type';
import { v4 as uuid } from 'uuid';
import { S3Service } from '../aws/s3/s3.service';
import { mockRepository } from '../../test/helper/repository.mock';
import { S3_BUCKET_NAME } from './constant/constants';
import { CoverService } from './cover.service';
import { Poll } from './entities/poll.entity';
import { PollsService } from './polls.service';

describe('CoverService', () => {
  let service: CoverService;
  let s3Service: S3Service;
  let pollsService: PollsService;
  let pollRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoverService,
        {
          provide: getRepositoryToken(Poll),
          useValue: mockRepository(),
        },
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
        {
          provide: PollsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    s3Service = module.get<S3Service>(S3Service);
    pollsService = module.get<PollsService>(PollsService);
    pollRepository = module.get<MockRepository>(getRepositoryToken(Poll));
    service = module.get<CoverService>(CoverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadCover', () => {
    const id = 1;
    const file = {
      filename: '',
    } as Express.Multer.File;
    const poll = new Poll();

    it('should upload the cover and update the poll', async () => {
      const mockUUIDFileName = `${uuid()}.png`;
      const mockOldFileName = 'oldCover.jpg';

      poll.cover = mockOldFileName;
      const findOneSpy = jest
        .spyOn(pollsService, 'findOne')
        .mockResolvedValueOnce(poll);

      const uploadFileSpy = jest
        .spyOn(s3Service, 'uploadFile')
        .mockResolvedValueOnce(mockUUIDFileName);

      const updateSpy = jest.spyOn(pollRepository, 'update');

      const deleteFileSpy = jest.spyOn(s3Service, 'deleteFile');

      await service.uploadCover(id, file);

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } });
      expect(uploadFileSpy).toHaveBeenCalledWith(file, S3_BUCKET_NAME);
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ cover: mockUUIDFileName }),
      );
      expect(deleteFileSpy).toHaveBeenCalledWith(
        mockOldFileName,
        S3_BUCKET_NAME,
      );
    });

    it('should not delete the old cover if it does not exist', async () => {
      poll.cover = null;
      const findOneSpy = jest
        .spyOn(pollsService, 'findOne')
        .mockResolvedValueOnce(poll);

      const uploadFileSpy = jest
        .spyOn(s3Service, 'uploadFile')
        .mockResolvedValueOnce('fileName');

      const updateSpy = jest.spyOn(pollRepository, 'update');

      const deleteFileSpy = jest.spyOn(s3Service, 'deleteFile');

      await service.uploadCover(id, file);

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } });
      expect(uploadFileSpy).toHaveBeenCalledWith(file, S3_BUCKET_NAME);
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ cover: 'fileName' }),
      );
      expect(deleteFileSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeCover', () => {
    const id = 1;
    const poll = new Poll();

    it('should remove the cover and update the poll', async () => {
      const mockUUIDFileName = `${uuid()}.png`;
      poll.cover = mockUUIDFileName;
      const findOneSpy = jest
        .spyOn(pollsService, 'findOne')
        .mockResolvedValueOnce(poll);

      const deleteFileSpy = jest.spyOn(s3Service, 'deleteFile');
      const updateSpy = jest.spyOn(pollRepository, 'update');

      await service.removeCover(id);

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } });
      expect(deleteFileSpy).toHaveBeenCalledWith(
        mockUUIDFileName,
        S3_BUCKET_NAME,
      );
      expect(updateSpy).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ cover: null }),
      );
    });

    it('should not remove the cover if it does not exist', async () => {
      poll.cover = null;
      const findOneSpy = jest
        .spyOn(pollsService, 'findOne')
        .mockResolvedValueOnce(poll);

      const deleteFileSpy = jest.spyOn(s3Service, 'deleteFile');
      const updateSpy = jest.spyOn(pollRepository, 'update');

      await service.removeCover(id);

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } });
      expect(deleteFileSpy).not.toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
