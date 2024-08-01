import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingInterceptor } from 'common/interceptors';
import helmet from 'helmet';
import { CustomValidationPipe, HttpExceptionFilter } from 'common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  // NOTICE: GLOBAL ExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());
  // NOTICE: GLOBAL PIPE
  app.useGlobalPipes(new CustomValidationPipe());
  // NOTICE: GLOBAL INTERCEPTOR
  app.useGlobalInterceptors(new LoggingInterceptor());
  // NOTICE: GLOBAL MIDDLEWARE
  app.use(helmet());
  app.use((req: Request, res: Response, next) => {
    logger.debug('===TRIGGER GLOBAL MIDDLEWARE===');
    next();
  });
  await app.listen(3000);
}
bootstrap();
