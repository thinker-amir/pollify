import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserCommand } from '../commands/create-user-command';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { HashService } from '../../../common/utils/hash/hash.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly hashService: HashService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand) {
    const { signupDto } = command;
    signupDto.password = await this.hashService.hash(signupDto.password);
    const user = this.userRepository.create(signupDto);
    try {
      await this.userRepository.save(user);
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException(error.detail);
      }
      throw error;
    }
  }
}
