import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOpotionRepository: Repository<PollOption>,
    private readonly cls: ClsService,
  ) {}

  async create(createPollDto: CreatePollDto) {
    const options = await this.preloadOptions(createPollDto.options);
    const user = await this.cls.get('user');
    const poll = this.pollRepository.create({
      ...createPollDto,
      options,
      user,
    });
    await this.pollRepository.save(poll);
  }

  async findAll() {
    return await this.pollRepository.find();
  }

  async findOne(options: FindOneOptions) {
    const poll = await this.pollRepository.findOne(options);

    if (!poll) {
      throw new NotFoundException(`Poll #${options.where['id']} not found!`);
    }

    return poll;
  }

  async update(id: number, updatePollDto: UpdatePollDto) {
    const options =
      updatePollDto.options &&
      (await this.preloadOptions(updatePollDto.options));

    const poll = await this.pollRepository.preload({
      id: +id,
      ...updatePollDto,
      options,
    });

    if (!poll) {
      throw new NotFoundException(`Poll #${id} not found!`);
    }

    return this.pollRepository.save(poll);
  }

  async remove(id: number) {
    const poll = await this.findOne({ where: { id: +id } });
    return this.pollRepository.remove(poll);
  }

  private async preloadOptions(options: string[]): Promise<any> {
    return await Promise.all(
      options.map((label) => this.pollOpotionRepository.create({ label })),
    );
  }
}
