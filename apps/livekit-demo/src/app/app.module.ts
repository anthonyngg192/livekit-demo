import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '@livekit-demo/auth';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from '@livekit-demo/room';
import { UserModule } from '@livekit-demo/user';
import {
  AppEnvironmentService,
  CommonModule,
  RequestLoggerMiddleware,
  ResponseInterceptorInterceptor,
} from '@livekit-demo/common';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (envService: AppEnvironmentService) => ({
        uri: envService.ENVIRONMENT.DB_CONNECTION_STRING,
      }),
      inject: [AppEnvironmentService],
    }),
    CommonModule.foRoot(),
    AuthModule,
    UserModule,
    RoomModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptorInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
