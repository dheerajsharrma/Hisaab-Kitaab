import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { DashboardData } from '../types';
import { transactionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getDashboardData(period);
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your financial overview for this {period}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md min-w-[140px] justify-between"
          >
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year'}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-1.5 w-full bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-20"
              >
                {[
                  { value: 'week', label: 'This Week', icon: '📅' },
                  { value: 'month', label: 'This Month', icon: '📆' },
                  { value: 'year', label: 'This Year', icon: '🗓️' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPeriod(option.value as any);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-all duration-150 text-sm ${
                      period === option.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <span className="text-base">{option.icon}</span>
                    <span>{option.label}</span>
                    {period === option.value && (
                      <span className="ml-auto text-primary-600 dark:text-primary-400 text-sm">✓</span>
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${dashboardData?.income.total || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dashboardData?.income.count || 0} transactions
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ${dashboardData?.expenses.total || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dashboardData?.expenses.count || 0} transactions
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Balance</p>
              <p className={`text-2xl font-bold mt-1 ${
                (dashboardData?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${dashboardData?.balance || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Net income
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Borrowing/Lending</p>
              <div className="flex space-x-2 mt-1">
                <span className="text-lg font-bold text-orange-600">
                  ${dashboardData?.borrowing.total || 0}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-lg font-bold text-purple-600">
                  ${dashboardData?.lending.total || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Pending settlements
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {dashboardData?.recentTransactions.slice(0, 5).map((transaction, index) => (
            <motion.div
              key={transaction._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/20' :
                  transaction.type === 'expense' ? 'bg-red-100 dark:bg-red-900/20' :
                  transaction.type === 'borrow' ? 'bg-orange-100 dark:bg-orange-900/20' :
                  'bg-purple-100 dark:bg-purple-900/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : transaction.type === 'expense' ? (
                    <ArrowDownLeft className="w-4 h-4 text-red-600" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;