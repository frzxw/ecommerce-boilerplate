import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { RedeemCouponDto } from './dto/redeem-coupon.dto';

@Injectable()
export class CouponsService {
    constructor(private prisma: PrismaService) { }

    async create(createCouponDto: CreateCouponDto) {
        return this.prisma.coupon.create({
            data: createCouponDto,
            include: {
                promotion: true,
            },
        });
    }

    async findAll() {
        return this.prisma.coupon.findMany({
            include: {
                promotion: true,
            },
        });
    }

    async findOne(code: string) {
        return this.prisma.coupon.findUnique({
            where: { code },
            include: {
                promotion: true,
                orders: true,
            },
        });
    }

    async validateCoupon(code: string, userId: string) {
        const coupon = await this.findOne(code);

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        // Check if coupon is expired
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            throw new BadRequestException('Coupon has expired');
        }

        // Check if promotion is active
        if (!coupon.promotion.active) {
            throw new BadRequestException('Promotion is not active');
        }

        // Check promotion date range
        const now = new Date();
        if (coupon.promotion.startsAt && now < coupon.promotion.startsAt) {
            throw new BadRequestException('Promotion has not started yet');
        }
        if (coupon.promotion.endsAt && now > coupon.promotion.endsAt) {
            throw new BadRequestException('Promotion has ended');
        }

        // Check single use
        if (coupon.singleUse && coupon.usageCount > 0) {
            throw new BadRequestException('Coupon has already been used');
        }

        // Check per-user limit
        const userOrdersWithCoupon = await this.prisma.order.count({
            where: {
                userId,
                couponCode: code,
            },
        });

        if (userOrdersWithCoupon >= coupon.perUserLimit) {
            throw new BadRequestException('You have reached the usage limit for this coupon');
        }

        return coupon;
    }

    async incrementUsage(code: string) {
        return this.prisma.coupon.update({
            where: { code },
            data: {
                usageCount: {
                    increment: 1,
                },
            },
        });
    }

    async remove(code: string) {
        return this.prisma.coupon.delete({
            where: { code },
        });
    }
}
