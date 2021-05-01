import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import * as Redis from 'ioredis';

@Injectable()
export class RedisClientService {
  private _client: Redis.Redis;

  constructor(private readonly redisService: RedisService) {
    this._client = this.redisService.getClient();
  }

  async hgetall(key: string): Promise<Record<string, any>> {
    return this._client.hgetall(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this._client.lrange(key, start, stop);
  }

  async smembers(key: string): Promise<string[]> {
    return this._client.smembers(key);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this._client.zrange(key, start, stop);
  }
}
