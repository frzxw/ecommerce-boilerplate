import { Controller, Get, Post, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req: any) {
    return this.wishlistService.findAll(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  toggle(@Request() req: any, @Body() body: { productId: string }) {
    return this.wishlistService.toggle(req.user.userId, body.productId);
  }
}
