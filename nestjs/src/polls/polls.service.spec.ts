import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '../../test/helper/type/mockRepository.type';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdatePollDto } from './dto/update-poll.dto';

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  preload: jest.fn()
})

describe('PollsService', () => {
  let service: PollsService;
  let pollRepository: MockRepository;
  let pollOpotionRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: getRepositoryToken(Poll),
          useValue: createMockRepository()
        },
        {
          provide: getRepositoryToken(PollOption),
          useValue: createMockRepository()
        },
      ],
    }).compile();

    pollOpotionRepository = module.get<MockRepository>(getRepositoryToken(PollOption));
    pollRepository = module.get<MockRepository>(getRepositoryToken(Poll))
    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a poll with the given options and user', async () => {

      const mockCreatePollDto: CreatePollDto = {
        "title": "Which Language do you love more?",
        "description": "I know it is a difficult decision :)",
        "publishDate": new Date(),
        "duration": 5,
        "options": [
          "Typescript"
        ]
      };

      const mockUser = { id: 1, username: 'user1' };
      const mockPollOption = { id: 1, label: 'Typescript' } as PollOption;

      jest.spyOn(pollOpotionRepository, 'create').mockResolvedValue(mockPollOption);
      jest.spyOn(pollRepository, 'create').mockReturnValue({ ...mockCreatePollDto, options: mockPollOption, user: mockUser });

      await service.create(mockCreatePollDto, mockUser as User);

      expect(pollRepository.create).toHaveBeenCalledWith({ ...mockCreatePollDto, options: [mockPollOption], user: mockUser });
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

      const result = await service.findOne(1);

      expect(result).toEqual(mockPoll);
    });

    it('should throw a NotFoundException if the poll is not found', async () => {
      jest.spyOn(pollRepository, 'findOne').mockResolvedValue(null);

      expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updatePollDto: UpdatePollDto = { title: 'The New Title', options: ['Option 1 updated', 'Option 2 updated'] };
    const pollId = 1;
    it('should update a poll with the given id and options', async () => {

      const mockPoll = {
        id: pollId,
        title: 'The Old Title',
        options: [],
      };

      const expectedCoffee = { ...mockPoll, ...updatePollDto }

      pollRepository.preload.mockReturnValue(expectedCoffee);
      pollRepository.save.mockReturnValue(expectedCoffee);

      const coffee = await service.update(pollId, updatePollDto);

      expect(coffee).toEqual(expectedCoffee)
    });

    it('should throw a NotFoundException if the poll is not found', async () => {
      pollRepository.preload.mockReturnValue(undefined);

        try {
          await service.update(pollId, updatePollDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException)
          expect(err.message).toEqual(`Poll #${pollId} not found!`)
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
