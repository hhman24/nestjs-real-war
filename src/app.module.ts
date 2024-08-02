import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlashCardsModule } from 'modules';
import { CustomThrottlerGuard, VersionMiddleware } from 'common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { configurations } from 'configs';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      load: configurations,
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test', 'provision', 'staging')
          .default('dev'),
        PORT: Joi.number().default(3000),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 2,
      },
    ]),
    FlashCardsModule,
  ],
  controllers: [AppController],
  providers: [
    // throttler
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  // apply middleware for route flash-cards
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(VersionMiddleware).forRoutes('flash-cards');
  }
}
