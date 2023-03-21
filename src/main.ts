import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { CustomExceptionFilter } from './exceptions/custom-exception-filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const port = process.env.DATABASE_PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Horarios')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(port).then(value => `listenin to ${port}`);
  console.log(`La aplicación está corriendo en el puerto ${await app.getUrl()}`);
}
bootstrap();
