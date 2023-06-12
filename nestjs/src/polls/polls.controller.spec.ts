import { Test, TestingModule } from '@nestjs/testing';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';

describe('PollsController', () => {
  let controller: PollsController;
  let pollsService: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [
        {
          provide: PollsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllWithUserParticipation: jest.fn(),
            findOne: jest.fn(),
            findOneWithUserParticipation: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    pollsService = module.get<PollsService>(PollsService);
    controller = module.get<PollsController>(PollsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call PollsService.create with the correct parameters', async () => {
      const createPollDto = {} as CreatePollDto;
      await controller.create(createPollDto);

      expect(pollsService.create).toHaveBeenCalledWith(createPollDto);
    });
  });

  describe('findAll', () => {
    it('should call PollsService.findAllWithUserParticipation', async () => {
      await controller.findAll();

      expect(pollsService.findAllWithUserParticipation).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call PollsService.findOneWithUserParticipation with the correct parameters', async () => {
      const id = 1;
      await controller.findOne(id);

      expect(pollsService.findOneWithUserParticipation).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('update', () => {
    it('should call PollsService.update with the correct parameters', async () => {
      const id = 1;
      const updatePollDto: UpdatePollDto = { title: 'the new name' };
      await controller.update(id, updatePollDto);

      expect(pollsService.update).toHaveBeenCalledWith(id, updatePollDto);
    });
  });

  describe('remove', () => {
    it('should call PollsService.remove with the correct parameters', async () => {
      const id = 1;
      await controller.remove(id);

      expect(pollsService.remove).toHaveBeenCalledWith(id);
    });
  });
});
