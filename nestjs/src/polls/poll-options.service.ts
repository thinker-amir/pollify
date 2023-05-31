import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PollOption } from './entities/poll-option.entity';

@Injectable()
export class PollOptionsService {
  constructor(
    @InjectRepository(PollOption)
    private readonly pollOpotionRepository: Repository<PollOption>,
  ) {}

  async findOne(options: FindOneOptions) {
    const pollOption = await this.pollOpotionRepository.findOne(options);

    if (!pollOption) {
      throw new NotFoundException(
        `PollOption #${options.where['id']} not found!`,
      );
    }

    return pollOption;
  }
}
