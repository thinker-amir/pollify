import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { HasNotParticipated } from '../decorator/has-not-participated.decorator';
import { IsItTimeToParticipate } from '../decorator/is-it-time-to-participate.decorator';

export class CreateParticipateDto {
  @ApiProperty({ description: "It should be fill by a poll's option ID" })
  @IsNumber()
  @IsItTimeToParticipate()
  @HasNotParticipated()
  pollOption: number;
}
