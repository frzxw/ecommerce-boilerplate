import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { productId: string; rating: number; comment: string }) {
    return this.prisma.review.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  async remove(userId: string, id: string) {
    // Ensure user owns the review
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review || review.userId !== userId) {
      throw new Error('Review not found or unauthorized');
    }
    return this.prisma.review.delete({ where: { id } });
  }
}
