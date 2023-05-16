import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn()
          }
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    localStrategy = module.get<LocalStrategy>(LocalStrategy)
  });

  it('should be defined', () => {
    expect(LocalStrategy).toBeDefined();
  });

  it('should create a new instance of Strategy', () => {
    expect(localStrategy).toBeInstanceOf(Strategy);
  });

  describe('validate', () => {
    it('should call AuthService.validateUser with the correct arguments then return a user', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const user = { id: 1, username };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      const result = await localStrategy.validate(username, password);

      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
      expect(result).toEqual(user);
    });

    it('should throw an UnauthorizedException if AuthService.validateUser returns null', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      try {
        await localStrategy.validate(username, password);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException)
      }
    });
  });

});
