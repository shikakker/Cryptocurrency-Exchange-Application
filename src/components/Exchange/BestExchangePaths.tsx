import React, { useEffect, useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { getCryptoPrices } from '../../services/api';
import { findBestTradingPaths, TradingPath } from '../../utils/exchangeCalculator';

export const BestExchangePaths = () => {
  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState<TradingPath[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchAndCalculatePaths = async () => {
      try {
        const cryptos = await getCryptoPrices();
        const bestPaths = findBestTradingPaths(cryptos);
        if (!cancelled) {
          setPaths(bestPaths);
          setError('');
        }
      } catch {
        if (!cancelled) setError('Market data is temporarily unavailable.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchAndCalculatePaths();
    const interval = window.setInterval(fetchAndCalculatePaths, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) return <div>Checking round-trip conversion paths…</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Round-trip Simulation</h2>
      <p className="mb-4 text-sm text-gray-600">
        Educational estimate using one CoinGecko USD snapshot and a simulated 0.1% fee per conversion.
        It does not represent executable arbitrage or exchange quotes.
      </p>

      {error && <div role="alert" className="text-sm text-red-600">{error}</div>}

      {!error && paths.length === 0 && (
        <div className="flex gap-2 rounded-md bg-blue-50 p-4 text-sm text-blue-900">
          <Info className="h-5 w-5 shrink-0" />
          <span>No profitable same-snapshot round-trip path was found. This is the expected result when cross-rates are derived from one price source and fees are included.</span>
        </div>
      )}

      <div className="space-y-6">
        {paths.map((path, pathIndex) => (
          <div key={pathIndex} className="border rounded-lg p-4">
            <div className="mb-2 text-sm font-medium text-gray-700">
              Simulated net return: {path.totalReturnPercentage.toFixed(2)}%
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {path.steps.map((step, stepIndex) => (
                <React.Fragment key={`${step.fromCrypto.id}-${step.toCrypto.id}-${stepIndex}`}>
                  <div className="bg-gray-50 px-3 py-2 rounded">
                    {step.fromCrypto.symbol.toUpperCase()}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  {stepIndex === path.steps.length - 1 && (
                    <div className="bg-gray-50 px-3 py-2 rounded">
                      {step.toCrypto.symbol.toUpperCase()}
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
