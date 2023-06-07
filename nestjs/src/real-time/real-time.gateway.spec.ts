import { Test, TestingModule } from '@nestjs/testing';
import { RealTimeGateway } from './real-time.gateway';
import { RealTimeService } from './real-time.service';

describe('RealTimeGateway', () => {
  let gateway: RealTimeGateway;
  let realTimeService: RealTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RealTimeGateway,
        { provide: RealTimeService, useValue: { getResults: jest.fn() } },
      ],
    }).compile();

    realTimeService = module.get<RealTimeService>(RealTimeService);
    gateway = module.get<RealTimeGateway>(RealTimeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleMessage', () => {
    it('should call realTimeService.getResults and return its result', () => {
      const client = {};
      const payload = {};
      const expectResponse = { foo: 'bar' } as any;

      jest.spyOn(realTimeService, 'getResults').mockReturnValue(expectResponse);

      const result = gateway.handleMessage(client, payload);

      expect(realTimeService.getResults).toHaveBeenCalled();
      expect(result).toEqual(expectResponse);
    });
  });
});
