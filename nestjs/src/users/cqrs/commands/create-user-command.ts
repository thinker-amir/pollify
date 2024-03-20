import { SigninDto } from 'src/auth/dto/signin.dto';

export class CreateUserCommand {
  constructor(public readonly signupDto: SigninDto) {}
}
