import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClsService } from 'nestjs-cls';
import { PollOptionsService } from '../../polls/poll-options.service';
import { ParticipatesService } from '../participates.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class HasNotParticipatedValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly participatesService: ParticipatesService,
    private readonly pollOptionsService: PollOptionsService,
    private readonly cls: ClsService,
  ) {}

  async validate(
    pollOptionId: number,
    args: ValidationArguments,
  ): Promise<boolean> {
    const user = this.cls.get('user');
    const optionsIds = await this.pollOptionsService.findSiblingIds(
      pollOptionId,
    );
    try {
      await this.participatesService.findOne({
        where: { user, pollOption: optionsIds },
      });
    } catch (error) {
      return error.status === HttpStatus.NOT_FOUND;
    }
    return false;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Can't participate in a poll that you have already participated!";
  }
}
