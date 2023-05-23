import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '../../test/helper/type/mockRepository.type';
import { SignupDto } from '../auth/dto/signup.dto';
import { HashService } from '../common/utils/hash/hash.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
})

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository()
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn()
          }
        }
      ],
    }).compile();

    hashService = module.get<HashService>(HashService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User))
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    const where = { username: 'test.username' };
    describe('when user with query exists', () => {
      it('should return the user object', async () => {
        const expectedUser = {};

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findOne(where);

        expect(user).toEqual(expectedUser);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException', async () => {
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(where);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User not found!`);
        }
      });
    });
  });

  describe('create', () => {
    const signupDto: SignupDto = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@test.com',
      username: 'testuser',
      password: 'testpassword'
    };

    it('should call hashService.hash', async () => {
      await service.create(signupDto as SignupDto);

      expect(hashService.hash).toHaveBeenCalled();
    });

    it('should call userRepository.create with the correct argument', async () => {
      await service.create(signupDto);

      expect(userRepository.create).toHaveBeenCalledWith(signupDto);
    });

    it('should call userRepository.save with the correct argument', async () => {
      userRepository.create.mockReturnValue(signupDto);
      await service.create(signupDto);

      expect(userRepository.save).toHaveBeenCalledWith(signupDto as User);
    });

    it('should throw a ConflictException if userRepository.save throws a unique constraint violation error', async () => {
      const error = { code: '23505', detail: 'Username already exists' };
      userRepository.save.mockRejectedValue(error);

      await expect(service.create(signupDto)).rejects.toThrow(ConflictException);
    });

    it('should throw the original error if userRepository.save throws a non-unique constraint violation error', async () => {
      const error: any = { code: '12345', message: 'Some other error' };
      userRepository.save.mockRejectedValue(error);

      try {
        await service.create(signupDto)
      } catch (err) {
        expect(err).toEqual(error);
      }
    });
  });
});
