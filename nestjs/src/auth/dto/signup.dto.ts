import { IsString, Length, MinLength, IsEmail, IsAlpha } from "class-validator";

export class SignupDto {
    @IsAlpha()
    @Length(2, 20)
    name: string;

    @IsAlpha()
    @Length(2, 20)
    surname: string;

    @IsString()
    @Length(2, 20)
    username: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEmail()
    email: string;
}
