import { Injectable, BadRequestException } from '@nestjs/common';
import { CalculateRatesDto } from './dto/calculate-rates.dto';

export interface ShippingRate {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string; // Estimated time of delivery
}

@Injectable()
export class ShippingService {
  // Simulated shipping rates - In production, integrate with RajaOngkir, JNE, TIKI, etc.
  async calculateShippingRates(
    request: CalculateRatesDto,
  ): Promise<ShippingRate[]> {
    if (!request.origin || !request.destination || !request.weight) {
      throw new BadRequestException(
        'Origin, destination, and weight are required',
      );
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock shipping rates based on weight and distance
    const baseRates: ShippingRate[] = [
      {
        courier: 'JNE',
        service: 'REG',
        description: 'Regular Service',
        cost: this.calculateCost(request.weight, 5),
        etd: '2-3 days',
      },
      {
        courier: 'JNE',
        service: 'YES',
        description: 'YES (Yakin Esok Sampai)',
        cost: this.calculateCost(request.weight, 12),
        etd: '1 day',
      },
      {
        courier: 'TIKI',
        service: 'REG',
        description: 'Regular Service',
        cost: this.calculateCost(request.weight, 6),
        etd: '2-4 days',
      },
      {
        courier: 'TIKI',
        service: 'ONS',
        description: 'Over Night Service',
        cost: this.calculateCost(request.weight, 15),
        etd: '1 day',
      },
      {
        courier: 'POS',
        service: 'KILAT',
        description: 'KILAT Khusus',
        cost: this.calculateCost(request.weight, 8),
        etd: '1-2 days',
      },
      {
        courier: 'SICEPAT',
        service: 'REG',
        description: 'Regular Service',
        cost: this.calculateCost(request.weight, 5.5),
        etd: '2-3 days',
      },
      {
        courier: 'SICEPAT',
        service: 'HALU',
        description: 'Halu (Hari Ini Antar)',
        cost: this.calculateCost(request.weight, 18),
        etd: 'Same day',
      },
    ];

    // Filter by courier if specified
    if (request.courier) {
      return baseRates.filter((rate) => rate.courier === request.courier);
    }

    return baseRates;
  }

  private calculateCost(weight: number, basePrice: number): number {
    // Simple calculation: base price + (weight in kg * multiplier)
    const weightInKg = weight / 1000;
    const multiplier = 2;
    return Number((basePrice + weightInKg * multiplier).toFixed(2));
  }

  // In production, integrate with actual shipping aggregator:
  // - RajaOngkir (Indonesia): https://rajaongkir.com/
  // - JNE API
  // - TIKI API
  // - Or use services like Shippo, EasyPost for international
}

