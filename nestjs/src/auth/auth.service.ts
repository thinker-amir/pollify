import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../common/utils/hash/hash.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        try {
            const user = await this.usersService.findOne({ username });
            if (user && await this.hashService.compare(pass, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            throw new UnauthorizedException()
        }
    }

    signUp(signupDto: SignupDto) {
        return this.usersService.create(signupDto);
    }

    async signIn(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async profile(username: string) {
        return await this.usersService.findOne({ username });
    }
}
