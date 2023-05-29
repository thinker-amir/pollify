import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { HashService } from '../common/utils/hash/hash.service';
import { AuthService } from './auth.service';
import { ClsService } from 'nestjs-cls';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let hashService: HashService;
  let clsService: ClsService;
  const mockUser: any = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@test.com',
    username: 'testuser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    clsService = module.get<ClsService>(ClsService);
    hashService = module.get<HashService>(HashService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if username and password are correct', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => mockUser);
      jest.spyOn(hashService, 'compare').mockImplementation(async () => true);

      const result = await service.validateUser(
        mockUser.username,
        mockUser.password,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(async () => {
        throw new NotFoundException(`User not found!`);
      });

      try {
        const result = await service.validateUser(
          'nonexistentuser',
          'testpassword',
        );
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return null if password is incorrect', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => mockUser);
      jest.spyOn(hashService, 'compare').mockImplementation(async () => false);

      const result = await service.validateUser(
        mockUser.username,
        'testpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('signUp', () => {
    it('should call usersService.create with the correct arguments', async () => {
      const { id, ...signupDto } = mockUser;
      jest
        .spyOn(usersService, 'create')
        .mockImplementation(async () => mockUser);

      const result = await service.signUp(signupDto);

      expect(usersService.create).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual({ id: 1, ...signupDto });
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const mockUser = { username: 'testuser', userId: 1 };

      jest.spyOn(jwtService, 'sign').mockImplementation(() => 'mocktoken');

      const result = await service.signIn(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 1,
      });
      expect(result).toEqual({ access_token: 'mocktoken' });
    });
  });

  describe('profile', () => {
    it('should call clsService.get with the correct argument', async () => {
      jest.spyOn(clsService, 'get').mockImplementation(async () => mockUser);

      const result = await service.profile();

      expect(clsService.get).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUser);
    });
  });
});
