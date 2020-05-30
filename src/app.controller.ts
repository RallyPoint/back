
import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
import { AuthService } from './auth/service/auth.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { GithubAuthGuard } from './auth/guard/github-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('auth/github')
  @UseGuards(GithubAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('auth/github/callback')
  @UseGuards(GithubAuthGuard)
  googleAuthRedirect(@Request() req) {
    console.log(req.user);
  }
}