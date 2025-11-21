import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CalculateRatesDto } from './dto/calculate-rates.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('rates')
  async calculateRates(@Body() request: CalculateRatesDto) {
    return this.shippingService.calculateShippingRates(request);
  }
}

