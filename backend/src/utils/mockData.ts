// Mock data for demo without database connection

export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Demo User',
  email: 'demo@expensetracker.com',
  avatar: '',
  createdAt: new Date().toISOString()
};

export const mockTransactions = [
  {
    _id: '507f1f77bcf86cd799439012',
    user: '507f1f77bcf86cd799439011',
    type: 'income',
    category: 'Salary',
    amount: 5000,
    description: 'Monthly salary',
    date: new Date().toISOString(),
    status: 'completed',
    isSettled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439013',
    user: '507f1f77bcf86cd799439011',
    type: 'expense',
    category: 'Food & Dining',
    amount: 50,
    description: 'Lunch at restaurant',
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    status: 'completed',
    isSettled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439014',
    user: '507f1f77bcf86cd799439011',
    type: 'expense',
    category: 'Transportation',
    amount: 25,
    description: 'Gas for car',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'completed',
    isSettled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439015',
    user: '507f1f77bcf86cd799439011',
    type: 'borrow',
    category: 'Personal Loan',
    amount: 500,
    description: 'Borrowed from John',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: 'completed',
    contactPerson: 'John Doe',
    contactPhone: '+1234567890',
    dueDate: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
    isSettled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '507f1f77bcf86cd799439016',
    user: '507f1f77bcf86cd799439011',
    type: 'lend',
    category: 'Personal Loan',
    amount: 200,
    description: 'Lent to Sarah',
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    status: 'completed',
    contactPerson: 'Sarah Smith',
    contactPhone: '+0987654321',
    dueDate: new Date(Date.now() + 1296000000).toISOString(), // 15 days from now
    isSettled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockDashboardData = {
  period: 'month',
  income: { total: 5000, count: 1 },
  expenses: { total: 75, count: 2 },
  balance: 4925,
  borrowing: { total: 500, count: 1 },
  lending: { total: 200, count: 1 },
  expensesByCategory: [
    { _id: 'Food & Dining', totalAmount: 50, count: 1 },
    { _id: 'Transportation', totalAmount: 25, count: 1 }
  ],
  recentTransactions: mockTransactions.slice(0, 5)
};