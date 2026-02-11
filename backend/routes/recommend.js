
import express from 'express';
import { 
  getCareerRecommendations, 
  refineLearningPath, 
  getCareerInsights,
  chatWithAI,
  getLiveMarketNews
} from '../services/geminiService.js';

const router = express.Router();

// Mock Auth Middleware (for implementation structure)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // In a real app, verify JWT here
    // return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.post('/analyze', authenticate, async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.education) {
      return res.status(400).json({ error: 'Valid profile data is required' });
    }
    const recommendations = await getCareerRecommendations(profile);
    res.json(recommendations);
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({ error: 'Failed to process recommendations' });
  }
});

router.post('/refine-path', authenticate, async (req, res) => {
  try {
    const { path, targetRole } = req.body;
    const refined = await refineLearningPath(path, targetRole);
    res.json({ refined });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refine learning path' });
  }
});

router.post('/insights', authenticate, async (req, res) => {
  try {
    const { profile, answers } = req.body;
    const insights = await getCareerInsights(profile, answers);
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, history } = req.body;
    const response = await chatWithAI(message, history);
    res.json({ text: response });
  } catch (error) {
    res.status(500).json({ error: 'Chat service failure' });
  }
});

router.post('/market-news', async (req, res) => {
    try {
      const { sector } = req.body;
      // Fix: Now correctly calling the imported getLiveMarketNews function
      const news = await getLiveMarketNews(sector);
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Market news service failure' });
    }
  });

export default router;
