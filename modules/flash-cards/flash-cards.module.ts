import { Module } from '@nestjs/common';
import { FlashCardsController } from './flash-cards.controller';

@Module({
  controllers: [FlashCardsController],
})
export class FlashCardsModule {}
