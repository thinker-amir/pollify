import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClsService } from 'nestjs-cls';
import { ParticipatesService } from '../participates.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class HasNotParticipatedValidator
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly participatesService: ParticipatesService,
    private readonly cls: ClsService,
  ) {}

  async validate(
    pollOptionId: number,
    args: ValidationArguments,
  ): Promise<boolean> {
    const user = this.cls.get('user');
    try {
      const existingParticipation = await this.participatesService.findOne({
        where: { user, pollOption: { id: pollOptionId } },
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
