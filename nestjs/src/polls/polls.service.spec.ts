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

const now = new Date();
const mockUser = { id: 1, username: 'user1' };
function createMockPolls() {
  return [
    {
      id: 1,
      title: 'Test Poll 1',
      publishDate: new Date(now.getTime() - 100),
      expireDate: new Date(now.getTime() + 1000),
      options: [
        {
          id: 1,
          label: 'Option 1',
          participates: [],
        },
        {
          id: 2,
          label: 'Option 2',
          participates: [],
        },
      ],
    },
  ];
}

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
        durationInMinutes: 5,
        options: ['Typescript'],
      };

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

      const expireDate = new Date(mockCreatePollDto.publishDate);
      expireDate.setMinutes(
        expireDate.getMinutes() + mockCreatePollDto.durationInMinutes,
      );

      await service.create(mockCreatePollDto);

      expect(clsService.get).toHaveBeenCalledWith('user');
      expect(pollRepository.create).toHaveBeenCalledWith({
        ...mockCreatePollDto,
        options: [mockPollOption],
        expireDate,
        user: mockUser,
      });
      expect(pollRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of polls', async () => {
      const mockPolls = createMockPolls();
      pollRepository.find.mockResolvedValue(mockPolls);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result).toEqual(mockPolls);
    });
  });

  describe('findAllWithUserParticipation', () => {
    it('should return all polls with user participation info', async () => {
      const mockPolls = createMockPolls();
      pollRepository.find.mockResolvedValue(mockPolls);
      jest.spyOn(clsService, 'get').mockImplementation(async () => mockUser);
      const result = await service.findAllWithUserParticipation();

      expect(pollRepository.find).toHaveBeenCalledWith({
        relations: ['options.participates'],
      });
      expect(result).toHaveLength(1);
      expect(result[0]['user_selected_option']).toEqual(null);
      expect(result[0]['user_allowed_to_participate']).toEqual(true);
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

  describe('findOneWithUserParticipation', () => {
    const findOneOptions = { where: { id: 1 } };
    describe('when the poll is on election time', () => {
      const mockPoll = createMockPolls()[0];
      describe('and the current user has not participated', () => {
        it('returns a poll object with user_allowed_to_participate set to true and user_selected_option set to null', async () => {
          pollRepository.findOne.mockResolvedValue(mockPoll);
          jest
            .spyOn(clsService, 'get')
            .mockImplementation(async () => mockUser);

          const result = await service.findOneWithUserParticipation(
            findOneOptions,
          );

          expect(result['user_selected_option']).toEqual(null);
          expect(result['user_allowed_to_participate']).toEqual(true);
        });
      });
      describe('and the current user has already participated', () => {
        beforeEach(() => {
          mockPoll.options[0].participates = [
            { id: 1, user: { id: 1 } },
            { id: 2, user: { id: 4 } },
          ];
        });

        it('returns a poll object with user_allowed_to_participate set to false and user_selected_option set to selected option id', async () => {
          pollRepository.findOne.mockResolvedValue(mockPoll);
          jest
            .spyOn(clsService, 'get')
            .mockImplementation(async () => mockUser);

          const result = await service.findOneWithUserParticipation(
            findOneOptions,
          );

          expect(result['user_selected_option']).toEqual(1);
          expect(result['user_allowed_to_participate']).toEqual(false);
        });
      });
    });

    describe('when the current time is out of the poll time', () => {
      const mockPoll = createMockPolls()[0];
      mockPoll.expireDate = new Date(now.getTime() - 100);

      it('returns a poll object with user_allowed_to_participate set to false', async () => {
        pollRepository.findOne.mockResolvedValue(mockPoll);
        jest.spyOn(clsService, 'get').mockImplementation(async () => mockUser);

        const result = await service.findOneWithUserParticipation(
          findOneOptions,
        );

        expect(result['user_allowed_to_participate']).toEqual(false);
      });
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
