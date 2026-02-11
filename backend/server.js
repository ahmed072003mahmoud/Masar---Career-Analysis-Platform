
import express from 'express';
import cors from 'cors';
import marketRoutes from './routes/market.js';
import recommendRoutes from './routes/recommend.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/market', marketRoutes); // Access via /api/market/trends
app.use('/api/recommend', recommendRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
