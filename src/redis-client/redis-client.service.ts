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

  async hgetall(key: string): Promise<Record<string, string>> {
    return this._client.hgetall(key);
  }

  async hincrby(key: string, field: any, increment: number): Promise<boolean> {
    const hmget = await this._client.hmget(key, field);
    let value_before = 0;
    if (hmget[0] !== null) {
      value_before = parseInt(hmget[0]);
    }
    const result = await this._client.hincrby(key, field, increment);
    return result >= value_before + increment;
  }

  async hmset(key: string, ...args): Promise<boolean> {
    const result = await this._client.hmset(key, args);
    return result === 'OK';
  }

  async lpush(key: string, ...args): Promise<boolean> {
    const length_before = await this._client.llen(key);
    const result = await this._client.lpush(key, ...args);
    return result >= length_before + Object.keys(args).length;
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this._client.lrange(key, start, stop);
  }

  async sadd(key: string, ...args): Promise<boolean> {
    const result = await this._client.sadd(key, ...args);
    return result <= Object.keys(args).length;
  }

  async smembers(key: string): Promise<string[]> {
    return this._client.smembers(key);
  }

  async zadd(key: string, ...args): Promise<boolean> {
    const result = await this._client.zadd(key, ...args);
    return result <= Object.keys(args).length / 2;
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this._client.zrange(key, start, stop);
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return this._client.zrevrange(key, start, stop);
  }
}
