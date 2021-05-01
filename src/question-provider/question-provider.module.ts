import { Module } from '@nestjs/common';
import { RedisClientService } from '../redis-client/redis-client.service';
import { RedisModule } from 'nestjs-redis';
import { redisConfig } from '../redis-client/config';
import { QuestionProviderService } from './question-provider.service';

@Module({
  imports: [RedisModule.register(redisConfig), RedisClientService],
  providers: [QuestionProviderService, RedisClientService],
  exports: [QuestionProviderService],
})
export class QuestionProviderModule {}
