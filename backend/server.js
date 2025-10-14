require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/database');
const passport = require('./config/passport');
const { isAuthenticated } = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const lifeLogRoutes = require('./routes/lifelogs');
const transactionRoutes = require('./routes/transactions');
const routineRoutes = require('./routes/routines');
const aiRoutes = require('./routes/ai');
const syncRoutes = require('./routes/sync');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://orkestra.bitebimuv.org', 'http://135.181.254.55:5000', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.use('/auth', authRoutes);
app.use('/api/applications', isAuthenticated, applicationRoutes);
app.use('/api/lifelogs', isAuthenticated, lifeLogRoutes);
app.use('/api/transactions', isAuthenticated, transactionRoutes);
app.use('/api/routines', isAuthenticated, routineRoutes);
app.use('/api/ai', isAuthenticated, aiRoutes);
app.use('/api/sync', isAuthenticated, syncRoutes);

// Dashboard data endpoint
app.get('/api/dashboard', isAuthenticated, async (req, res) => {
  try {
    const Application = require('./models/Application');
    const LifeLog = require('./models/LifeLog');
    const Transaction = require('./models/Transaction');
    const Routine = require('./models/Routine');

    const [applications, lifeLogs, transactions, routines] = await Promise.all([
      Application.find({ user: req.user._id }).limit(10),
      LifeLog.find({ user: req.user._id }).sort('-date').limit(10),
      Transaction.find({ user: req.user._id }).sort('-date').limit(10),
      Routine.find({ user: req.user._id, active: true })
    ]);

    const income = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenses = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      applications,
      lifeLogs,
      transactions,
      routines,
      stats: {
        totalApplications: applications.length,
        totalLifeLogs: await LifeLog.countDocuments({ user: req.user._id }),
        income: income[0]?.total || 0,
        expenses: expenses[0]?.total || 0,
        balance: (income[0]?.total || 0) - (expenses[0]?.total || 0),
        activeRoutines: routines.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve frontend - must be last route
app.use((req, res, next) => {
  // If no route matched and it's not an API call, serve index.html
  if (!req.path.startsWith('/api') && !req.path.startsWith('/auth') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
  } else {
    next();
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Orkestra server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
