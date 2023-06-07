import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RealTimeService } from './real-time.service';

@WebSocketGateway({ cors: true })
export class RealTimeGateway {
  constructor(private readonly realTimeService: RealTimeService) {}
  @SubscribeMessage('live-polls-results')
  handleMessage(client: any, payload: any) {
    return this.realTimeService.getResults();
  }
}
