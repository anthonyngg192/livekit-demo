import { CacheConnection } from './provider/cache.connection';
import { Injectable } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Injectable()
export class CacheService extends RedisCacheService {
  public override db = 8;

  constructor(protected readonly cacheOptions: CacheConnection) {
    super(cacheOptions.modelRedisConnection || cacheOptions.redisConnection);
  }
}
