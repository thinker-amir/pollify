import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignInResponseDto {
  @Expose()
  access_token: string;
}
