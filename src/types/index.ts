export interface User {
  email: string;
  id: string;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  cryptocurrency: string;
  price: number;
  timestamp: number;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export interface ExchangeStep {
  fromCrypto: string;
  toCrypto: string;
  amount: number;
  rate: number;
  resultAmount: number;
}

export interface ExchangePath {
  steps: ExchangeStep[];
  totalPercentageChange: number;
  initialAmount: number;
  finalAmount: number;
}