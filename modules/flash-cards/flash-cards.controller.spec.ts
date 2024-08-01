import { Test, TestingModule } from '@nestjs/testing';
import { FlashCardsController } from './flash-cards.controller';

describe('FlashCardsController', () => {
  let controller: FlashCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashCardsController],
    }).compile();

    controller = module.get<FlashCardsController>(FlashCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
