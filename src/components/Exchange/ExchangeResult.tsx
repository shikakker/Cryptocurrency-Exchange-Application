import React from 'react';
import { useExchangeStore } from '../../store/exchangeStore';
import { ArrowRight } from 'lucide-react';

export const ExchangeResult = () => {
  const currentPath = useExchangeStore((state) => state.currentPath);

  if (!currentPath) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h2 className="text-xl font-semibold mb-2">Simulation Result</h2>
      <p className="mb-4 text-sm text-gray-600">
        USD-equivalent change from the same market snapshot:{' '}
        <strong>{currentPath.totalPercentageChange.toFixed(4)}%</strong>.
        A near-zero value is expected before venue fees, spreads and slippage.
      </p>

      <div className="space-y-4">
        {currentPath.steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{step.fromCrypto.toUpperCase()}</p>
              <p className="text-sm text-gray-500">{step.amount.toFixed(8)}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{step.toCrypto.toUpperCase()}</p>
              <p className="text-sm text-gray-500">{step.resultAmount.toFixed(8)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
