export type AddressType = 'Home' | 'Office' | 'Other';
export type ShippingZone = 'inside_dhaka' | 'outside_dhaka';

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  addressLine: string;
  postalCode?: string;
  addressType: AddressType;
  isDefault?: boolean;
  // Legacy / fallback field compatibility
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  zone: ShippingZone;
  cost: number;
  estimatedDays: string;
  description?: string;
  isActive?: boolean;
}

export interface ShippingDataResponse {
  methods?: ShippingMethod[];
  insideDhakaCost?: number;
  outsideDhakaCost?: number;
}
