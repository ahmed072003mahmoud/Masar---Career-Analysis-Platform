
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import marketRoutes from './routes/market.js';
import recommendRoutes from './routes/recommend.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Headers: Protect against common web vulnerabilities
app.use(helmet());

// 2. Rate Limiting: Prevent DDoS and brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// 3. Strict CORS: Limit access to the frontend application
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // In production, replace '*' with actual domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Body Parsing with Limits: Prevent payload flooding
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/market', marketRoutes);
app.use('/api/recommend', recommendRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
