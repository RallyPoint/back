
import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { AuthService } from '../service/auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      ...config.get('OAuth').github
    });
  }

  async validate (accessToken, refreshToken, profile, cb) {
    if (!profile) {
      throw new UnauthorizedException();
    }
    let user = null;
    try {
      user = await this.authService.findUserByGithubUserName(profile.username);
      return this.authService.login(user);
    }
    catch (error) {
      return await this.authService.register({
        githubUserName: profile.username,
        email: null,
        firstName: null,
        lastName: null,
        password: null
      });
    }
  }

}