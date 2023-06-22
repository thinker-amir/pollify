import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participate } from './entities/participate.entity';
import { ParticipatesController } from './participates.controller';
import { ParticipatesService } from './participates.service';
import { PollsModule } from '../polls/polls.module';
import { ParticipateTimeValidator } from './validator/participate-time-validator';
import { HasNotParticipatedValidator } from './validator/has-not-participate-validator';

@Module({
  providers: [
    ParticipatesService,
    ParticipateTimeValidator,
    HasNotParticipatedValidator,
    {
      provide: 'OwnerGuardService',
      useClass: ParticipatesService,
    },
  ],
  controllers: [ParticipatesController],
  imports: [TypeOrmModule.forFeature([Participate]), PollsModule],
})
export class ParticipatesModule {}
