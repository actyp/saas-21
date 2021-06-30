import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import * as Redis from 'ioredis';

@Injectable()
export class RedisClientService {
  private _client: Redis.Redis;

  constructor(private readonly redisService: RedisService) {
    this._client = this.redisService.getClient();
  }

  async getClient(): Promise<Redis.Redis> {
    return this.redisService.getClient();
  }

  async hmset(key: string, ...args): Promise<boolean> {
    const result = await this._client.hmset(key, args);
    return result === 'OK';
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this._client.hgetall(key);
  }
}
