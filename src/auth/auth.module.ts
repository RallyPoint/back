import {HttpModule, Module} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './controller/auth.controller';
import {GithubService} from "./service/github.service";

import * as fs from 'fs';
import * as config from 'config';

const privateKey = fs.readFileSync(config.get("cert.jwt.private"));

@Module({
  imports: [
    UsersModule,
    HttpModule,
    PassportModule,
    JwtModule.register({
      signOptions: { algorithm: "RS256", expiresIn: '60d'},
      verifyOptions:  { algorithms: ["RS256"]},
      secret: privateKey,
    }),
  ],
  providers: [AuthService,GithubService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
