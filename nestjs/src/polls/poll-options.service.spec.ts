import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from 'test/helper/type/mockRepository.type';
import { mockRepository } from '../common/utils/test/repository.mock';
import { PollOption } from './entities/poll-option.entity';
import { PollOptionsService } from './poll-options.service';
import { Poll } from './entities/poll.entity';
import { NotFoundException } from '@nestjs/common';

const mockPollOption: PollOption = {
  id: 1,
  label: 'option 1',
  poll: {} as Poll,
  participates: [],
};

describe('PollOptionsService', () => {
  let service: PollOptionsService;
  let pollOpotionRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollOptionsService,
        {
          provide: getRepositoryToken(PollOption),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    pollOpotionRepository = module.get<MockRepository>(
      getRepositoryToken(PollOption),
    );
    service = module.get<PollOptionsService>(PollOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    const options = { where: { id: 1 } };
    it('should return a poll option if found', async () => {
      pollOpotionRepository.findOne.mockResolvedValue(mockPollOption);
      const result = await service.findOne(options);

      expect(pollOpotionRepository.findOne).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockPollOption);
    });

    it('should throw NotFoundException if poll option not found', async () => {
      pollOpotionRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(options)).rejects.toThrow(NotFoundException);
    });
  });
});
