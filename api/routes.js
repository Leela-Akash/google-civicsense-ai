import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './firebase-server.js';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';

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
    
    // Create complaint data
    const complaintData = {
      description,
      category: category === 'Other' ? customCategory : category,
      location,
      userId,
      status: 'pending',
      createdAt: new Date(),
      priority: 'MEDIUM' // Default priority
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'complaints'), complaintData);
    console.log('Complaint saved to Firestore:', docRef.id);
    
    // Try Gemini AI analysis (skip if quota exceeded)
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Use Gemini 2.5 Flash
        
        const prompt = `Analyze this civic complaint and determine priority (HIGH/MEDIUM/LOW):
        Description: ${description}
        Category: ${category === 'Other' ? customCategory : category}
        
        Respond with JSON: {"priority": "HIGH/MEDIUM/LOW", "analysis": "brief analysis"}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResult = JSON.parse(response.text());
        
        // Update complaint with AI analysis
        await updateDoc(doc(db, 'complaints', docRef.id), {
          priority: aiResult.priority,
          aiAnalysis: aiResult.analysis
        });
        
        console.log('AI analysis completed');
      }
    } catch (aiError) {
      console.error('AI Analysis failed (continuing without it):', aiError.message);
    }
    
    res.json({ 
      success: true, 
      id: docRef.id,
      message: 'Complaint submitted successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit complaint', details: error.message });
  }
});

// Get user complaints
router.get('/complaints/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'complaints'), 
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    const complaints = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      complaints.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt.toDate() // Convert Firestore timestamp
      });
    });
    
    // Sort in JavaScript instead of Firestore
    complaints.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log(`Found ${complaints.length} complaints for user ${userId}`);
    res.json({ success: true, complaints });
    
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

export default router;