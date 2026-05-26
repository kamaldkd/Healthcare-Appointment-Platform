const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ────────────────────────────────────────────────────────────────────
// Build list of allowed origins: always include localhost, plus CLIENT_URL in production.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

if (process.env.CLIENT_URL) {
  // Trim trailing slash to normalise comparison
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin header (Postman, curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error(`CORS policy: origin ${origin} is not allowed`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // we use Bearer tokens, not cookies — keep false
  })
);

// Explicitly handle OPTIONS preflight for all routes
// (some browsers send a preflight before the real request)
app.options('*', cors());
// ─────────────────────────────────────────────────────────────────────────────

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'HealthBook API running', status: 'ok' });
});

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});
