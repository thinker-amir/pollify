import { Test, TestingModule } from '@nestjs/testing';
import { CoverController } from './cover.controller';
import { CoverService } from './cover.service';

describe('CoverController', () => {
  let controller: CoverController;
  let coverService: CoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoverController],
      providers: [
        {
          provide: CoverService,
          useValue: {
            uploadCover: jest.fn(),
            removeCover: jest.fn(),
          },
        },
        {
          provide: 'OwnerGuardService',
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    coverService = module.get<CoverService>(CoverService);
    controller = module.get<CoverController>(CoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should call CoverService.uploadCover with the correct parameters', async () => {
      const id = 1;
      const file = { fieldname: 'file' } as Express.Multer.File;
      controller.uploadFile(id, file);

      expect(coverService.uploadCover).toHaveBeenCalledWith(id, file);
    });
  });

  describe('remove', () => {
    it('should call CoverService.removeCover with the correct parameters', async () => {
      const id = 1;
      controller.remove(id);

      expect(coverService.removeCover).toHaveBeenCalledWith(id);
    });
  });
});
