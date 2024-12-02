import React from 'react';
import { useExchangeStore } from '../../store/exchangeStore';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

export const ExchangeResult = () => {
  const currentPath = useExchangeStore((state) => state.currentPath);

  if (!currentPath) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Exchange Result</h2>
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Initial Amount</p>
            <p className="text-lg font-semibold">${currentPath.initialAmount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Final Amount</p>
            <p className="text-lg font-semibold">${currentPath.finalAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center">
          {currentPath.totalPercentageChange > 0 ? (
            <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500 mr-1" />
          )}
          <span
            className={
              currentPath.totalPercentageChange > 0
                ? 'text-green-500'
                : 'text-red-500'
            }
          >
            {currentPath.totalPercentageChange.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {currentPath.steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{step.fromCrypto.toUpperCase()}</p>
              <p className="text-sm text-gray-500">${step.amount.toFixed(2)}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{step.toCrypto.toUpperCase()}</p>
              <p className="text-sm text-gray-500">${step.resultAmount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};