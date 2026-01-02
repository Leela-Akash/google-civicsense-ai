import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

// Submit complaint with AI analysis
router.post('/submit-complaint', async (req, res) => {
  try {
    console.log('Received complaint:', req.body);
    
    const { description, category, customCategory, location, userId } = req.body;
    
    // Simple response for now
    const complaintId = Date.now().toString();
    
    // Try Gemini AI analysis
    let priority = 'MEDIUM';
    let analysis = 'Basic analysis';
    
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const prompt = `Analyze this civic complaint and determine priority (HIGH/MEDIUM/LOW):
        Description: ${description}
        Category: ${category === 'Other' ? customCategory : category}
        
        Respond with JSON: {"priority": "HIGH/MEDIUM/LOW", "analysis": "brief analysis"}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResult = JSON.parse(response.text());
        
        priority = aiResult.priority;
        analysis = aiResult.analysis;
      }
    } catch (aiError) {
      console.error('AI Analysis failed:', aiError);
    }
    
    res.json({ 
      success: true, 
      id: complaintId,
      priority,
      analysis,
      message: 'Complaint submitted successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit complaint', details: error.message });
  }
});

export default router;