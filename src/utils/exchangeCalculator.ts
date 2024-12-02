import { CryptoPrice } from '../types';

interface PathStep {
  fromCrypto: CryptoPrice;
  toCrypto: CryptoPrice;
  rate: number;
  profitPercentage: number;
}

interface TradingPath {
  steps: PathStep[];
  totalProfitPercentage: number;
}

export const findBestTradingPaths = (
  cryptos: CryptoPrice[],
  maxSteps: number = 5,
  minProfitPercentage: number = 0.1
): TradingPath[] => {
  const paths: TradingPath[] = [];
  
  const calculateRate = (from: CryptoPrice, to: CryptoPrice): number => {
    return from.current_price / to.current_price;
  };

  const findPaths = (
    currentPath: PathStep[],
    currentCrypto: CryptoPrice,
    initialPrice: number,
    visited: Set<string>
  ) => {
    if (currentPath.length >= maxSteps) {
      return;
    }

    for (const toCrypto of cryptos) {
      if (visited.has(toCrypto.id)) continue;

      const rate = calculateRate(currentCrypto, toCrypto);
      const currentValue = initialPrice * rate;
      const profitPercentage = ((currentValue - initialPrice) / initialPrice) * 100;

      const step: PathStep = {
        fromCrypto: currentCrypto,
        toCrypto,
        rate,
        profitPercentage
      };

      const newPath = [...currentPath, step];
      const totalProfit = newPath.reduce((acc, step) => acc + step.profitPercentage, 0);

      if (totalProfit > minProfitPercentage) {
        paths.push({
          steps: newPath,
          totalProfitPercentage: totalProfit
        });
      }

      visited.add(toCrypto.id);
      findPaths(newPath, toCrypto, currentValue, visited);
      visited.delete(toCrypto.id);
    }
  };

  cryptos.forEach(startCrypto => {
    findPaths([], startCrypto, startCrypto.current_price, new Set([startCrypto.id]));
  });

  return paths
    .sort((a, b) => b.totalProfitPercentage - a.totalProfitPercentage)
    .slice(0, 10);
};