import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Poll } from '../entities/poll.entity';
import { PollsService } from '../polls.service';
import { UpdatePolicyInterceptor } from './update.policy.interceptor';

describe('UpdatePolicyInterceptor', () => {
  let interceptor: UpdatePolicyInterceptor;
  let pollService: PollsService;
  let context: ExecutionContext;
  let next: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePolicyInterceptor,
        {
          provide: PollsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: 1 },
          user: { id: 2 },
        }),
      }),
    } as unknown as ExecutionContext;

    next = { handle: jest.fn() };

    interceptor = module.get<UpdatePolicyInterceptor>(UpdatePolicyInterceptor);
    pollService = module.get<PollsService>(PollsService);
  });

  describe('if the poll has already been published', () => {
    it('should throw a BadRequestException', async () => {
      const poll = {
        user: { id: 2 },
        publishDate: new Date('1994-01-01'),
      } as Poll;
      jest.spyOn(pollService, 'findOne').mockResolvedValueOnce(poll);

      await expect(interceptor.intercept(context, next)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('if the user is authorized and the poll has not been published', () => {
    it('should call next.handle()', async () => {
      const poll = {
        user: { id: 2 },
        publishDate: new Date('3023-05-01'),
      } as Poll;
      jest.spyOn(pollService, 'findOne').mockResolvedValueOnce(poll);

      await interceptor.intercept(context, next);

      expect(next.handle).toHaveBeenCalled();
    });
  });
});
