import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { IsDateGreaterThanNow } from '../../common/decorator/validation/is-date-greater-than-now.decorator';

export class CreatePollDto {
  @ApiProperty({ example: 'Which Stack do you love more?' })
  @IsString()
  @Length(3, 63)
  title: string;

  @ApiProperty({ example: 'I know it is a difficult decision :)' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description:
      'Publish date selection should be allowed from current time onwards',
  })
  @IsDate()
  @IsDateGreaterThanNow()
  publishDate: Date;

  @ApiProperty({
    description: 'The duration of the poll in minutes',
  })
  @IsNumber({}, { message: 'Poll duration must be a number' })
  @Min(5, { message: 'Poll duration must be at least 5 minutes' })
  @Max(1440, {
    message: 'Poll duration can not be more than 24 hours (1440 minutes)',
  })
  durationInMinutes: number = 5;

  @ApiProperty({ example: [] })
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @IsNotEmpty({ each: true })
  options: string[];
}
