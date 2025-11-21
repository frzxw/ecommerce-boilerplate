import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddressesService {
    constructor(private prisma: PrismaService) { }

    create(userId: string, createAddressDto: Prisma.AddressCreateInput) {
        return this.prisma.address.create({
            data: {
                ...createAddressDto,
                user: { connect: { id: userId } },
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
        });
    }

    findOne(id: string, userId: string) {
        return this.prisma.address.findFirst({
            where: { id, userId },
        });
    }

    update(id: string, userId: string, updateAddressDto: Prisma.AddressUpdateInput) {
        return this.prisma.address.updateMany({
            where: { id, userId },
            data: updateAddressDto,
        });
    }

    remove(id: string, userId: string) {
        return this.prisma.address.deleteMany({
            where: { id, userId },
        });
    }
}
