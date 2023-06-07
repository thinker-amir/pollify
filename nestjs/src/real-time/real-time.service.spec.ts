import { Test, TestingModule } from '@nestjs/testing';
import { RealTimeService } from './real-time.service';
import { PollsService } from '../polls/polls.service';
import { json } from 'stream/consumers';

describe('RealTimeService', () => {
  let service: RealTimeService;
  let pollsService: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RealTimeService,
        {
          provide: PollsService,
          useValue: { findAll: jest.fn() },
        },
      ],
    }).compile();

    pollsService = module.get<PollsService>(PollsService);
    service = module.get<RealTimeService>(RealTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getResults', () => {
    it('should return calculated poll results', async () => {
      const now = new Date();
      const mockPolls = [
        {
          id: 1,
          publishDate: new Date(now.getTime() - 100),
          expireDate: new Date(now.getTime() + 1000),
          options: [
            {
              id: 1,
              label: 'A',
              participates: [{}, {}],
            },
            {
              id: 2,
              label: 'B',
              participates: [{}],
            },
          ],
        },
      ] as any;

      jest.spyOn(pollsService, 'findAll').mockResolvedValue(mockPolls);

      const results = await service.getResults();

      expect(results).toBeDefined();
      expect(results[0].totalParticipates).toEqual(3);
      expect(results[0].options[0].votePercentage).toEqual('66.67');
      expect(results[0].options[0].voteCount).toEqual(2);
      expect(results[0].options[1].votePercentage).toEqual('33.33');
      expect(results[0].options[1].voteCount).toEqual(1);
    });
  });
});
