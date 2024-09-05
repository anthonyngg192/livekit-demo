import { AppModule } from './app/app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SanitizePayloadPipe } from '@livekit-demo/common';
import { setupSwaggerUI } from './app/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: true, methods: ['GET', 'POST', 'DELETE', 'PUT'] });
  app.useGlobalPipes(
    new SanitizePayloadPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (error) => {
        console.log(error);
        return new BadRequestException(error);
      },
    }),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.API_PORT || 3000;
  setupSwaggerUI(app);
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/docs/api}`);
}

bootstrap();
