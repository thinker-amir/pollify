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

  findSiblingIds(id: number) {
    return this.pollOpotionRepository
      .createQueryBuilder('po')
      .select('po.id as id')
      .innerJoin('poll_option', 'po2', 'po."pollId" = po2."pollId"')
      .where('po2.id = :id', { id })
      .getRawMany();
  }
}
