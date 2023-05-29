import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiBody({ type: SigninDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Request() req) {
        return this.authService.signIn(req.user);
    }

    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiConflictResponse({ description: 'Conflict' })
    @Public()
    @Post('sign-up')
    signUp(@Body() signupDto: SignupDto) {
        return this.authService.signUp(signupDto);
    }

    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiBearerAuth()
    @Get('profile')
    profile() {
        return this.authService.profile()
    }
}
