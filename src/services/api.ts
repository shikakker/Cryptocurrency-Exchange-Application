import axios from 'axios';
import { CryptoPrice } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getCryptoPrices = async (): Promise<CryptoPrice[]> => {
  const response = await axios.get(
    `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false`
  );
  return response.data;
};