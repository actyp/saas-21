import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisClientService } from '../redis-client/redis-client.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { RedisModule } from 'nestjs-redis';
import { redisConfig } from '../redis-client/config';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.refresh_token_secret,
    }),
    RedisModule.register(redisConfig),
    RedisClientService,
  ],
  providers: [AuthService, RedisClientService],
  exports: [AuthService],
})
export class AuthModule {}
