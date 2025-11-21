import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  getCountries() {
    return this.locationsService.getAllCountries();
  }

  @Get('states/:countryCode')
  getStates(@Param('countryCode') countryCode: string) {
    return this.locationsService.getStatesByCountry(countryCode);
  }

  @Get('cities')
  getCities(
    @Query('countryCode') countryCode: string,
    @Query('stateCode') stateCode?: string,
  ) {
    if (stateCode) {
      return this.locationsService.getCitiesByState(countryCode, stateCode);
    }
    return this.locationsService.getCitiesByCountry(countryCode);
  }
}

