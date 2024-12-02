import React from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { CryptoList } from './components/CryptoList/CryptoList';
import { TransactionHistory } from './components/TransactionHistory/TransactionHistory';
import { ExchangeForm } from './components/Exchange/ExchangeForm';
import { ExchangeResult } from './components/Exchange/ExchangeResult';
import { BestExchangePaths } from './components/Exchange/BestExchangePaths';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Crypto Exchange</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Market Prices</h2>
                <CryptoList />
              </div>
              <BestExchangePaths />
              <ExchangeForm />
              <ExchangeResult />
            </div>
          </div>
          <div>
            <TransactionHistory />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;