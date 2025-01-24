import React from 'react';
import { ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const TransactionCard = ({ transaction, isIncome }) => {
  const formattedDate = new Date(transaction.expense_date || transaction.payment_date)
    .toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div className="group relative rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center space-x-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full 
          ${isIncome 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-red-100 dark:bg-red-900/30'}`}>
          {isIncome ? (
            <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
          ) : (
            <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
          )}
        </div>
        <div className="space-y-1">
          <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
            {transaction.description || transaction.item_name}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
              ${isIncome 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {transaction.type || transaction.item_type}
            </span>
            
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.method_name || transaction.payment_method}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right mt-2 md:mt-0">
        <p className={`text-lg font-bold ${
          isIncome 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          ${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
      </div>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <Download className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
};

const EnhancedTransactions = ({ paymentsData, expensesData }) => {
  const [activeTab, setActiveTab] = React.useState('all');

  const getTransactions = () => {
    switch (activeTab) {
      case 'income':
        return paymentsData.map(payment => ({ ...payment, isIncome: true }));
      case 'expense':
        return expensesData.map(expense => ({ ...expense, isIncome: false }));
      default:
        return [
          ...paymentsData.map(payment => ({ ...payment, isIncome: true })),
          ...expensesData.map(expense => ({ ...expense, isIncome: false }))
        ].sort((a, b) => {
          const dateA = new Date(a.expense_date || a.payment_date);
          const dateB = new Date(b.expense_date || b.payment_date);
          return dateB - dateA;
        });
    }
  };

  const TabButton = ({ label, value }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`relative px-4 py-2 transition-all duration-200 
        ${activeTab === value 
          ? 'text-primary font-semibold' 
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
    >
      {label}
      {activeTab === value && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
      )}
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-2 border-b">
            <TabButton label="All Transactions" value="all" />
            <TabButton label="Income" value="income" />
            <TabButton label="Expense" value="expense" />
          </div>
          
          <div className="space-y-1">
            {getTransactions().map((transaction, index) => (
              <TransactionCard key={index} transaction={transaction} isIncome={transaction.isIncome} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTransactions;