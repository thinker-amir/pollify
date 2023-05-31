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
    const pollOption = await this.pollOptionsService.findOne({
      where: { id: value },
      relations: ['poll'],
    });

    const currentDate = new Date();
    const publishDate = new Date(pollOption.poll.publishDate);
    const expireDate = new Date(publishDate);
    expireDate.setMinutes(expireDate.getMinutes() + pollOption.poll.duration);

    return currentDate > publishDate && currentDate < expireDate;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Can't participate in a poll that is not available at this time";
  }
}
