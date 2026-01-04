export interface Currency {
  code: string;
  name: string;
  nameEn: string;
}

export interface ExchangeRates {
  [key: string]: {
    [key: string]: number;
  };
}

export interface ConversionResult {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  result: number;
  rate: number;
  date: string;
}

export interface CurrencyApiResponse {
  date: string;
  rates: {
    [key: string]: number;
  };
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dollar américain', nameEn: 'US Dollar' },
  { code: 'EUR', name: 'Euro', nameEn: 'Euro' },
  { code: 'GBP', name: 'Livre sterling', nameEn: 'British Pound' },
  { code: 'JPY', name: 'Yen japonais', nameEn: 'Japanese Yen' },
  { code: 'CNY', name: 'Yuan chinois', nameEn: 'Chinese Yuan' },
  { code: 'CAD', name: 'Dollar canadien', nameEn: 'Canadian Dollar' },
  { code: 'AUD', name: 'Dollar australien', nameEn: 'Australian Dollar' },
  { code: 'INR', name: 'Roupie indienne', nameEn: 'Indian Rupee' },
  { code: 'AED', name: 'Dirham des Émirats', nameEn: 'UAE Dirham' },
  { code: 'SAR', name: 'Riyal saoudien', nameEn: 'Saudi Riyal' },
  { code: 'MGA', name: 'Ariary malgache', nameEn: 'Malagasy Ariary' },
];
