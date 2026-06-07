import { ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { PrismaExceptionFilter }
from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter(),);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe(),
  );

  await app.listen(3000);
}

void bootstrap();