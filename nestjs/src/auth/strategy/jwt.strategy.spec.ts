import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { ClsService } from 'nestjs-cls';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: UsersService;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'test-secret'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ClsService,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    clsService = module.get<ClsService>(ClsService);
    usersService = module.get<UsersService>(UsersService);
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should create a new instance of Strategy', () => {
    expect(jwtStrategy).toBeInstanceOf(Strategy);
  });

  describe('validate', () => {
    it('should return the user object if it is exists', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockPayload = { username: mockUser.username };

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => mockUser as User);

      const result = await jwtStrategy.validate(mockPayload);

      expect(usersService.findOne).toHaveBeenCalledWith(mockPayload);
      expect(clsService.set).toHaveBeenCalledWith('user', mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if findOne throws an error', async () => {
      const mockPayload = { username: 'testuser' };

      jest.spyOn(usersService, 'findOne').mockImplementation(async () => {
        throw new Error();
      });

      await expect(jwtStrategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
