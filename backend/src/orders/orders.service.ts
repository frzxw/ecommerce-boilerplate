import { Injectable, BadRequestException } from '@nestjs/common';
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
    if (!data.items?.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const normalizedItems: Array<{
      variantId: string;
      quantity: number;
      priceAtOrder: Prisma.Decimal;
    }> = [];
    let itemsTotal = 0;

    for (const item of data.items) {
      const price = Number(item.price ?? 0);
      itemsTotal += price * item.quantity;
      normalizedItems.push({
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtOrder: new Prisma.Decimal(price.toFixed(2)),
      });
    }

    const resolvedShippingCost = Number(data.shippingCost ?? 0);
    const shippingCostDecimal = new Prisma.Decimal(resolvedShippingCost.toFixed(2));
    const computedTotal = new Prisma.Decimal((itemsTotal + resolvedShippingCost).toFixed(2));

    const paymentMethod = data.paymentMethod?.toUpperCase();
    const isValidMethod = paymentMethod && Object.values(PaymentMethod).includes(paymentMethod as PaymentMethod);
    const resolvedPaymentMethod = isValidMethod ? (paymentMethod as PaymentMethod) : PaymentMethod.MIDTRANS;

    const address = await this.prisma.address.create({
      data: {
        label: 'Shipping Address',
        recipientName: data.shippingAddress.recipientName,
        phoneNumber: data.shippingAddress.phoneNumber,
        street: data.shippingAddress.street,
        city: data.shippingAddress.city,
        province: data.shippingAddress.state,
        postalCode: data.shippingAddress.zip,
        country: data.shippingAddress.country,
        user: { connect: { id: userId } },
        isDefault: false,
      },
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId: address.id,
        totalAmount: computedTotal,
        shippingMethod: data.shippingMethod ?? null,
        shippingCost: shippingCostDecimal,
        status: 'PENDING',
        items: {
          create: normalizedItems,
        },
      } as Prisma.OrderUncheckedCreateInput,
      include: { items: true },
    });

    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        paymentMethod: resolvedPaymentMethod,
        status: 'PENDING',
      },
    });

    return order;
  }
}
