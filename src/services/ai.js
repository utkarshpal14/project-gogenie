/**
 * AI Service Layer for GoGinie
 * Handles all AI API interactions for intelligent travel planning
 */

// API Configuration - Choose your preferred free API
const API_CONFIG = {
  // OpenAI (Free tier: $5/month)
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    }
  },
  
  // Anthropic Claude (Free tier: $5/month)
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    headers: {
      "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    }
  },
  
  // Google Gemini (Free tier: 15 requests/minute)
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY,
    }
  },
  
  // Hugging Face (Free tier: 30k requests/month)
  huggingface: {
    url: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    }
  },
  
  // Ollama (Local - Completely free)
  ollama: {
    url: "http://localhost:11434/api/generate",
    apiKey: null,
    headers: {
      "Content-Type": "application/json",
    }
  }
};

// Choose your preferred API here
const SELECTED_API = 'gemini'; // Using Google Gemini API
const currentAPI = API_CONFIG[SELECTED_API];

/**
 * Base AI API call function
 */
const callAI = async (messages, model = "gpt-4o-mini", temperature = 0.7) => {
  console.log('�� API Key check:', {
    selectedAPI: SELECTED_API,
    hasApiKey: !!currentAPI.apiKey,
    apiKeyLength: currentAPI.apiKey?.length || 0
  });

  if (!currentAPI.apiKey && SELECTED_API !== 'ollama') {
    console.warn('❌ API key not found. Using mock responses.');
    console.log('Available env vars:', {
      VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY ? 'Set' : 'Not set',
      VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY ? 'Set' : 'Not set'
    });
    return null;
  }

  try {
    console.log('🚀 Making API call to:', currentAPI.url);
    
    // Increase timeout to 30 seconds for complex requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds
    
    const response = await fetch(currentAPI.url, {
      method: 'POST',
      headers: currentAPI.headers,
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role === 'system' ? 'user' : msg.role,
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 8192,
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('✅ API response received');
    
    if (SELECTED_API === 'gemini') {
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log('📄 Gemini response length:', result.length);
      return result;
    } else {
      const result = data.choices?.[0]?.message?.content || "";
      console.log('📄 OpenAI response length:', result.length);
      return result;
    }
  } catch (error) {
    console.error('💥 API call failed:', error);
    if (error.name === 'AbortError') {
      console.error('⏰ Request timed out after 30 seconds');
    }
    return null;
  }
};

/**
 * Generate smart itinerary based on user preferences
 */
export async function generateSmartItinerary(tripData) {
  const {
    destination,
    startLocation,
    duration,
    budget,
    interests,
    travelStyle,
    groupSize,
    foodPreferences,
    transportPreference
  } = tripData;

  // Enhanced prompt for better structured response
  const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination} starting from ${startLocation}.

Travel Details:
- Duration: ${duration} days
- Budget: ₹${budget} for ${groupSize} people
- Travel Style: ${travelStyle}
- Interests: ${interests.join(', ')}
- Food Preference: ${foodPreferences}
- Transport: ${transportPreference}

Return a detailed JSON response with this exact structure:
{
  "itinerary": [
    {
      "day": "Day 1",
      "date": "2025-01-15",
      "activities": [
        {
          "time": "09:00",
          "activity": "Morning sightseeing at [specific location]",
          "location": "[exact location name]",
          "cost": 500,
          "duration": "2 hours"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": 8000,
    "food": 6000,
    "activities": 4000,
    "transportation": 2000
  },
  "recommendations": {
    "hotels": [
      {
        "name": "Hotel Name",
        "priceRange": "₹2000-3000/night",
        "rating": 4.5,
        "location": "City Center"
      }
    ],
    "restaurants": [
      {
        "name": "Restaurant Name",
        "cuisine": "Local",
        "priceRange": "₹500-1000",
        "specialty": "Famous dish"
      }
    ]
  },
  "packingList": [
    "passport",
    "clothes for ${duration} days",
    "camera",
    "power bank",
    "travel adapter"
  ],
  "localTips": [
    "Best time to visit [location] is early morning",
    "Try local specialty at [restaurant name]",
    "Carry cash for local markets"
  ]
}

Make it practical, detailed, and personalized based on the interests and travel style.`;

  const messages = [
    {
      role: 'system',
      content: 'You are an expert travel planner. Create detailed, practical, and personalized itineraries. Always return valid JSON with the exact structure requested. Include specific locations, realistic costs, and helpful tips.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  try {
    const response = await callAI(messages, 'gpt-4o', 0.7);
    
    if (response) {
      try {
        const cleaned = response
          .replace(/^```json/, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();

        const jsonStart = cleaned.indexOf("{");
        const jsonEnd = cleaned.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1) {
          const json = cleaned.slice(jsonStart, jsonEnd + 1);
          return JSON.parse(json);
        } else {
          throw new Error("No valid JSON found in response");
        }
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        console.log('Raw response:', response);
        return generateMockItinerary(tripData);
      }
    }

    // Fallback to mock data
    console.log('Using mock data as fallback');
    return generateMockItinerary(tripData);
  } catch (error) {
    console.error('AI itinerary generation failed:', error);
    return generateMockItinerary(tripData);
  }
}

