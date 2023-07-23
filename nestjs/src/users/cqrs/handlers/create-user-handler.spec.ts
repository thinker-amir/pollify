import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashService } from '../../../common/utils/hash/hash.service';
import { User } from '../../../users/entities/user.entity';
import { mockRepository } from '../../../../test/helper/repository.mock';
import { MockRepository } from 'test/helper/type/mockRepository.type';
import { CreateUserHandler } from './create-user-handler';
import { CreateUserCommand } from '../commands/create-user-command';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { ConflictException } from '@nestjs/common';

describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler;
  let userRepository: MockRepository;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    hashService = module.get<HashService>(HashService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
    createUserHandler = module.get<CreateUserHandler>(CreateUserHandler);
  });

  it('should be defined', () => {
    expect(createUserHandler).toBeDefined();
  });

  describe('execute', () => {
    const signupDto: SignupDto = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@test.com',
      username: 'testuser',
      password: 'testpassword',
    };
    it('should create a new user', async () => {
      // Arrange
      const expectedUser = { id: 1, password: 'hashedPassword', ...signupDto };
      const command = new CreateUserCommand(signupDto);
      jest.spyOn(hashService, 'hash').mockResolvedValue(expectedUser.password);
      jest.spyOn(userRepository, 'create').mockReturnValue(signupDto as User);

      // Act
      await createUserHandler.execute(command);

      // Assert
      expect(hashService.hash).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalledWith(signupDto);
      expect(userRepository.save).toHaveBeenCalledWith(signupDto);
    });

    it('should throw ConflictException when a unique constraint violation occurs', async () => {
      // Arrange
      const command = new CreateUserCommand(signupDto);
      const error = {
        code: '23505',
        detail: 'Unique constraint violation',
      };
      jest.spyOn(hashService, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(signupDto as User);
      jest.spyOn(userRepository, 'save').mockRejectedValue(error);

      // Act & Assert
      await expect(createUserHandler.execute(command)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw the original error when it is not a unique constraint violation', async () => {
      // Arrange
      const command = new CreateUserCommand(signupDto);
      const error = new Error('Some error');
      jest.spyOn(hashService, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(signupDto as User);
      jest.spyOn(userRepository, 'save').mockRejectedValue(error);

      // Act & Assert
      await expect(createUserHandler.execute(command)).rejects.toThrow(error);
    });
  });
});
