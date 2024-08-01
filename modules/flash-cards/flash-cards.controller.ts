import {
  Controller,
  Get,
  Logger,
  Param,
  // Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthorizationGuard } from 'common/guards/jwt-auth.guard';
import { OwnershipGuard } from './guards/ownership.guard';
import {
  ExcludeNullInterceptor,
  ParseMongoIdPipe,
  ParseRouteValidationPipe,
  TimeoutInterceptor,
} from 'common';
import { ParseControllerValidationPipe } from 'common/pipes/parse-custom-controller-validation.pipe';
import { ObjectId } from 'mongoose';

@UsePipes(ParseControllerValidationPipe)
@UseInterceptors(TimeoutInterceptor)
@UseGuards(JwtAuthorizationGuard)
@Controller('flash-cards')
export class FlashCardsController {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(FlashCardsController.name);
  }

  @Get(':id')
  @UsePipes(ParseRouteValidationPipe)
  @UseInterceptors(ExcludeNullInterceptor)
  @UseGuards(OwnershipGuard)
  sayHello(@Param('id', ParseMongoIdPipe) id: ObjectId): string {
    this.logger.log(`Method name: ${this.sayHello.name}`);
    return `Hello ${id}`;
  }
}
