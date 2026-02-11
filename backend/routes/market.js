
import express from 'express';
import { generateFullMarketReport } from '../services/marketSimulator.js';

const router = express.Router();

router.get('/trends', (req, res) => {
  try {
    const report = generateFullMarketReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate market simulation' });
  }
});

export default router;
