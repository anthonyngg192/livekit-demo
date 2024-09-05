import { AppModule } from '../app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ReturnOKDocs } from '@livekit-demo/common';

export function setupSwaggerUI(app: NestExpressApplication) {
  const appOptions = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Admin API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const adminDocument = SwaggerModule.createDocument(app, appOptions, {
    include: [AppModule],
    deepScanRoutes: true,
    extraModels: [ReturnOKDocs],
  });
  SwaggerModule.setup('docs/api', app, adminDocument);
}
