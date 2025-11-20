import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShipmentStatus, OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async findByOrder(orderId: string) {
    return this.prisma.shipment.findUnique({
      where: { orderId },
    });
  }

  async updateStatus(
    orderId: string,
    status: ShipmentStatus,
    trackingNumber?: string,
  ) {
    const updateData: Prisma.ShipmentUpdateInput = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (status === ShipmentStatus.SHIPPED) updateData.shippedAt = new Date();
    if (status === ShipmentStatus.DELIVERED)
      updateData.deliveredAt = new Date();

    const shipment = await this.prisma.shipment.update({
      where: { orderId },
      data: updateData,
    });

    // Sync with Order status
    if (status === ShipmentStatus.SHIPPED) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.SHIPPED },
      });
    } else if (status === ShipmentStatus.DELIVERED) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.DELIVERED },
      });
    }

    return shipment;
  }
}