/**
 * Generate personalized recommendations based on user preferences
 */
export async function generatePersonalizedRecommendations(userPreferences, destination) {
  const {
    interests,
    budget,
    travelStyle,
    foodPreferences,
    groupSize,
    duration
  } = userPreferences;

  const prompt = `Generate personalized travel recommendations for ${destination} based on these preferences:

- Interests: ${interests.join(', ')}
- Budget: $${budget} USD
- Travel Style: ${travelStyle}
- Food Preferences: ${foodPreferences}
- Group Size: ${groupSize} people
- Duration: ${duration} days

Please provide recommendations in this JSON format:
{
  "hotels": [
    {
      "name": "Hotel name",
      "description": "Why it matches your preferences",
      "priceRange": "$100-200",
      "rating": 4.5,
      "amenities": ["wifi", "breakfast"],
      "matchScore": 95
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant name",
      "cuisine": "Cuisine type",
      "description": "Why it matches your preferences",
      "priceRange": "$$",
      "dietaryOptions": ["vegetarian"],
      "matchScore": 90
    }
  ],
  "activities": [
    {
      "name": "Activity name",
      "description": "Why it matches your preferences",
      "duration": "3 hours",
      "cost": 75,
      "category": "culture",
      "matchScore": 88
    }
  ],
  "localInsights": [
    "Local tip or insight"
  ],
  "budgetOptimization": {
    "suggestions": ["suggestion1", "suggestion2"],
    "potentialSavings": 200
  }
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are a local travel expert who knows the best hidden gems, authentic experiences, and value-for-money options in your destination.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  // Use AI for recommendations (cost-effective)
  const response = await callAI(messages, 'gpt-4o-mini', 0.8);
  
  if (response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI recommendations:', error);
      return null;
    }
  }

  return generateMockRecommendations(userPreferences, destination);
}

/**
 * Natural language trip planning
 */
// export async function processNaturalLanguageRequest(userInput) {
//   const prompt = `The user wants to plan a trip. Extract the key information from their request and provide a structured response.

// User request: "${userInput}"

// Please extract and return in JSON format:
// {
//   "destination": "extracted destination",
//   "duration": "extracted duration in days",
//   "budget": "extracted budget amount",
//   "interests": ["extracted interests"],
//   "travelStyle": "extracted travel style",
//   "groupSize": "extracted group size",
//   "foodPreferences": "extracted food preferences",
//   "transportPreference": "extracted transport preference",
//   "specialRequirements": ["any special requirements"],
//   "confidence": 0.95
// }

// If any information is missing, set it to null.`;

//   const messages = [
//     {
//       role: 'system',
//       content: 'You are an AI assistant that helps extract travel planning information from natural language requests. Be accurate and thorough in your extraction.'
//     },
//     {
//       role: 'user',
//       content: prompt
//     }
//   ];

//   // Use AI for text extraction (cost-effective)
//   const response = await callAI(messages, 'gpt-4o-mini', 0.3);
  
//   if (response) {
//     try {
//       return JSON.parse(response);
//     } catch (error) {
//       console.error('Failed to parse natural language response:', error);
//       return null;
//     }
//   }

//   return null;
// }
export async function processNaturalLanguageRequest(userInput) {
  if (!userInput || userInput.trim().length === 0) {
    console.error("No user input provided to processNaturalLanguageRequest");
    return null;
  }

  const prompt = `Extract the following information from the user's request and return only valid JSON with no explanation or extra text. If a field is missing, set it to null.

Fields to extract:
- destination
- duration (in days)
- budget (in rupees)
- groupSize (number of people)
- startDate (if mentioned)
- foodType (veg, non-veg, both)
- travelMode (car, train, flight, etc.)
- tripPurpose (adventure, relaxation, sightseeing, etc.)
- interests (array of strings if mentioned)
- specialRequirements (array of strings if mentioned)

User request: "${userInput}"`;

  const messages = [
    {
      role: "system",
      content: "You extract structured travel data as clean JSON only. Do not include any explanation.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const response = await callAI(messages, "gpt-4o", 0.3);

  if (response) {
    try {
      const cleaned = response
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");

      const json = cleaned.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(json);
    } catch (error) {
      console.error("❌ Failed to parse natural language response:", error);
      console.error("⚠️ Raw response was:", response);
      return null;
    }
  }

  return null;
}


/**
 * Generate route optimization suggestions
 */
export async function optimizeRoute(locations, preferences) {
  const prompt = `Optimize the travel route for these locations: ${locations.join(', ')}.

Preferences:
- Transport: ${preferences.transport}
- Budget: $${preferences.budget}
- Time constraints: ${preferences.timeConstraints}
- Accessibility: ${preferences.accessibility}

Provide an optimized route in JSON format:
{
  "optimizedRoute": [
    {
      "location": "Location name",
      "order": 1,
      "transportToNext": "transport method",
      "duration": "travel time",
      "cost": 50,
      "tips": "travel tips"
    }
  ],
  "totalCost": 200,
  "totalDuration": "8 hours",
  "optimizationNotes": "Why this route is optimal"
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are a route optimization expert who considers time, cost, and user preferences to create the most efficient travel routes.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  // Use AI for route optimization
  const response = await callAI(messages, 'gpt-4o-mini', 0.5);
  
  if (response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse route optimization:', error);
      return null;
    }
  }

  return null;
}

/**
 * Generate mood-based recommendations
 */
export async function generateMoodBasedRecommendations(mood, location, timePeriod) {
  const prompt = `Generate activity recommendations for someone in a ${mood} mood in ${location} during ${timePeriod}.

Please provide recommendations in JSON format:
{
  "activities": [
    {
      "name": "Activity name",
      "description": "Why this activity matches the mood",
      "duration": "2 hours",
      "cost": 30,
      "moodMatch": 95,
      "location": "Specific location",
      "tips": "Tips for this activity"
    }
  ],
  "moodEnhancement": "How these activities can improve the mood",
  "alternativeOptions": [
    "Alternative activity if the first doesn't work"
  ]
}`;

  const messages = [
    {
      role: 'system',
      content: 'You are a mood-aware travel guide who understands how different activities can affect and enhance a person\'s emotional state.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  // Use AI for mood-based recommendations
  const response = await callAI(messages, 'gpt-4o-mini', 0.8);
  
  if (response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse mood-based recommendations:', error);
      return null;
    }
  }

  return null;
}

/**
 * Generate mock itinerary as fallback
 */
function generateMockItinerary(tripData) {
  const { destination, duration, budget, groupSize } = tripData;
  
  const itinerary = [];
  const startDate = new Date();
  
  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    itinerary.push({
      day: `Day ${i + 1}`,
      date: currentDate.toISOString().split('T')[0],
      activities: [
        {
          time: '09:00',
          activity: `Morning exploration of ${destination}`,
          location: 'City Center',
          cost: 500,
          duration: '2 hours'
        },
        {
          time: '12:00',
          activity: 'Lunch at local restaurant',
          location: 'Local Market Area',
          cost: 300,
          duration: '1 hour'
        },
        {
          time: '14:00',
          activity: `Afternoon sightseeing`,
          location: 'Historical Sites',
          cost: 400,
          duration: '3 hours'
        },
        {
          time: '18:00',
          activity: 'Evening relaxation',
          location: 'Hotel',
          cost: 200,
          duration: '2 hours'
        }
      ]
    });
  }

  return {
    itinerary,
    budgetBreakdown: {
      accommodation: Math.floor(budget * 0.4),
      food: Math.floor(budget * 0.3),
      activities: Math.floor(budget * 0.2),
      transportation: Math.floor(budget * 0.1)
    },
    recommendations: {
      hotels: [
        {
          name: 'Comfort Inn',
          priceRange: '₹2000-3000/night',
          rating: 4.2,
          location: 'City Center'
        }
      ],
      restaurants: [
        {
          name: 'Local Delights',
          cuisine: 'Local',
          priceRange: '₹500-800',
          specialty: 'Traditional dishes'
        }
      ]
    },
    packingList: [
      'passport',
      `clothes for ${duration} days`,
      'camera',
      'power bank',
      'travel adapter',
      'first aid kit'
    ],
    localTips: [
      `Best time to visit ${destination} is early morning`,
      'Try local specialty dishes',
      'Carry cash for local markets',
      'Learn basic local phrases'
    ]
  };
}

function generateMockRecommendations(preferences, destination) {
  return {
    hotels: [
      {
        name: "Sample Hotel",
        description: "A great hotel matching your preferences for comfort and location",
        priceRange: "$100-200",
        rating: 4.5,
        amenities: ["wifi", "breakfast", "gym"],
        matchScore: 90
      }
    ],
    restaurants: [
      {
        name: "Local Favorite Restaurant",
        cuisine: "Local cuisine",
        description: "Authentic local dining experience highly rated by locals",
        priceRange: "$$",
        dietaryOptions: ["vegetarian", "gluten-free"],
        matchScore: 85
      }
    ],
    activities: [
      {
        name: "Cultural Walking Tour",
        description: "Explore local culture and history with expert guides",
        duration: "3 hours",
        cost: 75,
        category: "culture",
        matchScore: 88
      }
    ],
    localInsights: [
      "Visit early morning for fewer crowds and better photos",
      "Local markets are best on weekends",
      "Use public transport for authentic local experience"
    ],
    budgetOptimization: {
      suggestions: [
        "Use public transport instead of taxis",
        "Eat at local markets for authentic and affordable meals",
        "Look for free walking tours",
        "Visit museums on free admission days"
      ],
      potentialSavings: 150
    }
  };
}

export default {
  generateSmartItinerary,
  generatePersonalizedRecommendations,
  processNaturalLanguageRequest,
  optimizeRoute,
  generateMoodBasedRecommendations
};