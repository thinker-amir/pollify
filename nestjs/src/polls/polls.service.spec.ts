import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { MockRepository } from '../../test/helper/type/mockRepository.type';
import { mockRepository } from '../common/utils/test/repository.mock';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { PollsService } from './polls.service';

describe('PollsService', () => {
  let service: PollsService;
  let pollRepository: MockRepository;
  let pollOpotionRepository: MockRepository;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getRepositoryToken(Poll),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(PollOption),
          useValue: mockRepository(),
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    clsService = module.get<ClsService>(ClsService);
    pollOpotionRepository = module.get<MockRepository>(
      getRepositoryToken(PollOption),
    );
    pollRepository = module.get<MockRepository>(getRepositoryToken(Poll));
    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a poll with the given options', async () => {
      const mockCreatePollDto: CreatePollDto = {
        title: 'Which Language do you love more?',
        description: 'I know it is a difficult decision :)',
        publishDate: new Date(),
        duration: 5,
        options: ['Typescript'],
      };

      const mockUser = { id: 1, username: 'user1' };
      const mockPollOption = { id: 1, label: 'Typescript' } as PollOption;

      jest
        .spyOn(pollOpotionRepository, 'create')
        .mockResolvedValue(mockPollOption);

      jest.spyOn(pollRepository, 'create').mockReturnValue({
        ...mockCreatePollDto,
        options: mockPollOption,
        user: mockUser,
      });

      jest.spyOn(clsService, 'get').mockImplementation(async () => mockUser);

      await service.create(mockCreatePollDto);

      expect(clsService.get).toHaveBeenCalledWith('user');
      expect(pollRepository.create).toHaveBeenCalledWith({
        ...mockCreatePollDto,
        options: [mockPollOption],
        user: mockUser,
      });
      expect(pollRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of polls', async () => {
      const mockPolls = [];
      jest.spyOn(pollRepository, 'find').mockResolvedValue(mockPolls);

      const result = await service.findAll();

      expect(result).toEqual(mockPolls);
    });
  });

  describe('findOne', () => {
    it('should return a poll with the given id', async () => {
      const mockPoll = {};
      jest.spyOn(pollRepository, 'findOne').mockResolvedValue(mockPoll);

      const result = await service.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockPoll);
    });

    it('should throw a NotFoundException if the poll is not found', async () => {
      jest.spyOn(pollRepository, 'findOne').mockResolvedValue(null);

      expect(service.findOne({ where: { id: 1 } })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updatePollDto: UpdatePollDto = {
      title: 'The New Title',
      options: ['Option 1 updated', 'Option 2 updated'],
    };
    const pollId = 1;
    it('should update a poll with the given id and options', async () => {
      const mockPoll = {
        id: pollId,
        title: 'The Old Title',
        options: [],
      };

      const expectedCoffee = { ...mockPoll, ...updatePollDto };

      pollRepository.preload.mockReturnValue(expectedCoffee);
      pollRepository.save.mockReturnValue(expectedCoffee);

      const coffee = await service.update(pollId, updatePollDto);

      expect(coffee).toEqual(expectedCoffee);
    });

    it('should throw a NotFoundException if the poll is not found', async () => {
      pollRepository.preload.mockReturnValue(undefined);

      try {
        await service.update(pollId, updatePollDto);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`Poll #${pollId} not found!`);
      }
    });
  });

  describe('remove', () => {
    it('should remove a poll with the given id', async () => {
      const mockPoll = {};
      jest.spyOn(pollRepository, 'findOne').mockResolvedValue(mockPoll);

      await service.remove(1);

      expect(pollRepository.remove).toHaveBeenCalledWith(mockPoll);
    });

    it('should throw a NotFoundException if the poll is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
