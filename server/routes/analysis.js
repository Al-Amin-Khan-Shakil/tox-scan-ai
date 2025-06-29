import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';
import { GoogleAuth } from 'google-auth-library';
import pool from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
try {
  await fs.access(uploadsDir);
} catch {
  await fs.mkdir(uploadsDir, { recursive: true });
}

// OCR function using Tesseract.js
const extractTextFromImage = async (imageBuffer) => {
  try {
    console.log('Starting OCR process...');

    // Process image with Sharp for better OCR results
    const processedImage = await sharp(imageBuffer)
      .greyscale()
      .normalize()
      .sharpen()
      .png()
      .toBuffer();

    const { data: { text } } = await Tesseract.recognize(processedImage, 'eng', {
      logger: m => console.log('OCR Progress:', m)
    });

    console.log('OCR completed successfully');
    return text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

// Google AI analysis function
const analyzeWithGoogleAI = async (text) => {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }

    const prompt = `
As an expert toxicologist and ingredient safety analyst, analyze the following ingredient list for potential health risks.

Ingredient List:
"${text}"

Please provide a comprehensive analysis in the following format:

## Language Detection & Translation
First, identify the language of the ingredient list. If it's not in English, provide an accurate English translation.

## Ingredient Safety Analysis
Analyze each ingredient for potential health risks including:
- Carcinogens
- Neurotoxins
- Hormone disruptors
- Allergens
- Substances harmful when overused
- Any other safety concerns

For each concerning ingredient, explain:
- What it is and its purpose
- Why it's potentially harmful
- Scientific evidence/sources (mention specific studies or regulatory findings when possible)
- Groups at higher risk (children, pregnant women, etc.)

## Risk Assessment
Provide an overall risk level: LOW, MEDIUM, or HIGH based on:
- Number of concerning ingredients
- Severity of potential effects
- Concentration levels (if determinable)
- Cumulative effects
- Risk levels should be consistently displayed in the format "Risk Level: [LOW/MEDIUM/HIGH]"

## Usage Recommendations
Provide specific guidance on:
- Whether the product is safe for general use
- Any usage limitations or precautions
- Specific warnings for vulnerable populations
- Alternative product suggestions if applicable

Be thorough but clear, and base your analysis on current scientific understanding and regulatory guidelines from agencies like FDA, EPA, and international health organizations.
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google AI API Error:', errorData);
      throw new Error('Failed to analyze ingredients with AI');
    }

    const data = await response.json();
    const analysis = data.candidates[0]?.content?.parts[0]?.text;
    console.log('AI Analysis received:', analysis);

    if (!analysis) {
      throw new Error('No analysis received from AI');
    }

    // Parse the analysis to extract risk level and recommendations
    const riskLevel = analysis.toLowerCase().includes('risk level: **high**') || analysis.toLowerCase().includes('risk level: high') || analysis.toLowerCase().includes('high risk') ? 'high' :
                 analysis.toLowerCase().includes('risk level: **medium**') || analysis.toLowerCase().includes('risk level: medium') || analysis.toLowerCase().includes('medium risk') ? 'medium' : 'low';

    // Extract recommendations section
    const recommendationsMatch = analysis.match(/## Usage Recommendations([\s\S]*?)(?=##|$)/i);
    const recommendations = recommendationsMatch ? recommendationsMatch[1].trim() :
      'Please consult with healthcare professionals for personalized advice regarding product safety.';

    return {
      fullAnalysis: analysis,
      riskLevel,
      recommendations
    };
  } catch (error) {
    console.error('Google AI Analysis Error:', error);
    throw new Error('Failed to analyze ingredients with AI');
  }
};

// Upload and analyze endpoint
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('Processing image upload for user:', req.user.userId);

    // Extract text from image using OCR
    const extractedText = await extractTextFromImage(req.file.buffer);

    if (!extractedText || extractedText.length < 10) {
      return res.status(400).json({
        message: 'Could not extract sufficient text from image. Please ensure the image is clear and contains readable ingredient text.'
      });
    }

    console.log('Extracted text length:', extractedText.length);

    // Analyze with Google AI
    const aiAnalysis = await analyzeWithGoogleAI(extractedText);

    // Save processed image
    const imageFilename = `${Date.now()}-${req.user.userId}.webp`;
    const imagePath = path.join(uploadsDir, imageFilename);

    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(imagePath);

    const imageUrl = `/uploads/${imageFilename}`;

    // Detect if translation was performed (simple heuristic)
    const translatedText = aiAnalysis.fullAnalysis.includes('Translation:') ?
      extractedText : null;

    // Save analysis to database
    const result = await pool.query(`
      INSERT INTO analyses (user_id, original_text, translated_text, analysis, recommendations, risk_level, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      req.user.userId,
      extractedText,
      translatedText,
      aiAnalysis.fullAnalysis,
      aiAnalysis.recommendations,
      aiAnalysis.riskLevel,
      imageUrl
    ]);

    const analysis = result.rows[0];

    res.json({
      id: analysis.id,
      originalText: analysis.original_text,
      translatedText: analysis.translated_text,
      analysis: analysis.analysis,
      recommendations: analysis.recommendations,
      riskLevel: analysis.risk_level,
      imageUrl: analysis.image_url,
      createdAt: analysis.created_at
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      message: error.message || 'Failed to analyze image. Please try again.'
    });
  }
});

// Get analysis history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, original_text, translated_text, analysis, recommendations, risk_level, image_url, created_at
      FROM analyses
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.user.userId]);

    const analyses = result.rows.map(row => ({
      id: row.id,
      originalText: row.original_text,
      translatedText: row.translated_text,
      analysis: row.analysis,
      recommendations: row.recommendations,
      riskLevel: row.risk_level,
      imageUrl: row.image_url,
      createdAt: row.created_at
    }));

    res.json(analyses);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Failed to fetch analysis history' });
  }
});

// Get specific analysis
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, original_text, translated_text, analysis, recommendations, risk_level, image_url, created_at
      FROM analyses
      WHERE id = $1 AND user_id = $2
    `, [req.params.id, req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const analysis = result.rows[0];
    res.json({
      id: analysis.id,
      originalText: analysis.original_text,
      translatedText: analysis.translated_text,
      analysis: analysis.analysis,
      recommendations: analysis.recommendations,
      riskLevel: analysis.risk_level,
      imageUrl: analysis.image_url,
      createdAt: analysis.created_at
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Failed to fetch analysis' });
  }
});

export default router;