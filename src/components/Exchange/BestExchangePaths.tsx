import React, { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { getCryptoPrices } from '../../services/api';
import { findBestTradingPaths } from '../../utils/exchangeCalculator';
import { CryptoPrice } from '../../types';

export const BestExchangePaths = () => {
  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState<any[]>([]);

  useEffect(() => {
    const fetchAndCalculatePaths = async () => {
      try {
        const cryptos = await getCryptoPrices();
        const bestPaths = findBestTradingPaths(cryptos);
        setPaths(bestPaths);
      } catch (error) {
        console.error('Failed to calculate best paths:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculatePaths();
    const interval = setInterval(fetchAndCalculatePaths, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Calculating best trading paths...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Best Trading Paths</h2>
      <div className="space-y-6">
        {paths.map((path, pathIndex) => (
          <div key={pathIndex} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Path {pathIndex + 1}
              </span>
              <div className="flex items-center text-green-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="font-semibold">
                  {path.totalProfitPercentage.toFixed(2)}% potential profit
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {path.steps.map((step: any, stepIndex: number) => (
                <React.Fragment key={stepIndex}>
                  <div className="bg-gray-50 px-3 py-2 rounded">
                    <div className="font-medium">
                      {step.fromCrypto.symbol.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${step.fromCrypto.current_price.toFixed(2)}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  {stepIndex === path.steps.length - 1 && (
                    <div className="bg-gray-50 px-3 py-2 rounded">
                      <div className="font-medium">
                        {step.toCrypto.symbol.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${step.toCrypto.current_price.toFixed(2)}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};