import { SignInRequestDto } from 'src/auth/dto/requests/sign-in.request.dto';

export class CreateUserCommand {
  constructor(public readonly signupDto: SignInRequestDto) {}
}
