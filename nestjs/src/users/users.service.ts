import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from '../auth/dto/signup.dto';
import { CreateUserCommand } from './cqrs/commands/create-user-command';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commandBus: CommandBus,
  ) {}

  async findOne(where: object) {
    const user = await this.userRepository.findOne({ where });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return user;
  }

  async create(signupDto: SignupDto) {
    await this.commandBus.execute(new CreateUserCommand(signupDto));
  }
}
