import { Test, TestingModule } from '@nestjs/testing';
import { CreateParticipateDto } from './dto/create-participate.dto';
import { UpdateParticipateDto } from './dto/update-participate.dto';
import { ParticipatesController } from './participates.controller';
import { ParticipatesService } from './participates.service';

describe('ParticipateController', () => {
  let controller: ParticipatesController;
  let participatesService: ParticipatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipatesController],
      providers: [
        {
          provide: ParticipatesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: 'OwnerGuardService',
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    participatesService = module.get<ParticipatesService>(ParticipatesService);
    controller = module.get<ParticipatesController>(ParticipatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the correct arguments', async () => {
      const createParticipateDto = {};
      await controller.create(createParticipateDto as CreateParticipateDto);

      expect(participatesService.create).toHaveBeenCalledWith(
        createParticipateDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      await controller.findAll();

      expect(participatesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the correct arguments', async () => {
      const id = 1;
      await controller.findOne(id);

      expect(participatesService.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('update', () => {
    it('should call service.update with the correct arguments', async () => {
      const id = 1;
      const updateParticipateDto = {};
      await controller.update(id, updateParticipateDto as UpdateParticipateDto);

      expect(participatesService.update).toHaveBeenCalledWith(
        id,
        updateParticipateDto,
      );
    });
  });

  describe('remove', () => {
    it('should call service.remove with the correct arguments', async () => {
      const id = 1;
      await controller.remove(id);

      expect(participatesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
