import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
    constructor(private prisma: PrismaService) { }

    async create(createPromotionDto: CreatePromotionDto) {
        return this.prisma.promotion.create({
            data: createPromotionDto,
        });
    }

    async findAll() {
        return this.prisma.promotion.findMany({
            include: {
                coupons: true,
            },
        });
    }

    async findActive() {
        const now = new Date();
        return this.prisma.promotion.findMany({
            where: {
                active: true,
                OR: [
                    { startsAt: null, endsAt: null },
                    { startsAt: { lte: now }, endsAt: null },
                    { startsAt: null, endsAt: { gte: now } },
                    { startsAt: { lte: now }, endsAt: { gte: now } },
                ],
            },
            include: {
                coupons: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.promotion.findUnique({
            where: { id },
            include: {
                coupons: true,
            },
        });
    }

    async update(id: string, updatePromotionDto: UpdatePromotionDto) {
        return this.prisma.promotion.update({
            where: { id },
            data: updatePromotionDto,
        });
    }

    async remove(id: string) {
        return this.prisma.promotion.delete({
            where: { id },
        });
    }
}
