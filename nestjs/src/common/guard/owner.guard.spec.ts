import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { OwnerGuard } from './owner.guard';

describe('OwnerGuard', () => {
  let guard: OwnerGuard;
  let mockService: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OwnerGuard,
        {
          provide: 'OwnerGuardService',
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = moduleRef.get<OwnerGuard>(OwnerGuard);
    mockService = moduleRef.get<any>('OwnerGuardService');
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if user is owner', async () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            params: { id: 'entityId' },
            user: { id: 1 },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(mockService, 'findOne').mockResolvedValue({
        user: { id: 1 },
      });

      expect(await guard.canActivate(mockExecutionContext)).toBe(true);
    });

    it('should return false if user is not owner', async () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            params: { id: 'entityId' },
            user: { id: 1 },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(mockService, 'findOne').mockResolvedValue({
        user: { id: 30 },
      });

      expect(await guard.canActivate(mockExecutionContext)).toBe(false);
    });
  });
});
