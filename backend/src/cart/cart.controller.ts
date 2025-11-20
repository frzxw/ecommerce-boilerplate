import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  find(@Request() req: { user: { userId: string } }) {
    return this.cartService.findOrCreate(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('items')
  addItem(
    @Request() req: { user: { userId: string } },
    @Body() body: { variantId: string; quantity: number },
  ) {
    return this.cartService.addItem(
      req.user.userId,
      body.variantId,
      body.quantity,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('items/:itemId')
  removeItem(
    @Request() req: { user: { userId: string } },
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }
}
