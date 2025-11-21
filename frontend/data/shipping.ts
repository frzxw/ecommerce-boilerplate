export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  eta: string;
  price: number;
  badge?: string;
  carbonNeutral?: boolean;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'standard',
    label: 'Standard Courier',
    description: 'Reliable shipping for everyday deliveries.',
    eta: '3-5 business days',
    price: 6.9,
    badge: 'Most Popular',
  },
  {
    id: 'express',
    label: 'Express Priority',
    description: 'Expedited handling with live tracking.',
    eta: '1-2 business days',
    price: 14.5,
  },
  {
    id: 'same-day',
    label: 'Same-Day Concierge',
    description: 'Hand-delivered within metropolitan areas.',
    eta: 'Same day before 8PM',
    price: 24,
    badge: 'Premium',
  },
];

