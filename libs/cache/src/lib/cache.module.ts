import { CacheConnection } from './provider/cache.connection';
import { CacheService } from './cache.service';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class AppCacheModule {
  static forRoot(connectionProvider: Provider<CacheConnection>): DynamicModule {
    return {
      module: AppCacheModule,
      providers: [CacheService, connectionProvider],
      exports: [CacheService],
    };
  }
}
