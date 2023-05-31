import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { FindOneOptions, Repository } from 'typeorm';
import { PollOptionsService } from '../polls/poll-options.service';
import { CreateParticipateDto } from './dto/create-participate.dto';
import { UpdateParticipateDto } from './dto/update-participate.dto';
import { Participate } from './entities/participate.entity';

@Injectable()
export class ParticipatesService {
  constructor(
    @InjectRepository(Participate)
    private readonly participateRepository: Repository<Participate>,
    private readonly pollOptionsService: PollOptionsService,
    private readonly cls: ClsService,
  ) {}

  async create(createParticipateDto: CreateParticipateDto) {
    const pollOption = await this.pollOptionsService.findOne({
      where: { id: createParticipateDto.pollOption },
    });

    const user = this.cls.get('user');

    const participate = this.participateRepository.create({ pollOption, user });
    await this.participateRepository.save(participate);
  }

  async findAll() {
    return await this.participateRepository.find();
  }

  async findOne(options: FindOneOptions) {
    const participate = await this.participateRepository.findOne(options);

    if (!participate) {
      throw new NotFoundException(`participate not found!`);
    }

    return participate;
  }

  async update(id: number, updateParticipateDto: UpdateParticipateDto) {
    const participate = await this.findOne({ where: { id } });
    this.checkAuthorization(participate);

    const pollOption = await this.pollOptionsService.findOne({
      where: { id: updateParticipateDto.pollOption },
    });

    participate.pollOption = pollOption;

    return await this.participateRepository.save(participate);
  }

  async remove(id: number) {
    const participate = await this.findOne({ where: { id } });
    this.checkAuthorization(participate);

    return this.participateRepository.remove(participate);
  }

  private checkAuthorization(participate: Participate) {
    const user = this.cls.get('user');
    if (participate.user.id !== user.id) {
      throw new ForbiddenException(
        `You are not authorized to update or remove this participate!`,
      );
    }
  }
}
