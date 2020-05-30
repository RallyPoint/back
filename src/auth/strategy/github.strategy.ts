
import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: "4ba2522ac3257f9dfac3",
      clientSecret: "0e311c95fa681773ce49b8d67df73ad46a0e097b",
      callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    });
  }

  async validate (accessToken, refreshToken, profile, cb) {
    return profile;
  }
}