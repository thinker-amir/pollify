import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
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
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        }
      ],
    }).compile();

    pollsService = module.get<PollsService>(PollsService)
    controller = module.get<PollsController>(PollsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call PollsService.create with the correct parameters', async () => {
      const createPollDto = {} as CreatePollDto;
      const user = { id: 1 } as User;
      await controller.create(createPollDto, user);

      expect(pollsService.create).toHaveBeenCalledWith(createPollDto, user);
    });
  })

  describe('findAll', () => {
    it('should call PollsService.findAll', async () => {
      await controller.findAll();

      expect(pollsService.findAll).toHaveBeenCalled();
    });
  })

  describe('findOne', () => {
    it('should call PollsService.findOne with the correct parameters', async () => {
      const id = "1";
      await controller.findOne(id);

      expect(pollsService.findOne).toHaveBeenCalledWith(+id);
    })
  })

  describe('update', () => {
    it('should call PollsService.update with the correct parameters', async () => {
      const id = "1";
      const updatePollDto: UpdatePollDto = { title: 'the new name' };
      await controller.update(id, updatePollDto);

      expect(pollsService.update).toHaveBeenCalledWith(+id, updatePollDto)
    })
  })

  describe('remove', () => {
    it('should call PollsService.remove with the correct parameters', async () => {
      const id = "1";
      await controller.remove(id);

      expect(pollsService.remove).toHaveBeenCalledWith(+id)
    })
  })

});
