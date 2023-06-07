import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PollOptionsService } from '../../polls/poll-options.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class ParticipateTimeValidator implements ValidatorConstraintInterface {
  constructor(private readonly pollOptionsService: PollOptionsService) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const now = new Date();
    const pollOption = await this.pollOptionsService.findOne({
      where: { id: value },
      relations: ['poll'],
    });
    return (
      pollOption.poll.publishDate < now && pollOption.poll.expireDate > now
    );
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Can't participate in a poll that is not available at this time";
  }
}
