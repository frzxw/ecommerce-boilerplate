'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Navbar } from '@/components/ui/Navbar';

// Types
type InformationFormState = {
  email: string;
  phoneNumber: string;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  stateCode: string;
  zip: string;
  country: string;
  countryCode: string;
};

type ShippingRate = {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

type SelectedShipping = ShippingRate & {
  id: string;
};

export default function CheckoutPage() {
  const { user, isLoading, token } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Information
  const [information, setInformation] = useState<InformationFormState>({
    email: user?.email || '',
    phoneNumber: '',
    recipientName: '',
    street: '',
    city: '',
    state: '',
    stateCode: '',
    zip: '',
    country: '',
    countryCode: '',
  });
  const [informationErrors, setInformationErrors] = useState<Record<string, string>>({});

  // Step 2: Shipping (API called once, data cached)
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<SelectedShipping | null>(null);
  const ratesFetchedRef = useRef(false);

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('MIDTRANS');

  const steps = [
    { id: 1, label: 'Information' },
    { id: 2, label: 'Shipping' },
    { id: 3, label: 'Payment' },
    { id: 4, label: 'Review' },
  ];

  const handleInformationChange = useCallback(
    (field: keyof InformationFormState, value: string) => {
      setInformation((prev) => ({ ...prev, [field]: value }));
      setInformationErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  // Calculate total weight from cart items (mock: 500g per item)
  const totalWeight = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity * 500, 0);
  }, [items]);

  // Fetch shipping rates only once when entering shipping step
  useEffect(() => {
    if (currentStep === 2 && !ratesFetchedRef.current && information.city && information.countryCode) {
      setIsLoadingRates(true);
      ratesFetchedRef.current = true;

      fetchAPI('/shipping/rates', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: 'Jakarta', // Store origin city
          destination: information.city,
          weight: totalWeight,
        }),
      })
        .then((rates: ShippingRate[]) => {
          setShippingRates(rates);
          if (rates.length > 0) {
            setSelectedShipping({
              ...rates[0],
              id: `${rates[0].courier}-${rates[0].service}`,
            });
          }
        })
        .catch((error) => {
          console.error('Failed to fetch shipping rates', error);
          alert('Failed to load shipping options. Please try again.');
        })
        .finally(() => {
          setIsLoadingRates(false);
        });
    }
  }, [currentStep, information.city, information.countryCode, totalWeight, token]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest">Your cart is empty</h1>
          <button 
            onClick={() => router.push('/products')}
            className="text-black underline hover:no-underline uppercase tracking-widest text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const validateInformation = () => {
    const errors: Record<string, string> = {};
    const requiredFields: Array<keyof InformationFormState> = [
      'email',
      'phoneNumber',
      'recipientName',
      'street',
      'city',
      'state',
      'zip',
      'country',
    ];

    requiredFields.forEach((field) => {
      if (!information[field]?.trim()) {
        errors[field] = 'Required';
      }
    });

    // Email validation
    if (information.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(information.email)) {
      errors.email = 'Invalid email format';
    }

    setInformationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 1 && !validateInformation()) {
      return;
    }
    if (currentStep === 2 && !selectedShipping) {
      alert('Please select a shipping option');
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = async () => {
    if (!validateInformation() || !selectedShipping) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          recipientName: information.recipientName,
          phoneNumber: information.phoneNumber,
          street: information.street,
          city: information.city,
          state: information.state,
          zip: information.zip,
          country: information.country,
        },
        totalAmount: subtotal + (selectedShipping?.cost || 0),
        paymentMethod,
        shippingMethod: selectedShipping ? `${selectedShipping.courier}-${selectedShipping.service}` : null,
        shippingCost: selectedShipping?.cost || 0,
        customerEmail: information.email,
      };

      const response = await fetchAPI('/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response) {
      clearCart();
        // Redirect to payment gateway or success page
        router.push(`/checkout/success?orderId=${response.id}`);
      }
    } catch (error: any) {
      console.error('Failed to place order', error);
      const errorMessage =
        error?.message || error?.response?.data?.message || 'Failed to place order. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingCost = selectedShipping?.cost || 0;
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-12">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-6 mb-12 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3 min-w-fit">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  currentStep >= step.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.id}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 ${currentStep > step.id ? 'bg-black' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Step Content */}
          <div className="lg:col-span-7 space-y-12">
            {/* Step 1: Information */}
            {currentStep === 1 && (
              <InformationStep
                information={information}
                informationErrors={informationErrors}
                onInformationChange={handleInformationChange}
              />
            )}

            {/* Step 2: Shipping */}
            {currentStep === 2 && (
              <ShippingStep
                shippingRates={shippingRates}
                isLoadingRates={isLoadingRates}
                selectedShipping={selectedShipping}
                onSelectShipping={setSelectedShipping}
              />
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <PaymentStep paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <ReviewStep
                information={information}
                selectedShipping={selectedShipping}
                paymentMethod={paymentMethod}
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                grandTotal={grandTotal}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-8 py-3 border border-black text-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={currentStep === steps.length ? handlePlaceOrder : handleContinue}
                disabled={isSubmitting || (currentStep === 2 && isLoadingRates)}
                className="flex-1 bg-black text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? 'Processing...'
                  : currentStep === steps.length
                    ? 'Place Order & Pay'
                    : 'Continue'}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              grandTotal={grandTotal}
              selectedShipping={selectedShipping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Information Step Component
function InformationStep({
  information,
  informationErrors,
  onInformationChange,
}: {
  information: InformationFormState;
  informationErrors: Record<string, string>;
  onInformationChange: (field: keyof InformationFormState, value: string) => void;
}) {
  const [countries, setCountries] = useState<Array<{ code: string; name: string }>>([]);
  const [states, setStates] = useState<Array<{ code: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ name: string }>>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Load countries on mount
  useEffect(() => {
    let isMounted = true;

    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const data = await fetchAPI('/locations/countries');
        if (isMounted) {
          setCountries(data);
        }
      } catch (error) {
        console.error('Failed to load countries', error);
        if (isMounted) {
          setCountries([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCountries(false);
        }
      }
    };

    loadCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (!information.countryCode) {
      setStates([]);
      setCities([]);
      return;
    }

    let isMounted = true;

    const loadStates = async () => {
      try {
        setIsLoadingStates(true);
        const data = await fetchAPI(`/locations/states/${information.countryCode}`);
        if (isMounted) {
          setStates(data);
          setCities([]); // Reset cities when state changes
        }
      } catch (error) {
        console.error('Failed to load states', error);
        if (isMounted) {
          setStates([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingStates(false);
        }
      }
    };

    loadStates();

    return () => {
      isMounted = false;
    };
  }, [information.countryCode]);

  // Load cities when state changes
  useEffect(() => {
    if (!information.countryCode || !information.stateCode) {
      setCities([]);
      return;
    }

    let isMounted = true;

    const loadCities = async () => {
      try {
        setIsLoadingCities(true);
        const url = `/locations/cities?countryCode=${information.countryCode}&stateCode=${information.stateCode}`;
        const data = await fetchAPI(url);
        if (isMounted) {
          setCities(data);
        }
      } catch (error) {
        console.error('Failed to load cities', error);
        if (isMounted) {
          setCities([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCities(false);
        }
      }
    };

    loadCities();

    return () => {
      isMounted = false;
    };
  }, [information.countryCode, information.stateCode]);

  // Initialize jQuery for drill-down behavior
  useEffect(() => {
    let isMounted = true;
    let cleanupHandlers: (() => void) | undefined;

    void import('jquery').then(({ default: $ }) => {
      if (!isMounted) return;

      const $country = $('#countrySelect');
      const $state = $('#stateSelect');
      const $city = $('#citySelect');
      const namespace = '.checkoutLocation';

      // Sync React state with jQuery selects
      const syncSelects = () => {
        if (information.countryCode) {
          $country.val(information.countryCode);
        }
        if (information.stateCode) {
          $state.val(information.stateCode);
        }
        if (information.city) {
          $city.val(information.city);
        }
      };

      // Wait a bit for DOM to be ready
      setTimeout(() => {
        if (!isMounted) return;
        syncSelects();
      }, 100);

      $country.on(`change${namespace}`, function () {
        const countryCode = $(this).val() as string;
        const selectedCountry = countries.find((c) => c.code === countryCode);
        onInformationChange('country', selectedCountry?.name ?? '');
        onInformationChange('countryCode', countryCode);
        onInformationChange('state', '');
        onInformationChange('stateCode', '');
        onInformationChange('city', '');
      });

      $state.on(`change${namespace}`, function () {
        const stateCode = $(this).val() as string;
        const stateName = $(this).find('option:selected').text() || '';
        onInformationChange('state', stateName);
        onInformationChange('stateCode', stateCode);
        onInformationChange('city', '');
      });

      $city.on(`change${namespace}`, function () {
        const cityName = $(this).val() as string;
        onInformationChange('city', cityName ?? '');
      });

      cleanupHandlers = () => {
        $country.off(namespace);
        $state.off(namespace);
        $city.off(namespace);
      };
    });

    return () => {
      isMounted = false;
      cleanupHandlers?.();
    };
  }, [countries, states, cities, information, onInformationChange]);

  return (
    <div>
      <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Customer Information</h2>
      <div className="space-y-6">
              <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
            Email Address
          </label>
                <input
            type="email"
            value={information.email}
            onChange={(e) => onInformationChange('email', e.target.value)}
            className={`block w-full border-b py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent ${
              informationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {informationErrors.email && (
            <p className="text-xs text-red-500 mt-1">{informationErrors.email}</p>
          )}
              </div>
              <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
            Phone Number
          </label>
                <input
                  type="tel"
            value={information.phoneNumber}
            onChange={(e) => onInformationChange('phoneNumber', e.target.value)}
            className={`block w-full border-b py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent ${
              informationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
                  placeholder="+1 (555) 000-0000"
                />
          {informationErrors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">{informationErrors.phoneNumber}</p>
          )}
              </div>
              <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
            Full Name
          </label>
                <input
                  type="text"
            value={information.recipientName}
            onChange={(e) => onInformationChange('recipientName', e.target.value)}
            className={`block w-full border-b py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent ${
              informationErrors.recipientName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {informationErrors.recipientName && (
            <p className="text-xs text-red-500 mt-1">{informationErrors.recipientName}</p>
          )}
              </div>
                <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
            Street Address
          </label>
                  <input
                    type="text"
            value={information.street}
            onChange={(e) => onInformationChange('street', e.target.value)}
            className={`block w-full border-b py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent ${
              informationErrors.street ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main St"
          />
          {informationErrors.street && (
            <p className="text-xs text-red-500 mt-1">{informationErrors.street}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
            Country
          </label>
          <select
            id="countrySelect"
            value={information.countryCode}
            onChange={(e) => {
              const countryCode = e.target.value;
              const selectedCountry = countries.find((c) => c.code === countryCode);
              onInformationChange('country', selectedCountry?.name ?? '');
              onInformationChange('countryCode', countryCode);
              onInformationChange('state', '');
              onInformationChange('stateCode', '');
              onInformationChange('city', '');
            }}
            className={`block w-full border-b bg-transparent py-3 text-gray-900 focus:border-black focus:outline-none ${
              informationErrors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoadingCountries}
          >
            <option value="">
              {isLoadingCountries ? 'Loading countries...' : 'Select Country'}
            </option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {informationErrors.country && (
            <p className="text-xs text-red-500 mt-1">{informationErrors.country}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
              State / Province
            </label>
            <select
              id="stateSelect"
              value={information.stateCode}
              onChange={(e) => {
                const stateCode = e.target.value;
                const selectedState = states.find((s) => s.code === stateCode);
                onInformationChange('state', selectedState?.name ?? '');
                onInformationChange('stateCode', stateCode);
                onInformationChange('city', '');
              }}
              className={`block w-full border-b bg-transparent py-3 text-gray-900 focus:border-black focus:outline-none ${
                informationErrors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!information.countryCode || isLoadingStates}
            >
              <option value="">
                {!information.countryCode
                  ? 'Select a country first'
                  : isLoadingStates
                    ? 'Loading states...'
                    : 'Select State / Province'}
              </option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            {informationErrors.state && (
              <p className="text-xs text-red-500 mt-1">{informationErrors.state}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
              City
            </label>
            <select
              id="citySelect"
              value={information.city}
              onChange={(e) => {
                onInformationChange('city', e.target.value);
              }}
              className={`block w-full border-b bg-transparent py-3 text-gray-900 focus:border-black focus:outline-none ${
                informationErrors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!information.stateCode || isLoadingCities}
            >
              <option value="">
                {!information.stateCode
                  ? 'Select a state first'
                  : isLoadingCities
                    ? 'Loading cities...'
                    : 'Select City'}
              </option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {informationErrors.city && (
              <p className="text-xs text-red-500 mt-1">{informationErrors.city}</p>
            )}
          </div>
                </div>
                <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">
            ZIP Code
          </label>
                  <input
                    type="text"
            value={information.zip}
            onChange={(e) => onInformationChange('zip', e.target.value)}
            className={`block w-full border-b py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-transparent ${
              informationErrors.zip ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {informationErrors.zip && (
            <p className="text-xs text-red-500 mt-1">{informationErrors.zip}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Shipping Step Component
function ShippingStep({
  shippingRates,
  isLoadingRates,
  selectedShipping,
  onSelectShipping,
}: {
  shippingRates: ShippingRate[];
  isLoadingRates: boolean;
  selectedShipping: SelectedShipping | null;
  onSelectShipping: (shipping: SelectedShipping) => void;
}) {
  if (isLoadingRates) {
    return (
      <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Shipping Options</h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading shipping rates...</p>
                </div>
              </div>
    );
  }

  if (shippingRates.length === 0) {
    return (
                <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Shipping Options</h2>
        <div className="border border-gray-200 p-6 text-center">
          <p className="text-gray-500">No shipping options available. Please check your address.</p>
        </div>
                </div>
    );
  }

  return (
                <div>
      <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Shipping Options</h2>
      <div className="space-y-4">
        {shippingRates.map((rate) => {
          const id = `${rate.courier}-${rate.service}`;
          const isSelected = selectedShipping?.id === id;
          return (
            <label
              key={id}
              className={`flex items-center justify-between p-4 border transition-all cursor-pointer ${
                isSelected ? 'border-black bg-black/5 shadow-sm' : 'border-gray-200 hover:border-black'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold uppercase tracking-wide text-sm">
                    {rate.courier} - {rate.service}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{rate.description}</p>
                <p className="text-xs text-gray-400 mt-1">Est. delivery: {rate.etd}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold">${rate.cost.toFixed(2)}</span>
                  <input
                  type="radio"
                  name="shipping"
                  value={id}
                  checked={isSelected}
                  onChange={() => onSelectShipping({ ...rate, id })}
                  className="w-4 h-4 text-black focus:ring-black"
                />
              </div>
            </label>
          );
        })}
                </div>
              </div>
  );
}

// Payment Step Component
function PaymentStep({
  paymentMethod,
  onPaymentMethodChange,
}: {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}) {
  const paymentOptions = [
    { label: 'Midtrans', value: 'MIDTRANS', description: 'Virtual account & e-wallet via Midtrans' },
    { label: 'Stripe', value: 'STRIPE', description: 'Pay securely with Stripe' },
    { label: 'PayPal', value: 'PAYPAL', description: 'Checkout with your PayPal account' },
    { label: 'OVO', value: 'OVO', description: 'Indonesian e-wallet payment' },
    { label: 'ShopeePay', value: 'SHOPEEPAY', description: 'ShopeePay instant payment' },
  ];

  return (
    <div>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Payment Method</h2>
              <div className="space-y-4">
        {paymentOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
              paymentMethod === option.value ? 'border-black bg-black/5' : 'border-gray-200 hover:border-black'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-bold uppercase tracking-wide text-sm">{option.label}</span>
              <span className="text-xs text-gray-500">{option.description}</span>
            </div>
                  <input
                    type="radio"
                    name="payment"
              value={option.value}
              checked={paymentMethod === option.value}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                </label>
        ))}
      </div>
    </div>
  );
}

// Review Step Component
function ReviewStep({
  information,
  selectedShipping,
  paymentMethod,
  items,
  subtotal,
  shippingCost,
  grandTotal,
}: {
  information: InformationFormState;
  selectedShipping: SelectedShipping | null;
  paymentMethod: string;
  items: any[];
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
}) {
  const paymentOptions = [
    { label: 'Midtrans', value: 'MIDTRANS', description: 'Virtual account & e-wallet via Midtrans' },
    { label: 'Stripe', value: 'STRIPE', description: 'Pay securely with Stripe' },
    { label: 'PayPal', value: 'PAYPAL', description: 'Checkout with your PayPal account' },
    { label: 'OVO', value: 'OVO', description: 'Indonesian e-wallet payment' },
    { label: 'ShopeePay', value: 'SHOPEEPAY', description: 'ShopeePay instant payment' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Order Summary</h2>
        <div className="border border-gray-200 p-6 space-y-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <div className="flex flex-col">
                <span className="font-bold uppercase tracking-wide">{item.name}</span>
                <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
              </div>
              <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Shipping Address</h2>
        <div className="border border-gray-200 p-6 space-y-2 text-sm">
          <p className="font-bold tracking-wide uppercase">{information.recipientName}</p>
          <p className="text-gray-600">{information.email}</p>
          <p className="text-gray-600">{information.phoneNumber}</p>
          <p className="text-gray-600">
            {information.street}, {information.city}, {information.state} {information.zip}, {information.country}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Shipping Method</h2>
        <div className="border border-gray-200 p-6 text-sm">
          {selectedShipping ? (
            <div>
              <p className="font-bold tracking-wide uppercase">
                {selectedShipping.courier} - {selectedShipping.service}
              </p>
              <p className="text-gray-600">{selectedShipping.description}</p>
              <p className="text-gray-500 text-xs mt-1">Est. delivery: {selectedShipping.etd}</p>
              <p className="font-mono font-bold mt-2">${selectedShipping.cost.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-gray-500">No shipping method selected</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Payment Method</h2>
        <div className="border border-gray-200 p-6 text-sm">
          <p className="font-bold tracking-wide uppercase">
            {paymentOptions.find((option) => option.value === paymentMethod)?.label}
          </p>
          <p className="text-gray-600">
            {paymentOptions.find((option) => option.value === paymentMethod)?.description}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-mono">${shippingCost.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-end pt-4 border-t border-gray-200">
          <span className="text-sm font-bold uppercase tracking-widest">Total</span>
          <span className="text-2xl font-bold tracking-tighter">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
  );
}

// Order Summary Component
function OrderSummary({
  items,
  subtotal,
  shippingCost,
  grandTotal,
  selectedShipping,
}: {
  items: any[];
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  selectedShipping: SelectedShipping | null;
}) {
  return (
            <div className="bg-zinc-50 p-8 sticky top-24">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Order Summary</h2>
              <div className="space-y-6 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-wide">{item.name}</span>
                      <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
      <div className="space-y-2 text-sm mb-8">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            Shipping {selectedShipping ? `(${selectedShipping.courier})` : ''}
          </span>
          <span className="font-mono">${shippingCost.toFixed(2)}</span>
            </div>
          </div>
      <div className="border-t border-gray-200 pt-6 flex justify-between items-end mb-8">
        <span className="text-sm font-bold uppercase tracking-widest">Total</span>
        <span className="text-2xl font-bold tracking-tighter">${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
