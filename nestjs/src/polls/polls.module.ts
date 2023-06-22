import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from '../aws/s3/s3.module';
import { CoverController } from './cover.controller';
import { CoverService } from './cover.service';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { PollOptionsService } from './poll-options.service';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption]), S3Module],
  controllers: [PollsController, CoverController],
  providers: [
    PollsService,
    PollOptionsService,
    CoverService,
    {
      provide: 'OwnerGuardService',
      useClass: PollsService,
    },
  ],
  exports: [PollsService, PollOptionsService],
})
export class PollsModule {}
