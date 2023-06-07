import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { PollOptionsService } from './poll-options.service';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption])],
  controllers: [PollsController],
  providers: [PollsService, PollOptionsService],
  exports: [PollsService, PollOptionsService],
})
export class PollsModule {}
