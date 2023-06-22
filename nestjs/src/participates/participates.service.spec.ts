import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { PollOption } from 'src/polls/entities/poll-option.entity';
import { Poll } from 'src/polls/entities/poll.entity';
import { User } from 'src/users/entities/user.entity';
import { MockRepository } from 'test/helper/type/mockRepository.type';
import { mockRepository } from '../../test/helper/repository.mock';
import { PollOptionsService } from '../polls/poll-options.service';
import { CreateParticipateDto } from './dto/create-participate.dto';
import { UpdateParticipateDto } from './dto/update-participate.dto';
import { Participate } from './entities/participate.entity';
import { ParticipatesService } from './participates.service';

const mockPollOption: PollOption = {
  id: 1,
  label: 'option 1',
  poll: {} as Poll,
  participates: [],
};
const mockUser: User = {
  id: 1,
  name: 'john',
  surname: 'doe',
  username: 'johny',
  password: 'secret',
  email: 'john.doe@email.com',
  polls: [],
  participates: [],
};
const mockParticipate: Participate = {
  id: 1,
  user: mockUser,
  pollOption: mockPollOption,
};

describe('ParticipateService', () => {
  let service: ParticipatesService;
  let participateRepository: MockRepository;
  let pollOptionsService: PollOptionsService;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipatesService,
        {
          provide: getRepositoryToken(Participate),
          useValue: mockRepository(),
        },
        {
          provide: PollOptionsService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: ClsService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    clsService = module.get<ClsService>(ClsService);
    pollOptionsService = module.get<PollOptionsService>(PollOptionsService);
    participateRepository = module.get<MockRepository>(
      getRepositoryToken(Participate),
    );
    service = module.get<ParticipatesService>(ParticipatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new participate', async () => {
      const createParticipateDto: CreateParticipateDto = { pollOption: 1 };
      jest
        .spyOn(pollOptionsService, 'findOne')
        .mockResolvedValue(mockPollOption);
      jest.spyOn(clsService, 'get').mockImplementation(() => mockUser);
      jest
        .spyOn(participateRepository, 'create')
        .mockReturnValue(mockParticipate);
      jest
        .spyOn(participateRepository, 'save')
        .mockReturnValue(mockParticipate);

      await service.create(createParticipateDto);

      expect(pollOptionsService.findOne).toHaveBeenCalledWith({
        where: { id: createParticipateDto.pollOption },
      });
      expect(clsService.get).toHaveBeenCalledWith('user');
      expect(participateRepository.create).toHaveBeenCalledWith({
        pollOption: mockPollOption,
        user: mockUser,
      });
      expect(participateRepository.save).toHaveBeenCalledWith(mockParticipate);
    });
  });

  describe('findAll', () => {
    it('should return all participates', async () => {
      const participates = [mockParticipate];
      participateRepository.find.mockResolvedValue(participates);

      const result = await service.findAll();

      expect(participateRepository.find).toHaveBeenCalled();
      expect(result).toEqual(participates);
    });
  });

  describe('findOne', () => {
    it('should return a participate if found', async () => {
      const options = { where: { id: 1 } };

      participateRepository.findOne.mockResolvedValue(mockParticipate);

      const result = await service.findOne(options);

      expect(participateRepository.findOne).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockParticipate);
    });

    it('should throw NotFoundException if participate not found', async () => {
      const options = { where: { id: 1 } };

      participateRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(options)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const id = 1;
    const updateParticipateDto: UpdateParticipateDto = {
      pollOption: 2,
    };
    it('should update a participate if exist', async () => {
      service.findOne = jest.fn().mockResolvedValue(mockParticipate);
      jest
        .spyOn(pollOptionsService, 'findOne')
        .mockResolvedValue(mockPollOption);
      jest
        .spyOn(participateRepository, 'save')
        .mockResolvedValue(mockParticipate);

      jest.spyOn(clsService, 'get').mockImplementation(() => mockUser);

      const result = await service.update(id, updateParticipateDto);

      expect(service.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(pollOptionsService.findOne).toHaveBeenCalledWith({
        where: { id: updateParticipateDto.pollOption },
      });
      expect(participateRepository.save).toHaveBeenCalledWith(mockParticipate);
      expect(result).toEqual(mockParticipate);
    });

    it('should throw NotFoundException if participate not found', async () => {
      const options = { where: { id: 1 } };

      try {
        const result = await service.update(id, updateParticipateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`participate not found!`);
      }

      await expect(service.findOne(options)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a participate', async () => {
      const id = 1;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockParticipate);
      jest
        .spyOn(participateRepository, 'remove')
        .mockResolvedValue(mockParticipate);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(participateRepository.remove).toHaveBeenCalledWith(
        mockParticipate,
      );
      expect(result).toEqual(mockParticipate);
    });
  });
});
