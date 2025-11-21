import { Injectable } from '@nestjs/common';
import { Country, State, City } from '@countrystatecity/countries';

@Injectable()
export class LocationsService {
  getAllCountries() {
    return Country.getAllCountries().map((country) => ({
      code: country.isoCode,
      name: country.name,
    }));
  }

  getStatesByCountry(countryCode: string) {
    const states = State.getStatesOfCountry(countryCode);
    return states.map((state) => ({
      code: state.isoCode,
      name: state.name,
    }));
  }

  getCitiesByState(countryCode: string, stateCode: string) {
    const cities = City.getCitiesOfState(countryCode, stateCode);
    return cities.map((city) => ({
      name: city.name,
    }));
  }

  getCitiesByCountry(countryCode: string) {
    const cities = City.getCitiesOfCountry(countryCode);
    return cities.map((city) => ({
      name: city.name,
    }));
  }
}

