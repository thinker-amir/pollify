import { Module } from '@nestjs/common';
import { PollsModule } from '../polls/polls.module';
import { RealTimeGateway } from './real-time.gateway';
import { RealTimeService } from './real-time.service';

@Module({
  providers: [RealTimeGateway, RealTimeService],
  imports: [PollsModule],
})
export class RealTimeModule {}
