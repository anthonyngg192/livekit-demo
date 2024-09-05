import { AppEnvironmentService, EnvironmentModule } from './environment';
import { DynamicModule, Global, Module, ModuleMetadata } from '@nestjs/common';
import { ErrorLogModel, ErrorLogSchema } from './logs/models/error-log.model';
import { ErrorLogRepository } from './logs/repositories/error-log.repository';
import { JwtModule } from '@nestjs/jwt';
import { LogModel, LogSchema } from './logs/models/log.model';
import { LogRepository } from './logs/repositories/log.repository';
import { MongooseModule } from '@nestjs/mongoose';

export interface AuthGuardOptions {
  jwtSecretKey: string;
}

export interface AuthGuardOptionsProvider extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any) => Promise<AuthGuardOptions> | AuthGuardOptions;
  inject?: any[];
}

@Global()
@Module({})
export class CommonModule {
  static foRoot(): DynamicModule {
    return {
      imports: [
        EnvironmentModule.register({
          provide: AppEnvironmentService,
          useValue: new AppEnvironmentService(),
        }),
        JwtModule.registerAsync({
          useFactory: async (env: AppEnvironmentService) => ({
            secret: env.ENVIRONMENT.JWT_SECRET_KEY,
            signOptions: {
              expiresIn: '90d',
            },
          }),
          inject: [AppEnvironmentService],
        }),
        MongooseModule.forFeature([
          { name: LogModel.name, schema: LogSchema },
          { name: ErrorLogModel.name, schema: ErrorLogSchema },
        ]),
      ],
      module: CommonModule,
      exports: [JwtModule, LogRepository, ErrorLogRepository],
      providers: [LogRepository, ErrorLogRepository],
    };
  }
}
