import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async verifyPayment(orderId: string, payload: { status: string }) {
    // Logic to verify payment with gateway (Stripe/Midtrans)
    // For now, we simulate success if payload says so
    const isSuccess = payload.status === 'success'; // Simplified

    if (isSuccess) {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { orderId },
          data: {
            status: PaymentStatus.PAID,
            paidAt: new Date(),
            webhookPayload: payload,
          },
        }),
        this.prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.PAID },
        }),
      ]);
      return { status: 'success' };
    }
    return { status: 'failed' };
  }
}
