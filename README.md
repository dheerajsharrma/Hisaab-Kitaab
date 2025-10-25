# 🚀 Modern Expense Tracker

A full-stack expense tracking application with modern dark UI, dynamic animations, and comprehensive financial management features.

![Expense Tracker](https://via.placeholder.com/800x400/1e3a8a/ffffff?text=Expense+Tracker+Dashboard)

## ✨ Features

### 🎯 Core Features
- **Income & Expense Tracking** - Track all your financial transactions
- **Borrowing & Lending Management** - Keep track of money borrowed or lent to others
- **Smart Categories** - Organize transactions with customizable categories
- **Real-time Dashboard** - Beautiful analytics with charts and insights
- **Dark Mode Support** - Modern dark theme with smooth transitions

### 🎨 Modern UI/UX
- **Dark Theme by Default** - Professional dark interface
- **Framer Motion Animations** - Smooth animations throughout the app
- **Responsive Design** - Works perfectly on all devices
- **Interactive Charts** - Beautiful data visualization with Recharts
- **Glass Morphism Effects** - Modern design elements

### 🔐 Security & Authentication
- **JWT Authentication** - Secure user authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Protected Routes** - Route-level authentication protection

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router DOM** for routing
- **Recharts** for data visualization
- **React Hook Form** for form management
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** enabled

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm start
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/dashboard` - Get dashboard analytics
- `PATCH /api/transactions/:id/settle` - Mark as settled

## 🎨 UI Components

### Dashboard
- **Statistics Cards** - Income, expenses, balance, borrowing/lending
- **Interactive Charts** - Pie charts for expense categories
- **Recent Transactions** - Latest transaction list
- **Period Filters** - Week, month, year views

### Transaction Management
- **CRUD Operations** - Create, read, update, delete transactions
- **Advanced Filters** - By type, category, date range, settlement status
- **Search Functionality** - Search through descriptions and contacts
- **Pagination** - Efficient data loading

### Features by Transaction Type

#### 💰 Income
- Salary tracking
- Freelance income
- Investment returns
- Bonus payments

#### 💸 Expenses
- Food & dining
- Transportation
- Shopping
- Bills & utilities
- Healthcare
- Entertainment

#### 🤝 Borrowing/Lending
- Contact person tracking
- Phone numbers
- Due dates
- Settlement status
- Settlement tracking

## 🎯 Default Categories

The app comes with pre-configured categories:

**Income Categories:**
- 💰 Salary
- 💻 Freelance
- 📈 Investment
- 🎁 Bonus

**Expense Categories:**
- 🍔 Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- 🏠 Bills & Utilities
- ⚕️ Healthcare
- 📚 Education
- ✈️ Travel

## 🌙 Dark Mode

The application features a beautiful dark theme as default with:
- Smooth transitions
- Consistent color scheme
- Eye-friendly design
- Professional appearance

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Perfect tablet experience
- **Desktop** - Full desktop functionality
- **Touch Friendly** - All interactions work on touch devices

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Input Validation** - Express validator for all inputs
- **CORS Configuration** - Secure cross-origin requests
- **Protected Routes** - Authentication required for sensitive operations

## 🚀 Deployment

### Backend Deployment
1. Choose a hosting platform (Heroku, DigitalOcean, AWS)
2. Set environment variables
3. Deploy with MongoDB connection

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting
3. Update API URL in environment variables

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility-first CSS framework
- Framer Motion for smooth animations
- Recharts for beautiful charts
- Lucide React for consistent icons
- MongoDB for the flexible database solution

## 📞 Support

If you have any questions or need help, please open an issue or contact [your-email@example.com].

---

**Made with ❤️ and modern web technologies**