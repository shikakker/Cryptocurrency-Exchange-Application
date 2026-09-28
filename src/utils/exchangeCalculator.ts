import { CryptoPrice } from '../types';

export interface PathStep {
  fromCrypto: CryptoPrice;
  toCrypto: CryptoPrice;
  rate: number;
  inputAmount: number;
  outputAmount: number;
}

export interface TradingPath {
  steps: PathStep[];
  totalReturnPercentage: number;
}

const SIMULATED_FEE_RATE = 0.001;

function validMarket(crypto: CryptoPrice) {
  return Number.isFinite(crypto.current_price) && crypto.current_price > 0;
}

function conversionRate(from: CryptoPrice, to: CryptoPrice) {
  return from.current_price / to.current_price;
}

export const findBestTradingPaths = (
  cryptos: CryptoPrice[],
  maxSteps = 4,
  minReturnPercentage = 0.1,
): TradingPath[] => {
  const markets = cryptos.filter(validMarket);
  const paths: TradingPath[] = [];

  for (const start of markets) {
    const walk = (
      current: CryptoPrice,
      amount: number,
      steps: PathStep[],
      visited: Set<string>,
    ) => {
      if (steps.length >= maxSteps) return;

      for (const next of markets) {
        const closesCycle = next.id === start.id;
        if (!closesCycle && visited.has(next.id)) continue;
        if (closesCycle && steps.length === 0) continue;

        const rate = conversionRate(current, next);
        const outputAmount = amount * rate * (1 - SIMULATED_FEE_RATE);
        const nextStep: PathStep = {
          fromCrypto: current,
          toCrypto: next,
          rate,
          inputAmount: amount,
          outputAmount,
        };
        const nextSteps = [...steps, nextStep];

        if (closesCycle) {
          const totalReturnPercentage = (outputAmount - 1) * 100;
          if (totalReturnPercentage > minReturnPercentage) {
            paths.push({ steps: nextSteps, totalReturnPercentage });
          }
          continue;
        }

        visited.add(next.id);
        walk(next, outputAmount, nextSteps, visited);
        visited.delete(next.id);
      }
    };

    walk(start, 1, [], new Set([start.id]));
  }

  return paths
    .sort((a, b) => b.totalReturnPercentage - a.totalReturnPercentage)
    .slice(0, 10);
};
