import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PollsService } from '../polls.service';

@Injectable()
export class UpdatePolicyInterceptor implements NestInterceptor {

  constructor(
    private readonly pollService: PollsService
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    // Find the poll associated with the user
    const poll = await this.pollService.findOne({ where: { id: userId }, relations: ['user'] });

    // Check if the user is authorized to update the poll
    if (poll.user.id !== userId) {
      throw new UnauthorizedException('You are not authorized to update polls of other users');
    }

    // Check if the poll has already been published
    if (poll.publishDate < new Date()) {
      throw new BadRequestException('Cannot update poll after it has been published');
    }

    // If all checks pass, proceed with the update
    return next.handle();
  }
}
