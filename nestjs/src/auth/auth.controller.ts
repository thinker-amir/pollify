import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignupRequestDto } from './dto/requests/signup.request.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { SignInResponseDto } from './dto/responses/sign-in.response.dto';
import { plainToInstance } from 'class-transformer';
import { ProfileResponseDto } from './dto/responses/profile.response.dto';
import { SignInRequestDto } from './dto/requests/sign-in.request.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignInRequestDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Request() req): Promise<SignInResponseDto> {
    return plainToInstance(
      SignInResponseDto,
      this.authService.signIn(req.user),
    );
  }

  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @Public()
  @Post('sign-up')
  signUp(@Body() signupDto: SignupRequestDto) {
    return this.authService.signUp(signupDto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('profile')
  async profile(): Promise<ProfileResponseDto> {
    return plainToInstance(
      ProfileResponseDto,
      await this.authService.profile(),
    );
  }
}
