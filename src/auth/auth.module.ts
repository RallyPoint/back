import {HttpModule, MiddlewareConsumer, Module} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import {JwtModule, JwtService} from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './controller/auth.controller';
import {GithubService} from "./service/github.service";

import * as fs from 'fs';
import * as config from 'config';
import {JwtMiddleware} from "./service/jwt.middleware";
import {GuardService} from "./service/auth.gard";

const privateKey = fs.readFileSync(config.get("cert.jwt.private"));

@Module({
  imports: [
    UsersModule,
    HttpModule,
    PassportModule,
    JwtModule.register({
      signOptions: { algorithm: "RS256", expiresIn: '60d'},
      verifyOptions:  { algorithms: ["RS256"]},
      privateKey: atob(config.get('cert.jwt.private')),
      publicKey: atob(config.get('cert.jwt.public'))
    }),
  ],
  providers: [AuthService,GithubService, JwtMiddleware, GuardService],
  exports: [AuthService, JwtMiddleware, GuardService],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(JwtMiddleware)
        .forRoutes('*');
  }
}
