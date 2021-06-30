import { Module } from '@nestjs/common';
import { RedisClientService } from '../redis-client/redis-client.service';
import { RedisModule } from 'nestjs-redis';
import { redisConfig } from '../redis-client/config';
import { QuestionManagementService } from './question-management.service';

@Module({
  imports: [RedisModule.register(redisConfig), RedisClientService],
  providers: [QuestionManagementService, RedisClientService],
  exports: [QuestionManagementService],
})
export class QuestionManagementModule {}
