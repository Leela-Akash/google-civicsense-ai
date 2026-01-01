import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Submit complaint with AI analysis
router.post('/submit-complaint', async (req, res) => {
  try {
    const { description, location, category } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Analyze this civic complaint and determine priority (HIGH/MEDIUM/LOW):
    Description: ${description}
    Location: ${location}
    Category: ${category}
    
    Respond with JSON: {"priority": "HIGH/MEDIUM/LOW", "analysis": "brief analysis"}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());
    
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze complaint' });
  }
});

// Analyze media (images)
router.post('/analyze-media', async (req, res) => {
  try {
    const { imageData } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent([
      'Analyze this image for civic issues. Describe what you see and suggest priority level.',
      { inlineData: { data: imageData, mimeType: 'image/jpeg' } }
    ]);
    
    const response = await result.response;
    res.json({ success: true, analysis: response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze media' });
  }
});

export default router;