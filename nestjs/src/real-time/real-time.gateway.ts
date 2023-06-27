import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsThrottlerGuard } from 'src/common/guard/ws-throttler.guard';
import { RealTimeService } from './real-time.service';

@WebSocketGateway({ cors: true })
export class RealTimeGateway {
  constructor(private readonly realTimeService: RealTimeService) {}

  @UseGuards(WsThrottlerGuard)
  @SubscribeMessage('live-polls-results')
  handleMessage(client: any, payload: any) {
    return this.realTimeService.getResults();
  }
}
