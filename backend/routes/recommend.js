
import express from 'express';
import { generateRecommendations } from '../services/recommendationEngine.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.answers) {
      return res.status(400).json({ error: 'Answers are required for analysis' });
    }
    
    const recommendations = await generateRecommendations(profile);
    res.json(recommendations);
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({ error: 'Failed to process recommendations' });
  }
});

export default router;
