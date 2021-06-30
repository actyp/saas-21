import { Module } from '@nestjs/common';
import { RedisClientService } from '../redis-client/redis-client.service';
import { RedisModule } from 'nestjs-redis';
import { redisConfig } from '../redis-client/config';
import { DataLayerService } from './data-layer.service';

@Module({
  imports: [RedisModule.register(redisConfig), RedisClientService],
  providers: [DataLayerService, RedisClientService],
  exports: [DataLayerService],
})
export class DataLayerModule {}
