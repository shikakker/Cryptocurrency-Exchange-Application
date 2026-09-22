import axios from 'axios';
import { CryptoPrice } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getCryptoPrices = async (): Promise<CryptoPrice[]> => {
  const response = await axios.get(
    `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false`,
    { timeout: 10_000 },
  );

  if (!Array.isArray(response.data)) {
    throw new Error('INVALID_MARKET_DATA');
  }

  return response.data.filter((item): item is CryptoPrice =>
    Boolean(
      item &&
      typeof item.id === 'string' &&
      typeof item.symbol === 'string' &&
      typeof item.name === 'string' &&
      Number.isFinite(item.current_price) &&
      item.current_price > 0,
    ),
  );
};
