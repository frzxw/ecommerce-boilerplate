import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, PaymentMethod } from '@prisma/client';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
      include: { items: true },
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { items: true, user: true },
    });
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
        address: true,
        payment: true,
        shipment: true,
      },
    });
  }

  async update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async createFromCheckout(userId: string, data: CheckoutDto): Promise<Order> {
    // 1. Create Address

    const address: any = await this.prisma.address.create({
      data: {
        userId,
        label: 'Shipping Address',
        recipientName: data.shippingAddress.recipientName,
        phoneNumber: data.shippingAddress.phoneNumber,
        street: data.shippingAddress.street,
        city: data.shippingAddress.city,
        province: data.shippingAddress.state,
        postalCode: data.shippingAddress.zip,
        country: data.shippingAddress.country,
      },
    });

    // 2. Create Order with Items
    const order = await this.prisma.order.create({
      data: {
        userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        addressId: address.id,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        items: {
          create: data.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtOrder: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // 3. Create Payment Record
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        paymentMethod: PaymentMethod.MIDTRANS,
        status: 'PENDING',
      },
    });

    return order;
  }
}
