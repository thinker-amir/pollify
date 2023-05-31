import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { IsItTimeToParticipate } from '../decorator/is-it-time-to-participate.decorator';

export class UpdateParticipateDto {
  @ApiProperty({ description: "It should be fill by a poll's option ID" })
  @IsNumber()
  @IsItTimeToParticipate()
  pollOption: number;
}
