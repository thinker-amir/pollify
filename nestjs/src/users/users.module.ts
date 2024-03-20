import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashModule } from '../common/utils/hash/hash.module';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserCommand } from './cqrs/commands/create-user-command';
import { CreateUserHandler } from './cqrs/handlers/create-user-handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashModule, CqrsModule],
  providers: [UsersService, CreateUserCommand, CreateUserHandler],
  exports: [UsersService],
})
export class UsersModule {}
