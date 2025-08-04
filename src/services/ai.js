/**
 * AI Service Layer for GoGinie
 * Handles all OpenAI API interactions for intelligent travel planning
 */

const POE_API_KEY = import.meta.env.VITE_POE_API_KEY;
const POE_BASE_URL = 'https://api.poe.com/v1';
const API_URL = `${POE_BASE_URL}/chat/completions`;

/**
 * Base OpenAI API call function
 */
async function callOpenAI(messages, model = 'GPT-4o', temperature = 0.7) {
  if (!POE_API_KEY) {
    console.warn('Poe API key not found. Using mock responses.');
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${POE_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Poe API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
  } catch (error) {
    console.error('Poe API call failed:', error);
    return null;
  }
}

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

  const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination} starting from ${startLocation}.

Travel Details:
- Duration: ${duration} days
- Budget: $${budget} USD
- Group Size: ${groupSize} people
- Interests: ${interests.join(', ')}
- Travel Style: ${travelStyle}
- Food Preferences: ${foodPreferences}
- Transport Preference: ${transportPreference}

Please provide a JSON response with the following structure:
{
  "itinerary": [
    {
      "day": "Day 1",
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00",
          "activity": "Activity name",
          "description": "Brief description",
          "location": "Specific location",
          "duration": "2 hours",
          "cost": 50,
          "category": "sightseeing|food|transport|accommodation|activity",
          "tips": "Local tips and recommendations"
        }
      ],
      "totalCost": 150,
      "transportation": "How to get around today",
      "weather": "Expected weather"
    }
  ],
  "budgetBreakdown": {
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transportation": 0
  },
  "recommendations": {
    "hotels": [
      {
        "name": "Hotel name",
        "description": "Why this hotel is recommended",
        "priceRange": "$100-200",
        "rating": 4.5,
        "amenities": ["wifi", "breakfast", "gym"]
      }
    ],
    "restaurants": [
      {
        "name": "Restaurant name",
        "cuisine": "Cuisine type",
        "description": "Why this restaurant is recommended",
        "priceRange": "$$",
        "dietaryOptions": ["vegetarian", "vegan"]
      }
    ],
    "activities": [
      {
        "name": "Activity name",
        "description": "Why this activity is recommended",
        "duration": "3 hours",
        "cost": 75,
        "category": "culture|adventure|relaxation"
      }
    ]
  },
  "packingList": ["item1", "item2"],
  "localTips": ["tip1", "tip2"],
  "emergencyContacts": {
    "police": "number",
    "hospital": "number",
    "embassy": "number"
  }
}

Make sure the itinerary is realistic, well-paced, and fits within the budget. Include local insights and hidden gems.`;

  const messages = [
    {
      role: 'system',
      content: 'You are an expert travel planner with deep knowledge of destinations worldwide. Create personalized, practical, and enjoyable travel itineraries that consider budget, interests, and local culture.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  const response = await callOpenAI(messages, 'GPT-4o', 0.7);
  
  if (response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return null;
    }
  }

  // Fallback to mock data if AI is not available
  return generateMockItinerary(tripData);
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

  const response = await callOpenAI(messages, 'GPT-4o', 0.8);
  
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
export async function processNaturalLanguageRequest(userInput) {
  const prompt = `The user wants to plan a trip. Extract the key information from their request and provide a structured response.

User request: "${userInput}"

Please extract and return in JSON format:
{
  "destination": "extracted destination",
  "duration": "extracted duration in days",
  "budget": "extracted budget amount",
  "interests": ["extracted interests"],
  "travelStyle": "extracted travel style",
  "groupSize": "extracted group size",
  "foodPreferences": "extracted food preferences",
  "transportPreference": "extracted transport preference",
  "specialRequirements": ["any special requirements"],
  "confidence": 0.95
}

If any information is missing, set it to null.`;

  const messages = [
    {
      role: 'system',
      content: 'You are an AI assistant that helps extract travel planning information from natural language requests. Be accurate and thorough in your extraction.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  const response = await callOpenAI(messages, 'GPT-4o', 0.3);
  
  if (response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse natural language response:', error);
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

  const response = await callOpenAI(messages, 'GPT-4o', 0.5);
  
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

  const response = await callOpenAI(messages, 'GPT-4o', 0.8);
  
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

// Mock data generators for fallback
function generateMockItinerary(tripData) {
  // Return the existing mock data structure
  return {
    itinerary: [
      {
        day: "Day 1",
        activities: [
          { time: "9:00 AM", activity: "Arrive at destination" },
          { time: "11:00 AM", activity: "Check-in at hotel" },
          { time: "1:00 PM", activity: "Local lunch" },
          { time: "3:00 PM", activity: "Explore main attractions" },
          { time: "7:00 PM", activity: "Dinner at local restaurant" }
        ]
      }
    ],
    budgetBreakdown: {
      accommodation: 200,
      food: 100,
      activities: 50,
      transportation: 30
    },
    recommendations: {
      hotels: [],
      restaurants: [],
      activities: []
    },
    packingList: ["Passport", "Comfortable shoes", "Camera"],
    localTips: ["Best time to visit attractions", "Local customs to know"],
    emergencyContacts: {
      police: "911",
      hospital: "911",
      embassy: "Contact local embassy"
    }
  };
}

function generateMockRecommendations(preferences, destination) {
  return {
    hotels: [
      {
        name: "Sample Hotel",
        description: "A great hotel matching your preferences",
        priceRange: "$100-200",
        rating: 4.5,
        amenities: ["wifi", "breakfast"],
        matchScore: 90
      }
    ],
    restaurants: [
      {
        name: "Local Restaurant",
        cuisine: "Local cuisine",
        description: "Authentic local dining experience",
        priceRange: "$$",
        dietaryOptions: ["vegetarian"],
        matchScore: 85
      }
    ],
    activities: [
      {
        name: "Cultural Tour",
        description: "Explore local culture and history",
        duration: "3 hours",
        cost: 75,
        category: "culture",
        matchScore: 88
      }
    ],
    localInsights: ["Visit early morning for fewer crowds"],
    budgetOptimization: {
      suggestions: ["Use public transport", "Eat at local markets"],
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