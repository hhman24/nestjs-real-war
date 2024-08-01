import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlashCardsModule } from 'modules';
import { CustomThrottlerGuard, VersionMiddleware } from 'common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
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
