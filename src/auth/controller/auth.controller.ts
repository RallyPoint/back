
import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { GithubAuthGuard } from '../guard/github-auth.guard';
import { CreateUserDto } from '../../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(@Request() req) {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  getTokenAfterGithubAuth(@Request() req) {
    return this.authService.login(req.user);
  }
}