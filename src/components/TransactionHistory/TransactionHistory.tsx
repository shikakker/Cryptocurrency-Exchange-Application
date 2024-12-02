import React from 'react';
import { useTransactionStore } from '../../store/transactionStore';

export const TransactionHistory = () => {
  const transactions = useTransactionStore((state) => state.transactions);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Transaction History
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.type === 'buy' ? 'Bought' : 'Sold'}{' '}
                    {transaction.cryptocurrency}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: {transaction.amount} @ ${transaction.price}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
          {transactions.length === 0 && (
            <li className="px-4 py-4 text-center text-gray-500">
              No transactions yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};