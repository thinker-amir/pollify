import { Injectable } from '@nestjs/common';
import { LessThan, MoreThan } from 'typeorm';
import { Poll } from '../polls/entities/poll.entity';
import { PollsService } from '../polls/polls.service';

@Injectable()
export class RealTimeService {
  constructor(private readonly pollsService: PollsService) {}

  async getResults() {
    const now = new Date();
    const polls = await this.fetchActivePolls(now);
    return this.calculatePollResults(polls);
  }

  private async fetchActivePolls(now: Date) {
    return this.pollsService.findAll({
      where: { publishDate: LessThan(now), expireDate: MoreThan(now) },
      relations: ['options', 'options.participates'],
    });
  }

  private calculatePollResults(polls: Poll[]) {
    return polls.map((poll: Poll) => {
      const totalParticipates = this.calculateTotalParticipates(poll);
      const updatedOptions = this.calculateOptionResults(
        poll,
        totalParticipates,
      );
      return { ...poll, totalParticipates, options: updatedOptions };
    });
  }

  private calculateTotalParticipates(poll: Poll) {
    return poll.options.reduce(
      (acc, option) => acc + option.participates.length,
      0,
    );
  }

  private calculateOptionResults(poll: Poll, totalParticipates: number) {
    return poll.options.map((option) => {
      const voteCount = option.participates.length;
      const votePercentage = totalParticipates
        ? ((voteCount * 100) / totalParticipates).toFixed(2)
        : 0;
      delete option.participates;
      return { ...option, voteCount, votePercentage };
    });
  }
}
