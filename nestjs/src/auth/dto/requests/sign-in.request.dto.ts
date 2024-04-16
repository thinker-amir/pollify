import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({ example: 'eshpitegah' })
  @IsString()
  @Length(2, 20)
  username: string;

  @ApiProperty({ example: 'dummy-secret' })
  @IsString()
  @MinLength(8)
  password: string;
}
