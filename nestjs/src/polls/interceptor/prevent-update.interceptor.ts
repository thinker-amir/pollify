import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PollsService } from '../polls.service';

@Injectable()
export class PreventUpdateInterceptor implements NestInterceptor {

  constructor(
    private readonly pollService: PollsService
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const poll = await this.pollService.findOne(request.param.id);
    
    if (!poll || poll.publishDate < new Date()) {
      throw new BadRequestException('Cannot update poll after publish date')
    }

    return next.handle();
  }
}
