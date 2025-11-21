export type CityCluster = {
  name: string;
  cities: string[];
};

export type CountryCluster = {
  code: string;
  name: string;
  states: CityCluster[];
};

export const LOCATION_TREE: CountryCluster[] = [
  {
    code: 'ID',
    name: 'Indonesia',
    states: [
      {
        name: 'DKI Jakarta',
        cities: ['Central Jakarta', 'West Jakarta', 'South Jakarta', 'North Jakarta', 'East Jakarta'],
      },
      {
        name: 'Jawa Barat',
        cities: ['Bandung', 'Bekasi', 'Depok', 'Bogor'],
      },
      {
        name: 'Bali',
        cities: ['Denpasar', 'Badung', 'Gianyar'],
      },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    states: [
      {
        name: 'Central Region',
        cities: ['Marina Bay', 'Orchard', 'Chinatown'],
      },
      {
        name: 'East Region',
        cities: ['Bedok', 'Tampines', 'Pasir Ris'],
      },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    states: [
      {
        name: 'California',
        cities: ['Los Angeles', 'San Francisco', 'San Diego'],
      },
      {
        name: 'New York',
        cities: ['New York City', 'Brooklyn', 'Queens'],
      },
      {
        name: 'Texas',
        cities: ['Austin', 'Dallas', 'Houston'],
      },
    ],
  },
];

