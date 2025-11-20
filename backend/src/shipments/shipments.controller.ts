import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { AuthGuard } from '@nestjs/passport';
import { ShipmentStatus } from '@prisma/client';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':orderId')
  findOne(@Param('orderId') orderId: string) {
    return this.shipmentsService.findByOrder(orderId);
  }

  // Admin or Webhook only
  @Put(':orderId')
  updateStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: ShipmentStatus; trackingNumber?: string },
  ) {
    return this.shipmentsService.updateStatus(
      orderId,
      body.status,
      body.trackingNumber,
    );
  }
}
