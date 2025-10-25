import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Filter,
  Search,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Tag,
  CheckCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  HandCoins,
  Banknote,
  X,
  ChevronDown
} from 'lucide-react';
import { Transaction, TransactionType, TransactionFilters } from '../types';
import { transactionAPI } from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CustomSelect from '../components/ui/CustomSelect';
import CustomDatePicker from '../components/ui/CustomDatePicker';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [modalTypeDropdownOpen, setModalTypeDropdownOpen] = useState(false);
  const [modalCategoryDropdownOpen, setModalCategoryDropdownOpen] = useState(false);
  
  // Form state for add/edit transaction
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    contactPerson: '',
    dueDate: '',
    tags: '',
    location: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Categories for different transaction types
  const categories = {
    expense: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'],
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Bonus', 'Other'],
    borrow: ['Personal Loan', 'Credit Card', 'Family/Friends', 'Business Loan', 'Other'],
    lend: ['Personal', 'Family/Friends', 'Business', 'Investment', 'Other']
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getTransactions({
        ...filters,
        search: searchTerm || undefined
      });
      
      if (response.success && response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, searchTerm]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    if ((formData.type === 'borrow' || formData.type === 'lend') && !formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required for borrow/lend transactions';
    }
    if ((formData.type === 'borrow' || formData.type === 'lend') && !formData.dueDate) {
      errors.dueDate = 'Due date is required for borrow/lend transactions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const transactionData = {
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        ...(formData.contactPerson && { contactPerson: formData.contactPerson }),
        ...(formData.dueDate && { dueDate: formData.dueDate }),
        ...(formData.tags && { tags: formData.tags.split(',').map(tag => tag.trim()) }),
        ...(formData.location && { location: formData.location })
      };

      let response;
      if (selectedTransaction) {
        response = await transactionAPI.updateTransaction(selectedTransaction._id, transactionData);
        toast.success('Transaction updated successfully!');
      } else {
        response = await transactionAPI.createTransaction(transactionData);
        toast.success('Transaction added successfully!');
      }

      if (response.success) {
        setShowAddModal(false);
        setShowEditModal(false);
        resetForm();
        fetchTransactions();
      }
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to save transaction');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      contactPerson: '',
      dueDate: '',
      tags: '',
      location: ''
    });
    setFormErrors({});
    setSelectedTransaction(null);
  };

  // Handle edit transaction
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date.split('T')[0],
      contactPerson: transaction.contactPerson || '',
      dueDate: transaction.dueDate ? transaction.dueDate.split('T')[0] : '',
      tags: transaction.tags?.join(', ') || '',
      location: transaction.location || ''
    });
    setShowEditModal(true);
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.deleteTransaction(id);
        toast.success('Transaction deleted successfully!');
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Failed to delete transaction');
      }
    }
  };

  // Handle mark as settled
  const handleMarkAsSettled = async (id: string) => {
    try {
      await transactionAPI.markAsSettled(id);
      toast.success('Transaction marked as settled!');
      fetchTransactions();
    } catch (error) {
      console.error('Error marking as settled:', error);
      toast.error('Failed to mark as settled');
    }
  };

  // Get transaction icon and color
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
      case 'expense':
        return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
      case 'borrow':
        return <HandCoins className="w-5 h-5 text-orange-600" />;
      case 'lend':
        return <Banknote className="w-5 h-5 text-blue-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  // Format amount with color
  const formatAmount = (amount: number, type: TransactionType) => {
    const formattedAmount = `$${Math.abs(amount).toFixed(2)}`;
    const colorClass = type === 'income' ? 'text-green-600' : 
                      type === 'expense' ? 'text-red-600' :
                      type === 'borrow' ? 'text-orange-600' : 'text-blue-600';
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';
    
    return (
      <span className={`font-semibold ${colorClass}`}>
        {prefix}{formattedAmount}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Transactions
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage your income, expenses, and lending/borrowing
              </p>
            </div>
          </div>
          
          {/* Add Transaction Button - Full width on mobile */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </motion.button>
        </div>

        {/* Filters and Search */}
        <div className="card p-4 sm:p-6 overflow-visible">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search - Full width on all screens */}
            <div className="w-full">
              <div className="input-group">
                <Search className="input-icon" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field input-with-icon"
                />
              </div>
            </div>

            {/* Filters Row - Stacked on mobile, row on tablet+ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Type Filter */}
              <div className="w-full sm:flex-1 relative">
                <button
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 shadow-sm"
                >
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {filters.type ? 
                      (filters.type === 'income' ? '💵 Income' : 
                       filters.type === 'expense' ? '💸 Expense' :
                       filters.type === 'borrow' ? '🤝 Borrow' : '💳 Lend') 
                      : '💰 All Types'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                    typeDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {typeDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setTypeDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-20"
                    >
                      {[
                        { value: '', label: 'All Types', icon: '💰' },
                        { value: 'income', label: 'Income', icon: '💵' },
                        { value: 'expense', label: 'Expense', icon: '💸' },
                        { value: 'borrow', label: 'Borrow', icon: '🤝' },
                        { value: 'lend', label: 'Lend', icon: '💳' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, type: option.value as TransactionType || undefined }));
                            setTypeDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-all duration-150 text-sm ${
                            (filters.type || '') === option.value
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                          }`}
                        >
                          <span className="text-base">{option.icon}</span>
                          <span>{option.label}</span>
                          {(filters.type || '') === option.value && (
                            <span className="ml-auto text-primary-600 dark:text-primary-400 text-sm">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>

              {/* Date Range - Side by side on all screens */}
              <div className="flex gap-2 w-full sm:flex-1">
                <CustomDatePicker
                  value={filters.startDate || ''}
                  onChange={(value) => setFilters(prev => ({ ...prev, startDate: value || undefined }))}
                  placeholder="Start Date"
                  className="flex-1"
                />
                <CustomDatePicker
                  value={filters.endDate || ''}
                  onChange={(value) => setFilters(prev => ({ ...prev, endDate: value || undefined }))}
                  placeholder="End Date"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center p-8 sm:p-12">
              <DollarSign className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No transactions found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first transaction
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="btn-primary"
              >
                Add Transaction
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="flex flex-col sm:hidden gap-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-1">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {transaction.description}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="badge-primary text-xs capitalize">
                              {transaction.type}
                            </span>
                            <span className="badge-primary text-xs">
                              {transaction.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-base font-semibold">
                          {formatAmount(transaction.amount, transaction.type)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      {transaction.contactPerson && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{transaction.contactPerson}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      {(transaction.type === 'borrow' || transaction.type === 'lend') && (
                        <div>
                          {transaction.isSettled ? (
                            <span className="badge-success text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Settled
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkAsSettled(transaction._id)}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Mark Settled
                            </button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
                          className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {transaction.description}
                          </h3>
                          <span className="badge-primary capitalize">
                            {transaction.type}
                          </span>
                          <span className="badge-primary">
                            {transaction.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                          
                          {transaction.contactPerson && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{transaction.contactPerson}</span>
                            </div>
                          )}
                          
                          {transaction.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{transaction.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatAmount(transaction.amount, transaction.type)}
                        </div>
                        
                        {(transaction.type === 'borrow' || transaction.type === 'lend') && (
                          <div className="flex items-center gap-2 mt-1">
                            {transaction.isSettled ? (
                              <span className="badge-success text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Settled
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMarkAsSettled(transaction._id)}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                              >
                                Mark Settled
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
                          className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Transaction Modal */}
        <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="card p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction Type
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setModalTypeDropdownOpen(!modalTypeDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200"
                    >
                      <span className="flex items-center gap-2 font-medium text-sm text-gray-900 dark:text-white">
                        {formData.type === 'expense' ? '💸 Expense' :
                         formData.type === 'income' ? '💵 Income' :
                         formData.type === 'borrow' ? '🤝 Borrow' : '💳 Lend'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                        modalTypeDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {modalTypeDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-[60]" 
                          onClick={() => setModalTypeDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-[61]"
                        >
                          {[
                            { value: 'expense', label: 'Expense', icon: '💸' },
                            { value: 'income', label: 'Income', icon: '💵' },
                            { value: 'borrow', label: 'Borrow', icon: '🤝' },
                            { value: 'lend', label: 'Lend', icon: '💳' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, type: option.value as TransactionType, category: '' }));
                                setModalTypeDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-all duration-150 text-sm ${
                                formData.type === option.value
                                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                              }`}
                            >
                              <span className="text-base">{option.icon}</span>
                              <span>{option.label}</span>
                              {formData.type === option.value && (
                                <span className="ml-auto text-primary-600 dark:text-primary-400 text-sm">✓</span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>

                {/* Category and Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setModalCategoryDropdownOpen(!modalCategoryDropdownOpen)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-dark-800 border-2 rounded-lg transition-all duration-200 text-left ${
                          formErrors.category ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500'
                        }`}
                      >
                        <span className={`font-medium text-sm ${
                          formData.category ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                        }`}>
                          {formData.category || 'Select Category'}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                          modalCategoryDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {modalCategoryDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-[60]" 
                            onClick={() => setModalCategoryDropdownOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-[61] max-h-60 overflow-y-auto"
                          >
                            {categories[formData.type].map((category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, category }));
                                  setModalCategoryDropdownOpen(false);
                                  if (formErrors.category) {
                                    setFormErrors(prev => ({ ...prev, category: '' }));
                                  }
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-all duration-150 text-sm ${
                                  formData.category === category
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                                }`}
                              >
                                <span>{category}</span>
                                {formData.category === category && (
                                  <span className="text-primary-600 dark:text-primary-400 text-sm">✓</span>
                                )}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </div>
                    {formErrors.category && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={`input-field ${formErrors.amount ? 'border-red-500' : ''}`}
                    />
                    {formErrors.amount && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter transaction description"
                    rows={3}
                    className={`input-field ${formErrors.description ? 'border-red-500' : ''}`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <CustomDatePicker
                    name="date"
                    value={formData.date}
                    onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
                    error={formErrors.date}
                  />
                </div>

                {/* Contact Person and Due Date (for borrow/lend) */}
                {(formData.type === 'borrow' || formData.type === 'lend') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="Enter contact person name"
                        className={`input-field ${formErrors.contactPerson ? 'border-red-500' : ''}`}
                      />
                      {formErrors.contactPerson && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.contactPerson}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Due Date
                      </label>
                      <CustomDatePicker
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value }))}
                        error={formErrors.dueDate}
                      />
                    </div>
                  </div>
                )}

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (optional)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="Enter tags separated by commas"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter location"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary"
                  >
                    {selectedTransaction ? 'Update Transaction' : 'Add Transaction'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Transactions;
