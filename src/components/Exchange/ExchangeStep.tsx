import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CryptoPrice, ExchangeStep as ExchangeStepType } from '../../types';

interface ExchangeStepProps {
  step: ExchangeStepType;
  index: number;
  cryptos: CryptoPrice[];
  onStepChange: (index: number, field: keyof ExchangeStepType, value: string | number) => void;
}

export const ExchangeStep: React.FC<ExchangeStepProps> = ({
  step,
  index,
  cryptos,
  onStepChange,
}) => {
  return (
    <div className="mb-4 p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">From</label>
          <select
            value={step.fromCrypto}
            onChange={(e) => onStepChange(index, 'fromCrypto', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Crypto</option>
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.symbol}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
        <ArrowRight className="w-6 h-6 text-gray-400" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <select
            value={step.toCrypto}
            onChange={(e) => onStepChange(index, 'toCrypto', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="usdt">USDT</option>
            {cryptos.map((crypto) => (
              <option key={crypto.id} value={crypto.symbol}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};