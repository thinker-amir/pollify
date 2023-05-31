import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { ParticipatesService } from '../participates.service';
import { HasNotParticipatedValidator } from './has-not-participate-validator';

describe('HasNotParticipatedValidator', () => {
  let validator: HasNotParticipatedValidator;
  let participatesService: ParticipatesService;
  let cls: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HasNotParticipatedValidator,
        {
          provide: ParticipatesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = module.get<HasNotParticipatedValidator>(
      HasNotParticipatedValidator,
    );
    participatesService = module.get<ParticipatesService>(ParticipatesService);
    cls = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if user has not participated', async () => {
      jest.spyOn(cls, 'get').mockReturnValue({ id: 1 });
      jest
        .spyOn(participatesService, 'findOne')
        .mockRejectedValue({ status: HttpStatus.NOT_FOUND });

      const result = await validator.validate(1, null);
      expect(result).toBe(true);
    });

    it('should return false if user has participated', async () => {
      jest.spyOn(cls, 'get').mockReturnValue({ id: 1 });
      jest.spyOn(participatesService, 'findOne').mockRejectedValue({ id: 1 });

      const result = await validator.validate(1, null);
      expect(result).toBe(false);
    });
  });
});
