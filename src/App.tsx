import React from 'react';
import { CryptoList } from './components/CryptoList/CryptoList';
import { ExchangeForm } from './components/Exchange/ExchangeForm';
import { ExchangeResult } from './components/Exchange/ExchangeResult';
import { BestExchangePaths } from './components/Exchange/BestExchangePaths';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Crypto Conversion Simulator</h1>
            <span className="text-sm text-gray-500">Demo only — no trading or custody</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Market Prices</h2>
            <CryptoList />
          </div>
          <BestExchangePaths />
          <ExchangeForm />
          <ExchangeResult />
        </div>
      </main>
    </div>
  );
}

export default App;
