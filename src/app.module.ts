import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomThrottlerGuard, VersionMiddleware } from 'src/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations } from '@configs/index';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { UserRolesModule } from '@modules/user-roles/user-roles.module';
import { UsersModule } from '@modules/users/users.module';
import { TopicsModule } from '@modules/topics/topics.module';
import { FlashCardsModule } from '@modules/flash-cards/flash-cards.module';
import { CollectionsModule } from '@modules/collections/collections.module';

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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 2,
      },
    ]),
    FlashCardsModule,
    UserRolesModule,
    UsersModule,
    TopicsModule,
    CollectionsModule,
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
