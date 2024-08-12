import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingInterceptor } from 'src/common/interceptors';
import helmet from 'helmet';
import { CustomValidationPipe, HttpExceptionFilter } from 'src/common';
import { ConfigService } from '@nestjs/config';
import { iDatabaseConfig } from '@configs/config/app.config';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

  // Config Service
  const config_service = app.get(ConfigService);
  logger.debug(`Application running on port ${config_service.get('PORT')}`);
  logger.debug(`Application running on port ${config_service.get('NODE_ENV')}`);

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

  const database_env = config_service.get<iDatabaseConfig>('mongodb');
  logger.debug(database_env);

  await app.listen(config_service.get('PORT'), () => {
    logger.log(`Application running on port ${config_service.get('PORT')}`);
  });
}
bootstrap();
