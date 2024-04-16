import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsString, Length, MinLength } from 'class-validator';
import { IsUnique } from 'src/common/validations/is-unique.validation';

export class SignupRequestDto {
  @ApiProperty({ example: 'John' })
  @IsAlpha()
  @Length(2, 20)
  name: string;

  @ApiProperty({ example: 'Doe' })
  @IsAlpha()
  @Length(2, 20)
  surname: string;

  @ApiProperty({ example: 'eshpitegah' })
  @IsString()
  @IsUnique({ tableName: 'user', column: 'username' })
  @Length(2, 20)
  username: string;

  @ApiProperty({ example: 'dummy-secret' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsEmail()
  @IsUnique({ tableName: 'user', column: 'email' })
  email: string;
}
