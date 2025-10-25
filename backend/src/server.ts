import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/database';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001

const allowedOrigins = [
  'http://localhost:3000',
  'https://hisaab-kitaab-ten.vercel.app'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hisaab Kitaab API is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});


    connectDB()

// Start server
// app.listen(PORT, () => {
//   console.log(`
// 🚀 Hisaab Kitaab API Server Started!
// 📡 Server running on: http://localhost:${PORT}
// 🌍 Environment: ${process.env.NODE_ENV || 'development'}

// 📊 Health Check: http://localhost:${PORT}/api/health
//   `);
// });

export default app;