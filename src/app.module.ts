import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.access_token_secret,
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
