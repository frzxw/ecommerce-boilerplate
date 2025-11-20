import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':orderId/verify')
  verifyPayment(@Param('orderId') orderId: string, @Body() payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.paymentsService.verifyPayment(orderId, payload);
  }
}
