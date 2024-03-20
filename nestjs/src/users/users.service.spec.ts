import { NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../../test/helper/repository.mock';
import { MockRepository } from '../../test/helper/type/mockRepository.type';
import { SignupDto } from '../auth/dto/signup.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserCommand } from './cqrs/commands/create-user-command';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
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
      password: 'testpassword',
    };

    it('should execute CreateUserCommand', async () => {
      await service.create(signupDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateUserCommand(signupDto),
      );
    });
  });
});
