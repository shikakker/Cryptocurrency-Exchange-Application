import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getCryptoPrices } from '../../services/api';
import { CryptoPrice, ExchangePath, ExchangeStep } from '../../types';
import { useExchangeStore } from '../../store/exchangeStore';
import { useTransactionStore } from '../../store/transactionStore';

export const ExchangeForm = () => {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<ExchangeStep[]>([]);
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const setExchangePath = useExchangeStore((state) => state.setExchangePath);
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getCryptoPrices();
        setCryptos(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
      }
    };
    fetchPrices();
  }, []);

  const handleAddStep = () => {
    if (steps.length < 5) {
      setSteps([...steps, {
        fromCrypto: '',
        toCrypto: 'usdt',
        amount: 0,
        rate: 0,
        resultAmount: 0
      }]);
    }
  };

  const handleStepChange = (index: number, field: keyof ExchangeStep, value: string | number) => {
    const newSteps = [...steps];
    const step = { ...newSteps[index] };
    
    if (field === 'fromCrypto' || field === 'toCrypto') {
      step[field] = value as string;
      const fromCrypto = cryptos.find(c => c.symbol === step.fromCrypto);
      const toCrypto = cryptos.find(c => c.symbol === step.toCrypto);
      
      if (fromCrypto && toCrypto) {
        step.rate = fromCrypto.current_price / toCrypto.current_price;
        step.resultAmount = step.amount * step.rate;
      }
    } else if (field === 'amount') {
      step.amount = Number(value);
      step.resultAmount = step.amount * step.rate;
    }

    newSteps[index] = step;
    setSteps(newSteps);
  };

  const calculatePath = () => {
    if (steps.length === 0) return;

    let currentAmount = initialAmount;
    const calculatedSteps = steps.map(step => {
      const fromCrypto = cryptos.find(c => c.symbol === step.fromCrypto);
      const toCrypto = cryptos.find(c => c.symbol === step.toCrypto);
      
      if (!fromCrypto || !toCrypto) return step;

      const rate = fromCrypto.current_price / toCrypto.current_price;
      const resultAmount = currentAmount * rate;
      currentAmount = resultAmount;

      return {
        ...step,
        amount: currentAmount,
        rate,
        resultAmount
      };
    });

    const totalPercentageChange = ((currentAmount - initialAmount) / initialAmount) * 100;

    const path: ExchangePath = {
      steps: calculatedSteps,
      totalPercentageChange,
      initialAmount,
      finalAmount: currentAmount
    };

    setExchangePath(path);

    // Record transactions
    calculatedSteps.forEach(step => {
      addTransaction({
        type: 'sell',
        amount: step.amount,
        cryptocurrency: step.fromCrypto,
        price: step.rate
      });
      addTransaction({
        type: 'buy',
        amount: step.resultAmount,
        cryptocurrency: step.toCrypto,
        price: 1 / step.rate
      });
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Multi-step Exchange</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Initial Amount</label>
        <input
          type="number"
          value={initialAmount}
          onChange={(e) => setInitialAmount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {steps.map((step, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">From</label>
              <select
                value={step.fromCrypto}
                onChange={(e) => handleStepChange(index, 'fromCrypto', e.target.value)}
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
                onChange={(e) => handleStepChange(index, 'toCrypto', e.target.value)}
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
      ))}

      <div className="flex space-x-4">
        {steps.length < 5 && (
          <button
            onClick={handleAddStep}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Step
          </button>
        )}
        {steps.length > 0 && (
          <button
            onClick={calculatePath}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Calculate Path
          </button>
        )}
      </div>
    </div>
  );
};