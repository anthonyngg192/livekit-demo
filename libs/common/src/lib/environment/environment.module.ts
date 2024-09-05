import { AppEnvironmentService } from './environment.service';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

@Global()
@Module({
  providers: [AppEnvironmentService],
  exports: [AppEnvironmentService],
})
export class EnvironmentModule {
  static register(envProvider: Provider): DynamicModule {
    return {
      providers: [envProvider],
      exports: [envProvider],
      module: EnvironmentModule,
    };
  }
}
