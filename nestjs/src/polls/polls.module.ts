import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { PollOptionsService } from './poll-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption])],
  controllers: [PollsController],
  providers: [PollsService, PollOptionsService],
  exports: [PollOptionsService]
})
export class PollsModule { }
