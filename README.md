# 🌍 GoGinie - AI-Powered Travel Planning Platform

<div align="center">

![GoGinie Logo](https://img.shields.io/badge/GoGinie-AI%20Travel%20Companion-blue?style=for-the-badge&logo=airplane)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-4285F4?style=for-the-badge&logo=google)

**Your all-in-one AI travel companion that plans and manages your entire trip — so you can focus on enjoying it.**

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 🎯 What is GoGinie?

GoGinie is a revolutionary full-stack web application enhanced with **Google Gemini AI** that offers intelligent trip planning and personalized recommendations. It's designed to eliminate the hassle of travel planning by automating every aspect of your journey with cutting-edge AI technology.

### ✨ Key Features

- 🤖 **AI-Powered Planning**: Google Gemini AI creates intelligent itineraries based on your preferences
- 🎯 **Personalized Recommendations**: AI-generated suggestions for hotels, restaurants, and activities
- 🗺️ **Interactive Maps**: Visual trip planning with route optimization using Leaflet & Mapbox
- 💰 **Smart Budget Management**: AI-powered budget allocation and tracking
- 📱 **Mobile-First Design**: Responsive interface for all devices
- 🌙 **Mood-Based Suggestions**: Get recommendations based on your current mood
- 🧠 **Natural Language Processing**: Describe your trip in plain English
- ⚡ **Real-Time AI Responses**: Instant itinerary generation with Google Gemini

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/goginie.git
   cd goginie
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create `.env.local` with your API keys:
   ```env
   # Google Gemini AI (Required for AI features)
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Google Maps (Optional for enhanced mapping)
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Other APIs (Future features)
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_AMADEUS_API_KEY=your_amadeus_api_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## ⚡ Quick Start

Once your app is running, you can:

1. **Plan a Trip** - Go to "Plan Trip" and fill out the form
2. **Use AI Planning** - Try the "AI Trip Planner" for natural language input
3. **Mood-Based Planning** - Visit "Mood-Based Trip" for mood-driven recommendations
4. **View Results** - See your generated itinerary with maps and recommendations

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### AI & External APIs
- **Google Gemini AI** - AI-powered itinerary generation and recommendations
- **Leaflet & Mapbox** - Interactive maps and route visualization
- **OpenStreetMap Nominatim** - Geocoding and location search
- **Unsplash API** - High-quality travel images

### Backend (Planned)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Prisma** - Database ORM
- **JWT** - Authentication
- **Stripe** - Payment processing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **Cypress** - E2E testing

---

## 🎨 Features Overview

### 🧠 AI-Powered Trip Planning

GoGinie uses advanced AI algorithms to create personalized travel plans:

- **Smart Itinerary Generation**: AI creates optimal day-by-day schedules
- **Preference Learning**: Learns from your choices to improve recommendations
- **Route Optimization**: Finds the most efficient travel routes
- **Budget Optimization**: Suggests the best value options within your budget

### 🏨 Accommodation Booking

- **Smart Hotel Matching**: AI finds hotels matching your preferences
- **Real-Time Availability**: Live booking with instant confirmation
- **Verified Reviews**: Authentic user reviews and ratings
- **Price Comparison**: Compare prices across multiple platforms
- **Special Requests**: Handle dietary and accessibility requirements

### 🍽️ Restaurant Recommendations

- **Cuisine Preferences**: Filter by food type (veg/non-veg)
- **Local Favorites**: Discover hidden gems recommended by locals
- **Dietary Restrictions**: Accommodate special dietary needs
- **Reservation System**: Book tables in advance
- **Menu Previews**: View menus and prices before booking

### 🚗 Transportation

- **Multi-Modal Routing**: Combine flights, trains, buses, and local transport
- **Via Route Optimization**: Find optimal routes when direct options aren't available
- **Real-Time Updates**: Live tracking and delay notifications
- **Cost Comparison**: Compare different transportation options
- **Local Transport**: Metro, bus, taxi, and bike rental options

### 🎯 Activity Planning

- **Purpose-Based Suggestions**: Activities matching your trip purpose (culture, wildlife, nightlife, etc.)
- **Local Experiences**: Authentic local activities and tours
- **Skip-the-Line Tickets**: Pre-book popular attractions
- **Guided Tours**: Professional tour guides and experiences
- **Seasonal Recommendations**: Activities best suited for your travel dates

### 💰 Budget Management

- **Smart Budget Allocation**: AI distributes budget across categories
- **Real-Time Tracking**: Monitor spending during your trip
- **Expense Categories**: Accommodation, food, activities, transportation
- **Currency Conversion**: Automatic currency conversion
- **Budget Alerts**: Notifications when approaching budget limits

### 🌙 Mood-Based Recommendations

- **Current Mood Analysis**: Get suggestions based on how you're feeling
- **Activity Matching**: Find activities that match your mood
- **Time-Based Suggestions**: Recommendations for different times of day
- **Personalized Experience**: Tailored suggestions for your preferences

---

## 📱 User Interface

### Modern Design
- **Clean & Intuitive**: User-friendly interface designed for all skill levels
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Accessibility**: WCAG compliant for inclusive design

### Interactive Elements
- **Drag & Drop**: Reorder activities and destinations easily
- **Real-Time Updates**: Live changes without page refresh
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Progress Tracking**: Visual progress indicators for multi-step processes

---

## 🔧 API Integration

### ✅ Currently Integrated APIs
- **Google Gemini AI** - AI-powered itinerary generation and recommendations
- **OpenStreetMap Nominatim** - Geocoding and location search
- **Leaflet & Mapbox** - Interactive maps and route visualization
- **Unsplash** - High-quality travel images
- **Mock Authentication** - User management (development)

### 🚧 Planned APIs (Phase 3)
- **Google Maps Platform** - Enhanced mapping and places data
- **Amadeus Travel APIs** - Flight and hotel booking
- **Stripe** - Payment processing
- **OpenWeather** - Weather forecasts
- **TripAdvisor** - Reviews and ratings
- **Booking.com** - Hotel availability
- **Skyscanner** - Flight search
- **Railway APIs** - Train booking (IRCTC, etc.)

### 🤖 AI Features Status
- ✅ **Smart Itinerary Generation** - Working with Google Gemini
- ✅ **Natural Language Processing** - Trip planning from text descriptions
- ✅ **Mood-Based Recommendations** - AI suggestions based on user mood
- ✅ **Personalized Recommendations** - AI-generated hotel, restaurant, and activity suggestions
- ✅ **Route Optimization** - AI-powered travel route planning

---

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set up your production environment variables
2. Configure your database connections
3. Set up your API keys and secrets
4. Configure your domain and SSL certificates

### Deployment Options
- **Vercel** - Recommended for frontend
- **Netlify** - Alternative frontend hosting
- **Railway** - Full-stack deployment
- **AWS** - Scalable cloud infrastructure
- **Docker** - Containerized deployment

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Areas for Contribution
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Internationalization

---

## 🛠️ Troubleshooting

### AI Features Not Working

If the AI itinerary generation isn't working:

1. **Check your API key**:
   ```bash
   # Verify your .env.local file has the Gemini API key
   cat .env.local | grep VITE_GEMINI_API_KEY
   ```

2. **Test the API directly**:
   ```bash
   node test-gemini.js
   ```

3. **Check browser console** for error messages

4. **Verify rate limits** - Gemini has 15 requests per minute limit

### Common Issues

- **"API key not found"** - Make sure `.env.local` exists and has the correct API key
- **"Rate limit exceeded"** - Wait a minute and try again
- **"Network error"** - Check your internet connection
- **Mock data showing** - This means AI API failed, check console for errors

### Getting Help

- Check the [Issues](https://github.com/yourusername/goginie/issues) page
- Look at the browser console for error messages
- Test with the provided test scripts

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Current Status

### ✅ **Phase 1: Core Features (100% Complete)**
- [x] User authentication and profiles
- [x] Basic trip planning interface
- [x] Interactive maps integration (Leaflet + Mapbox)
- [x] Mood-based recommendations
- [x] Responsive design
- [x] Modern UI with shadcn/ui components

### ✅ **Phase 2: AI Integration (100% Complete)**
- [x] Google Gemini AI integration
- [x] Smart itinerary generation
- [x] Personalized recommendations
- [x] Natural language trip planning
- [x] Route optimization
- [x] Mood-based AI suggestions

### 🚧 **Phase 3: Booking System (0% Complete)**
- [ ] Flight booking integration
- [ ] Hotel reservation system
- [ ] Restaurant booking
- [ ] Activity ticket booking
- [ ] Payment processing (Stripe)

### 🔮 **Phase 4: Advanced Features (0% Complete)**
- [ ] Real-time collaboration
- [ ] Trip sharing and social features
- [ ] Advanced analytics
- [ ] Mobile app development
- [ ] Offline support

### 🏢 **Phase 5: Enterprise Features (0% Complete)**
- [ ] Business travel management
- [ ] Corporate booking tools
- [ ] Expense tracking
- [ ] Team collaboration
- [ ] API for third-party integrations

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful AI capabilities
- **Google Maps** for mapping services
- **Leaflet & Mapbox** for interactive mapping
- **Unsplash** for beautiful travel images
- **Shadcn/ui** for the component library
- **Vite** for the build tool
- **Tailwind CSS** for the styling framework

---

## 📞 Support

- 📧 **Email**: support@goginie.com
- 💬 **Discord**: [Join our community](https://discord.gg/goginie)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/goginie/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/goginie/wiki)

---

<div align="center">

**Made with ❤️ by the GoGinie Team**

[Website](https://goginie.com) • [Twitter](https://twitter.com/goginie) • [LinkedIn](https://linkedin.com/company/goginie)

</div>