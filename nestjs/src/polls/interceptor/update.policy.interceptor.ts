import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PollsService } from '../polls.service';

@Injectable()
export class UpdatePolicyInterceptor implements NestInterceptor {
  constructor(private readonly pollService: PollsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const poll = await this.pollService.findOne({ where: { id } });

    // Check if the poll has already been published
    if (poll.publishDate < new Date()) {
      throw new BadRequestException(
        'Cannot update poll after it has been published',
      );
    }

    return next.handle();
  }
}
