import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
let aiClient: GoogleGenAI | null = null;

if (hasGeminiKey) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Status check API
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    hasGeminiKey,
    backend: 'Express + Node.js (Ready for Supabase/FastAPI migration)',
    version: '1.0.0',
  });
});

// AI Itinerary Generation Endpoint
app.post('/api/itinerary/generate', async (req, res) => {
  try {
    const {
      destination,
      departureCity,
      startDate,
      endDate,
      durationDays,
      travelers,
      budgetTier,
      totalBudget,
      interests,
      travelStyle,
      transportPreference,
      accommodationPreference,
      dietaryOrSpecialNotes,
    } = req.body;

    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    // If Gemini key is available on the server, call Gemini 3.8 Flash with structured schema
    if (aiClient) {
      try {
        const prompt = `Create an exceptionally detailed, realistic, and inspiring multi-day travel itinerary for a trip to "${destination}" departing from "${departureCity || 'Home'}".
Trip parameters:
- Duration: ${durationDays} days (From ${startDate} to ${endDate})
- Number of Travelers: ${travelers}
- Budget Tier: ${budgetTier} (Approximate total budget: $${totalBudget})
- Core Interests: ${(interests || []).join(', ') || 'Sightseeing, Culture, Food'}
- Travel Style: ${travelStyle || 'Balanced'}
- Preferred Transport: ${transportPreference || 'Walking & Public Transit'}
- Accommodation: ${accommodationPreference || 'Boutique Hotel'}
- Special notes / Dietary: ${dietaryOrSpecialNotes || 'None'}

Generate a rich day-by-day plan with morning, afternoon, and evening slots.
Each slot should have:
- title: concise descriptive title
- time: e.g. "09:00 AM - 12:00 PM"
- duration: e.g. "3 hours"
- category: one of ["Sightseeing", "Food", "Adventure", "Culture", "Nature", "Relaxation", "Shopping"]
- description: engaging 2-3 sentence description with insider tips and highlights
- location: specific landmark, neighborhood, or venue name
- estimatedCost: numeric dollar cost per person (e.g. 25)
- transportNote: how to get there from the previous spot
- tips: 1 practical insider tip

Also include:
- dailyDining: recommendations for breakfast, lunch, and dinner (name, cuisine, priceCategory)
- dailyTransport: daily transit overview
- estimatedDailyCost: total approximate cost for the day per person
- overallBudgetBreakdown: estimated cost for accommodation, dining, activities, transportation, and buffer/shopping
- essentialTips: array of 4-6 essential travel tips (local customs, etiquette, best transit passes, money saving)
- tripOverview: 2 sentence captivating summary of the itinerary experience`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite luxury travel curator and expert destination specialist. You craft authentic, beautifully-paced, highly realistic itineraries with verified landmark locations, local culinary gems, accurate pacing, and thoughtful budget advice.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                destination: { type: Type.STRING },
                tripOverview: { type: Type.STRING },
                days: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dayNumber: { type: Type.INTEGER },
                      theme: { type: Type.STRING },
                      morning: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          time: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          category: { type: Type.STRING },
                          description: { type: Type.STRING },
                          location: { type: Type.STRING },
                          estimatedCost: { type: Type.NUMBER },
                          transportNote: { type: Type.STRING },
                          tips: { type: Type.STRING },
                        },
                        required: ['title', 'time', 'category', 'description', 'location', 'estimatedCost'],
                      },
                      afternoon: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          time: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          category: { type: Type.STRING },
                          description: { type: Type.STRING },
                          location: { type: Type.STRING },
                          estimatedCost: { type: Type.NUMBER },
                          transportNote: { type: Type.STRING },
                          tips: { type: Type.STRING },
                        },
                        required: ['title', 'time', 'category', 'description', 'location', 'estimatedCost'],
                      },
                      evening: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          time: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          category: { type: Type.STRING },
                          description: { type: Type.STRING },
                          location: { type: Type.STRING },
                          estimatedCost: { type: Type.NUMBER },
                          transportNote: { type: Type.STRING },
                          tips: { type: Type.STRING },
                        },
                        required: ['title', 'time', 'category', 'description', 'location', 'estimatedCost'],
                      },
                      dining: {
                        type: Type.OBJECT,
                        properties: {
                          breakfast: { type: Type.STRING },
                          lunch: { type: Type.STRING },
                          dinner: { type: Type.STRING },
                        },
                        required: ['breakfast', 'lunch', 'dinner'],
                      },
                      transitSummary: { type: Type.STRING },
                      estimatedDayCost: { type: Type.NUMBER },
                    },
                    required: ['dayNumber', 'theme', 'morning', 'afternoon', 'evening', 'dining', 'transitSummary', 'estimatedDayCost'],
                  },
                },
                budgetBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    accommodation: { type: Type.NUMBER },
                    dining: { type: Type.NUMBER },
                    activities: { type: Type.NUMBER },
                    transportation: { type: Type.NUMBER },
                    misc: { type: Type.NUMBER },
                    total: { type: Type.NUMBER },
                  },
                  required: ['accommodation', 'dining', 'activities', 'transportation', 'misc', 'total'],
                },
                essentialTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['destination', 'tripOverview', 'days', 'budgetBreakdown', 'essentialTips'],
            },
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          return res.json({ success: true, source: 'gemini-3.8-flash', data: parsed });
        }
      } catch (geminiError: any) {
        console.error('Gemini API call failed, falling back to local smart engine:', geminiError?.message);
        // Fallback to client/local generator
        return res.json({ success: false, fallback: true, error: geminiError?.message });
      }
    }

    // If Gemini key is not set, advise client to use the built-in high-quality demo generator
    return res.json({
      success: false,
      fallback: true,
      message: 'Gemini API key not configured in environment. Using high-fidelity smart demo generator.',
    });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TravelMate AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
