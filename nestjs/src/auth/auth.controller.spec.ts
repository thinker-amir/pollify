import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

const mockAuthService: Partial<AuthService> = {
  signIn: jest.fn(),
  signUp: jest.fn(),
  profile: jest.fn(),
};

const mockUser = {
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@test.com',
  username: 'testuser',
  password: 'testpassword',
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const user = { username: 'testuser', password: 'testpassword' };
      jest
        .spyOn(authService, 'signIn')
        .mockImplementation(() =>
          Promise.resolve({ access_token: 'testtoken' }),
        );

      const result = await controller.signIn({ user });

      expect(result).toEqual({ access_token: 'testtoken' });
    });
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const signupDto: SignupDto = mockUser;

      await controller.signUp(signupDto);

      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('profile', () => {
    it('should call PollsService.findOne with the correct parameters', async () => {
      await controller.profile();
      expect(authService.profile).toHaveBeenCalled();
    });
  });
});
