import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getCryptoPrices } from '../../services/api';
import { CryptoPrice, ExchangePath, ExchangeStep } from '../../types';
import { useExchangeStore } from '../../store/exchangeStore';

export const ExchangeForm = () => {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [steps, setSteps] = useState<ExchangeStep[]>([]);
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const setExchangePath = useExchangeStore((state) => state.setExchangePath);

  useEffect(() => {
    let cancelled = false;
    const fetchPrices = async () => {
      try {
        const data = await getCryptoPrices();
        if (!cancelled) setCryptos(data);
      } catch {
        if (!cancelled) setError('Market data is temporarily unavailable.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchPrices();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddStep = () => {
    if (steps.length >= 5) return;
    const previousTo = steps.at(-1)?.toCrypto ?? '';
    setSteps([
      ...steps,
      {
        fromCrypto: previousTo,
        toCrypto: '',
        amount: 0,
        rate: 0,
        resultAmount: 0,
      },
    ]);
  };

  const handleStepChange = (
    index: number,
    field: keyof ExchangeStep,
    value: string | number,
  ) => {
    const newSteps = [...steps];
    const step = { ...newSteps[index] };

    if (field === 'fromCrypto' || field === 'toCrypto') {
      step[field] = value as string;
    } else if (field === 'amount') {
      step.amount = Number(value);
    }

    newSteps[index] = step;
    setSteps(newSteps);
  };

  const calculatePath = () => {
    setError('');

    if (!Number.isFinite(initialAmount) || initialAmount <= 0) {
      setError('Enter a positive initial amount.');
      return;
    }
    if (steps.length === 0) {
      setError('Add at least one conversion step.');
      return;
    }

    let currentAmount = initialAmount;
    let previousAsset = steps[0].fromCrypto;
    const firstMarket = cryptos.find((c) => c.symbol === previousAsset);

    if (!firstMarket) {
      setError('Select a valid starting asset.');
      return;
    }

    const calculatedSteps: ExchangeStep[] = [];

    for (const step of steps) {
      if (!step.fromCrypto || !step.toCrypto || step.fromCrypto === step.toCrypto) {
        setError('Each conversion step must use two different assets.');
        return;
      }
      if (step.fromCrypto !== previousAsset) {
        setError('Each step must continue from the asset produced by the previous step.');
        return;
      }

      const fromCrypto = cryptos.find((c) => c.symbol === step.fromCrypto);
      const toCrypto = cryptos.find((c) => c.symbol === step.toCrypto);
      if (!fromCrypto || !toCrypto) {
        setError('One of the selected assets is not available in the current market snapshot.');
        return;
      }

      const inputAmount = currentAmount;
      const rate = fromCrypto.current_price / toCrypto.current_price;
      const resultAmount = inputAmount * rate;

      calculatedSteps.push({
        ...step,
        amount: inputAmount,
        rate,
        resultAmount,
      });

      currentAmount = resultAmount;
      previousAsset = step.toCrypto;
    }

    const finalMarket = cryptos.find((c) => c.symbol === previousAsset);
    if (!finalMarket) {
      setError('Final asset is unavailable in the current market snapshot.');
      return;
    }

    const initialUsdValue = initialAmount * firstMarket.current_price;
    const finalUsdValue = currentAmount * finalMarket.current_price;
    const totalPercentageChange =
      initialUsdValue > 0
        ? ((finalUsdValue - initialUsdValue) / initialUsdValue) * 100
        : 0;

    const path: ExchangePath = {
      steps: calculatedSteps,
      totalPercentageChange,
      initialAmount,
      finalAmount: currentAmount,
    };

    setExchangePath(path);
  };

  if (loading) return <div>Loading market snapshot…</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Multi-step Conversion Simulator</h2>
      <p className="mb-4 text-sm text-gray-600">
        This estimates asset quantities from one USD market snapshot. It does not execute trades,
        include venue liquidity, spreads, slippage or guarantee executable prices.
      </p>

      {error && <div role="alert" className="mb-4 text-sm text-red-600">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Initial asset amount</label>
        <input
          type="number"
          min="0"
          step="any"
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
                disabled={index > 0}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select asset</option>
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
                <option value="">Select asset</option>
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
            type="button"
            onClick={handleAddStep}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Step
          </button>
        )}
        {steps.length > 0 && (
          <button
            type="button"
            onClick={calculatePath}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Calculate Estimate
          </button>
        )}
      </div>
    </div>
  );
};
