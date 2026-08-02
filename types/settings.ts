export interface GeneralSettings {
  siteName: string;
  supportEmail: string;
  supportPhone?: string;
  currency: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export interface PaymentSettings {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  codEnabled: boolean;
}

export interface Settings {
  general: GeneralSettings;
  theme: ThemeSettings;
  payment: PaymentSettings;
  updatedAt: string;
}
