import { Test, TestingModule } from '@nestjs/testing';
import { PollOption } from 'src/polls/entities/poll-option.entity';
import { PollOptionsService } from '../../polls/poll-options.service';
import { ParticipateTimeValidator } from './participate-time-validator';

describe('ParticipateTimeValidator', () => {
  let participateTimeValidator: ParticipateTimeValidator;
  let pollOptionsService: PollOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipateTimeValidator,
        {
          provide: PollOptionsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    participateTimeValidator = module.get<ParticipateTimeValidator>(
      ParticipateTimeValidator,
    );
    pollOptionsService = module.get<PollOptionsService>(PollOptionsService);
  });

  it('should be defined', () => {
    expect(participateTimeValidator).toBeDefined();
  });

  describe('validate', () => {
    const pollOptionId = 1;
    const publishDate = new Date();
    it('should return true if the current date is within the poll availability range', async () => {
      publishDate.setMinutes(publishDate.getMinutes() - 5);
      const duration = 60;

      const pollOption = {
        poll: {
          publishDate,
          duration,
        },
      } as PollOption;

      jest.spyOn(pollOptionsService, 'findOne').mockResolvedValue(pollOption);

      const result = await participateTimeValidator.validate(pollOptionId);
      expect(result).toBe(true);
    });

    it('should return false if the current date is outside the poll availability range', async () => {
      publishDate.setMinutes(publishDate.getMinutes() - 120);
      const duration = 60;

      const pollOption = {
        poll: {
          publishDate,
          duration,
        },
      } as PollOption;

      jest.spyOn(pollOptionsService, 'findOne').mockResolvedValue(pollOption);

      const result = await participateTimeValidator.validate(pollOptionId);
      expect(result).toBe(false);
    });
  });
});
