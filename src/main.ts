import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';
import {AuthModule} from "./auth/auth.module";
import {GuardService} from "./auth/service/auth.gard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      //disableErrorMessages: true,
    }),
  );
  app.useGlobalGuards(app.select(AuthModule).get(GuardService));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));


  await app.listen(9090);
}
bootstrap();
