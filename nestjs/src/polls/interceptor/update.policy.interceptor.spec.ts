import { BadRequestException, CallHandler, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
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
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        user: { id: 1 },
      }),
    } as unknown as ExecutionContext;

    next = {
      handle: jest.fn().mockReturnValue(new Observable()),
    } as CallHandler;

    interceptor = module.get<UpdatePolicyInterceptor>(UpdatePolicyInterceptor);
    pollService = module.get<PollsService>(PollsService);
  });

  describe('if the user is not authorized to update the poll', () => {
    it('should throw an UnauthorizedException ', async () => {
      const poll = {
        user: { id: 2 }
      };
      jest.spyOn(pollService, 'findOne').mockResolvedValueOnce(poll as Poll);

      await expect(interceptor.intercept(context, next)).rejects.toThrow(UnauthorizedException);
    });
  })


  describe('if the poll has already been published', () => {
    it('should throw a BadRequestException', async () => {
      const poll = {
        user: { id: 1 },
        publishDate: new Date('1994-01-01'),
      } as Poll;
      jest.spyOn(pollService, 'findOne').mockResolvedValueOnce(poll);

      await expect(interceptor.intercept(context, next)).rejects.toThrow(BadRequestException);
    });
  })


  describe('if the user is authorized and the poll has not been published', () => {
    it('should call next.handle()', async () => {
      const poll = {
        user: { id: 1 },
        publishDate: new Date('3023-05-01'),
      } as Poll;
      jest.spyOn(pollService, 'findOne').mockResolvedValueOnce(poll);

      await interceptor.intercept(context, next);

      expect(next.handle).toHaveBeenCalled();
    });
  })

});
