import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CalculateRatesDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsOptional()
  courier?: string;
}

