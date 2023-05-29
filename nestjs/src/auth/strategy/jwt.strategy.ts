import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configServie: ConfigService,
    private readonly userService: UsersService,
    private readonly clsService: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServie.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findOne({
        username: payload.username,
      });
      const { password, ...safeUser } = user;
      this.clsService.set('user', safeUser);
      return safeUser;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
