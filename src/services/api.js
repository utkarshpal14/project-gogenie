/**
 * API Service for GoGinie
 * Handles all API calls with proper error handling
 */

// API Configuration
export const API_CONFIG = {
  amadeus: {
    baseUrl: 'https://test.api.amadeus.com',
    apiKey: import.meta.env.VITE_AMADEUS_API_KEY,
    apiSecret: import.meta.env.VITE_AMADEUS_API_SECRET,
  },
  railway: {
    baseUrl: 'https://indian-railway-api.herokuapp.com',
    apiKey: import.meta.env.VITE_RAILWAY_API_KEY,
  },
  zomato: {
    baseUrl: 'https://developers.zomato.com/api/v2.1',
    apiKey: import.meta.env.VITE_ZOMATO_API_KEY,
  },
  openweather: {
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
  }
};

/**
 * Generic API call function
 */
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * Get Amadeus access token
 */
export const getAmadeusToken = async () => {
  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_CONFIG.amadeus.apiKey,
        client_secret: API_CONFIG.amadeus.apiSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get Amadeus token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Amadeus token error:', error);
    return null;
  }
};

/**
 * Get coordinates for a location
 */
export const getCoordinates = async (location) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_CONFIG.openweather.apiKey}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
          name: data[0].name
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Coordinates error:', error);
    return null;
  }
};

/**
 * Get distance matrix for cab booking
 */
export const getDistanceMatrix = async (from, to) => {
  try {
    // For now, return mock data since we don't have Google Maps API
    const mockDistance = Math.floor(Math.random() * 50) + 10; // 10-60 km
    const mockDuration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
    
    return {
      success: true,
      data: {
        distance: `${mockDistance} km`,
        distanceValue: mockDistance * 1000, // in meters
        duration: `${mockDuration} min`,
        durationValue: mockDuration * 60 // in seconds
      }
    };
  } catch (error) {
    console.error('Distance matrix error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate confirmation code
 */
export const generateConfirmationCode = (type) => {
  const prefix = type.toUpperCase().substring(0, 3);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}; 

// Add this debugging function
export const debugAPIKeys = () => {
  console.log('🔑 API Keys Debug:');
  console.log('Amadeus API Key:', import.meta.env.VITE_AMADEUS_API_KEY ? 'Set' : 'Missing');
  console.log('Amadeus API Secret:', import.meta.env.VITE_AMADEUS_API_SECRET ? 'Set' : 'Missing');
  console.log('Railway API Key:', import.meta.env.VITE_RAILWAY_API_KEY ? 'Set' : 'Missing');
  console.log('Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'Set' : 'Missing');
};

/**
 * Test Amadeus API
 */
export const testAmadeusAPI = async () => {
  try {
    const token = await getAmadeusToken();
    if (token) {
      console.log('Amadeus API Token obtained successfully!');
      console.log('Token:', token);
      // You can now use the token to make Amadeus API calls
      // Example: const flightData = await getFlightData(token);
    } else {
      console.error('Failed to obtain Amadeus token.');
    }
  } catch (error) {
    console.error('Error testing Amadeus API:', error);
  }
}; 