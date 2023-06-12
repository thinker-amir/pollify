import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from './entities/poll.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionRepository: Repository<PollOption>,
    private readonly cls: ClsService,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<void> {
    const options = await this.createOptions(createPollDto.options);
    const expireDate = new Date(createPollDto.publishDate);
    expireDate.setMinutes(
      expireDate.getMinutes() + createPollDto.durationInMinutes,
    );
    const user = await this.cls.get('user');

    const poll = this.pollRepository.create({
      ...createPollDto,
      expireDate,
      options,
      user,
    });

    await this.pollRepository.save(poll);
  }

  async findAll(options?: FindManyOptions) {
    return await this.pollRepository.find(options);
  }

  async findAllWithUserParticipation(): Promise<Poll[]> {
    const polls = await this.findAll({
      relations: ['options.participates'],
    });
    Promise.all(polls.map(this.addParticipationInfo));

    return polls;
  }

  async findOne(options: FindOneOptions) {
    const poll = await this.pollRepository.findOne(options);

    if (!poll) {
      throw new NotFoundException(`Poll #${options.where['id']} not found!`);
    }

    return poll;
  }

  async findOneWithUserParticipation(options: FindOneOptions): Promise<Poll> {
    options.relations = ['options.participates'];
    const poll = await this.findOne(options);
    return this.addParticipationInfo(poll);
  }

  async update(id: number, updatePollDto: UpdatePollDto) {
    const options =
      updatePollDto.options &&
      (await this.createOptions(updatePollDto.options));

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

  private async createOptions(options: string[]): Promise<any> {
    return await Promise.all(
      options.map((label) => this.pollOptionRepository.create({ label })),
    );
  }

  private addParticipationInfo = async (poll: Poll) => {
    const user = await this.cls.get('user');
    const now = new Date();
    const userSelectedOption = poll.options.find((option) => {
      return option.participates.some(
        (participate) => participate.user.id === user.id,
      );
    });

    poll['user_selected_option'] = userSelectedOption
      ? userSelectedOption.id
      : null;
    poll['user_allowed_to_participate'] =
      poll.publishDate < now && poll.expireDate > now && !userSelectedOption;
    poll.options.forEach((option) => delete option.participates);

    return poll;
  };
}
