import { IsString, Length, MinLength } from 'class-validator';

export class SignInRequestDto {
  @IsString()
  @Length(2, 20)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
