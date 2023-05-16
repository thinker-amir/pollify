import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashModule } from '../common/utils/hash/hash.module';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HashModule
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
