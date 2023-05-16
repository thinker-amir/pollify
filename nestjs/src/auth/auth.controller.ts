import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Request() req) {
        return this.authService.signIn(req.user);
    }

    @Public()
    @Post('sign-up')
    signUp(@Body() signupDto: SignupDto) {
        return this.authService.signUp(signupDto);
    }

    @Get('profile')
    profile(@Request() req) {
        return this.authService.profile(req.user.username);
    }
}
