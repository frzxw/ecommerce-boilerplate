import { Controller, Post, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req: any, @Body() createReviewDto: { productId: string; rating: number; comment: string }) {
    return this.reviewsService.create(req.user.userId, createReviewDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.reviewsService.remove(req.user.userId, id);
  }
}
