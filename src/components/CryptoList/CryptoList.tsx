import React, { useEffect, useState } from 'react';
import { getCryptoPrices } from '../../services/api';
import { CryptoPrice } from '../../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const CryptoList = () => {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getCryptoPrices();
        setCryptos(data);
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cryptocurrency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price (USD)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              24h Change
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cryptos.map((crypto) => (
            <tr key={crypto.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium">{crypto.name}</span>
                  <span className="ml-2 text-gray-500">{crypto.symbol.toUpperCase()}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${crypto.current_price.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {crypto.price_change_percentage_24h > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      crypto.price_change_percentage_24h > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};