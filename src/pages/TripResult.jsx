import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Map } from "@/components";
import { 
  CalendarCheck, 
  Hotel, 
  Utensils, 
  Map as MapIcon, 
  Car, 
  Cloud, 
  CloudSun, 
  Sun, 
  Download,
  Bookmark,
  Share,
  Edit
} from "lucide-react";

// Weather icon component
const WeatherIcon = ({ condition }) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case "partly-cloudy":
      return <CloudSun className="h-4 w-4 text-blue-400" />;
    case "cloudy":
      return <Cloud className="h-4 w-4 text-gray-500" />;
    default:
      return <Sun className="h-4 w-4 text-yellow-500" />;
  }
};

// Exchange rate: 1 USD = 83.5 INR (as of May 1, 2025)
const USD_TO_INR_RATE = 83.5;

// Function to convert USD to INR
const convertToINR = (usdAmount) => {
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

// Helper function to format currency
const formatCurrency = (amount, currency = "INR") => {
  if (currency === "INR") {
    return `₹${amount.toLocaleString()}`;
  }
  return `$${amount.toLocaleString()}`;
};

export default function TripResult() {
  const location = useLocation();
  const [activeItineraryDay, setActiveItineraryDay] = useState("Day 1");
  const { toast } = useToast();
  const [tripData, setTripData] = useState(null);
  
  // Get trip data from location state or use default data
  useEffect(() => {
    const getDefaultData = () => {
      // Check localStorage for saved trip data
      const savedTripData = localStorage.getItem('plannedTrip');
      if (savedTripData) {
        try {
          const parsed = JSON.parse(savedTripData);
          return parsed;
        } catch (e) {
          console.error("Error parsing saved trip data:", e);
        }
      }
      
      // Default to Paris trip as fallback
      return {
        destination: "Paris, France",
        startLocation: "London, UK",
        dateRange: "May 12-18, 2025",
        duration: 7,
        budget: {
          total: 2000,
          used: 1750,
          breakdown: {
            accommodation: 700,
            food: 400,
            activities: 350,
            transportation: 300
          }
        },
        weather: [
          { day: "Day 1", condition: "sunny", temp: "72°F" },
          { day: "Day 2", condition: "partly-cloudy", temp: "68°F" },
          { day: "Day 3", condition: "partly-cloudy", temp: "70°F" },
          { day: "Day 4", condition: "sunny", temp: "75°F" },
          { day: "Day 5", condition: "sunny", temp: "77°F" },
          { day: "Day 6", condition: "cloudy", temp: "65°F" },
          { day: "Day 7", condition: "partly-cloudy", temp: "68°F" }
        ],
        itinerary: [
          {
            day: "Day 1",
            activities: [
              { time: "9:00 AM", activity: "Arrive at Charles de Gaulle Airport" },
              { time: "11:00 AM", activity: "Check-in at Hotel du Louvre" },
              { time: "1:00 PM", activity: "Lunch at Café de Flore" },
              { time: "3:00 PM", activity: "Visit the Eiffel Tower" },
              { time: "7:00 PM", activity: "Dinner at Le Jules Verne" }
            ]
          },
          {
            day: "Day 2",
            activities: [
              { time: "9:00 AM", activity: "Breakfast at hotel" },
              { time: "10:00 AM", activity: "Visit the Louvre Museum" },
              { time: "1:00 PM", activity: "Lunch at Angelina" },
              { time: "3:00 PM", activity: "Walk through Tuileries Garden" },
              { time: "5:00 PM", activity: "Visit Champs-Élysées" },
              { time: "8:00 PM", activity: "Dinner at L'Atelier de Joël Robuchon" }
            ]
          },
          {
            day: "Day 3",
            activities: [
              { time: "9:00 AM", activity: "Breakfast at hotel" },
              { time: "10:00 AM", activity: "Visit Notre-Dame Cathedral" },
              { time: "12:30 PM", activity: "Lunch at Le Petit Châtelet" },
              { time: "2:00 PM", activity: "Explore Latin Quarter" },
              { time: "4:00 PM", activity: "Visit Shakespeare and Company bookstore" },
              { time: "7:00 PM", activity: "Seine River dinner cruise" }
            ]
          },
          {
            day: "Day 4",
            activities: [
              { time: "9:00 AM", activity: "Breakfast at hotel" },
              { time: "10:00 AM", activity: "Visit Montmartre and Sacré-Cœur" },
              { time: "1:00 PM", activity: "Lunch at La Maison Rose" },
              { time: "3:00 PM", activity: "Visit Moulin Rouge" },
              { time: "6:00 PM", activity: "Dinner at Le Consulat" }
            ]
          },
          {
            day: "Day 5",
            activities: [
              { time: "9:00 AM", activity: "Breakfast at hotel" },
              { time: "10:00 AM", activity: "Day trip to Palace of Versailles" },
              { time: "1:00 PM", activity: "Lunch at La Flottille" },
              { time: "3:00 PM", activity: "Explore Versailles Gardens" },
              { time: "7:00 PM", activity: "Return to Paris for dinner" }
            ]
          },
          {
            day: "Day 6",
            activities: [
              { time: "9:00 AM", activity: "Breakfast at hotel" },
              { time: "10:00 AM", activity: "Visit Centre Pompidou" },
              { time: "1:00 PM", activity: "Lunch at L'Avant Comptoir" },
              { time: "3:00 PM", activity: "Shopping at Le Marais district" },
              { time: "7:00 PM", activity: "Dinner at Breizh Café" }
            ]
          },
          {
            day: "Day 7",
            activities: [
              { time: "9:00 AM", activity: "Breakfast at hotel" },
              { time: "10:00 AM", activity: "Visit the Catacombs" },
              { time: "1:00 PM", activity: "Farewell lunch at Le Comptoir" },
              { time: "3:00 PM", activity: "Last-minute souvenir shopping" },
              { time: "6:00 PM", activity: "Depart for Charles de Gaulle Airport" }
            ]
          }
        ],
        hotels: [
          {
            name: "Hotel du Louvre",
            address: "Place André Malraux, 75001 Paris, France",
            rating: 4.5,
            price: "$200/night",
            amenities: ["Free WiFi", "Restaurant", "Bar", "Fitness center"],
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
          },
          {
            name: "Hôtel Plaza Athénée",
            address: "25 Avenue Montaigne, 75008 Paris, France",
            rating: 5,
            price: "$650/night",
            amenities: ["Free WiFi", "Spa", "Restaurant", "Bar", "Fitness center"],
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop"
          },
          {
            name: "Hôtel Le Meurice",
            address: "228 Rue de Rivoli, 75001 Paris, France",
            rating: 4.8,
            price: "$450/night",
            amenities: ["Free WiFi", "Spa", "Restaurant", "Bar"],
            image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop"
          }
        ],
        restaurants: [
          {
            name: "Le Jules Verne",
            cuisine: "French",
            rating: 4.4,
            priceRange: "$$$",
            address: "Eiffel Tower, 2nd Floor, Avenue Gustave Eiffel, 75007 Paris",
            image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2071&auto=format&fit=crop"
          },
          {
            name: "Café de Flore",
            cuisine: "French",
            rating: 4.2,
            priceRange: "$$",
            address: "172 Boulevard Saint-Germain, 75006 Paris",
            image: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=2070&auto=format&fit=crop"
          },
          {
            name: "L'Atelier de Joël Robuchon",
            cuisine: "French",
            rating: 4.7,
            priceRange: "$$$$",
            address: "5 Rue Montalembert, 75007 Paris",
            image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=2074&auto=format&fit=crop"
          },
          {
            name: "Angelina",
            cuisine: "French, Cafe",
            rating: 4.5,
            priceRange: "$$",
            address: "226 Rue de Rivoli, 75001 Paris",
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
          }
        ],
        transportation: {
          fromAirport: {
            options: ["Taxi", "Metro", "Bus"],
            recommended: "Taxi",
            cost: "€50-60"
          },
          localTransportation: {
            options: ["Metro", "Bus", "Bike rental", "Walking"],
            recommended: "Metro + Walking",
            metroPass: "Paris Visite pass (5 days): €38.35"
          }
        },
        packingList: [
          "Passport and travel documents",
          "Euros (cash)",
          "Light jacket (evenings can be cool)",
          "Comfortable walking shoes",
          "Universal power adapter",
          "Camera",
          "Sunglasses",
          "Umbrella (just in case)",
          "French phrasebook or translation app"
        ]
      };
    };
    
    // Use location state data if available, otherwise use default/saved data
    const data = location.state?.tripData || getDefaultData();
    
    // Process data and convert currencies
    const processedData = {
      ...data,
      budget: {
        ...data.budget,
        total: data.budget.total,
        used: data.budget.used,
        breakdown: {
          ...data.budget.breakdown
        }
      }
    };
    
    // Update hotels pricing to INR
    if (processedData.hotels) {
      processedData.hotels = processedData.hotels.map(hotel => {
        const priceText = hotel.price;
        if (priceText.includes("$")) {
          const priceValue = parseInt(priceText.replace(/[^\d]/g, ''));
          const inrPrice = convertToINR(priceValue);
          return {
            ...hotel,
            price: `₹${inrPrice.toLocaleString()}/night`
          };
        }
        return hotel;
      });
    }
    
    // Update restaurant pricing to INR (priceRange)
    if (processedData.restaurants) {
      processedData.restaurants = processedData.restaurants.map(restaurant => ({
        ...restaurant,
        priceRange: restaurant.priceRange.replace(/\$/g, "₹")
      }));
    }
    
    setTripData(processedData);
  }, [location]);
  
  const handleSaveTrip = () => {
    // Save trip data to localStorage
    if (tripData) {
      localStorage.setItem('savedTrip', JSON.stringify(tripData));
    }
    
    toast({
      title: "Trip saved!",
      description: "Your trip has been saved to your account.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share link copied!",
      description: "Share link has been copied to clipboard.",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Downloading trip details",
      description: "Your trip details will be downloaded as a PDF.",
    });
  };
  
  // Handle loading state
  if (!tripData) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg">Loading your trip details...</p>
          <div className="w-16 h-16 border-4 border-t-goginie-primary border-gray-200 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  const budgetRemainingPercentage = Math.round(((tripData.budget.total - tripData.budget.used) / tripData.budget.total) * 100);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{tripData.destination}</h1>
          <p className="text-muted-foreground">{tripData.dateRange} • {tripData.duration} days</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleSaveTrip} className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Save Trip
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Link to="/plan-trip">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Plan
            </Button>
          </Link>
          <Button onClick={handleDownload} className="bg-goginie-primary hover:bg-goginie-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-goginie-primary" />
                <CardTitle>Itinerary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-nowrap overflow-x-auto gap-2 pb-4">
                {tripData.itinerary?.map((day) => (
                  <Button
                    key={day.day}
                    variant={activeItineraryDay === day.day ? "default" : "outline"}
                    className={`rounded-full ${activeItineraryDay === day.day ? 'bg-goginie-primary hover:bg-goginie-secondary' : ''}`}
                    onClick={() => setActiveItineraryDay(day.day)}
                  >
                    {day.day}
                  </Button>
                )) || <p>No itinerary available</p>}
              </div>
              
              <div className="mt-4">
                {tripData.itinerary
                  ?.filter((day) => day.day === activeItineraryDay)
                  .map((day, idx) => (
                    <div key={idx} className="space-y-4">
                      {day.activities.map((activity, actIdx) => (
                        <div key={actIdx} className="flex">
                          <div className="mr-4 w-20 text-sm font-semibold text-goginie-dark">
                            {activity.time}
                          </div>
                          <div>
                            <div className="h-full w-px bg-border mr-4 relative">
                              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-goginie-primary"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p>{activity.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )) || <p>No activities available for this day.</p>}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="hotels">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hotels" className="flex items-center gap-2">
                <Hotel className="h-4 w-4" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="transportation" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Transportation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="hotels" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripData.hotels?.map((hotel, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${hotel.image})` }}
                    ></div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground">{hotel.address}</p>
                      <div className="flex items-center mt-2 mb-1">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm">{hotel.rating}/5</span>
                      </div>
                      <p className="text-sm font-semibold">{hotel.price}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hotel.amenities.map((amenity, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )) || <p>No hotels available.</p>}
              </div>
            </TabsContent>
            
            <TabsContent value="restaurants" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripData.restaurants?.map((restaurant, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${restaurant.image})` }}
                    ></div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(restaurant.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm">{restaurant.rating}/5</span>
                        </div>
                        <span className="text-sm font-semibold">{restaurant.priceRange}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm bg-muted px-2 py-1 rounded-full">
                          {restaurant.cuisine}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )) || <p>No restaurants available.</p>}
              </div>
            </TabsContent>
            
            <TabsContent value="transportation" className="pt-4">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {tripData.transportation ? (
                    <>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Airport Transfer</h3>
                        <p><span className="font-medium">Recommended:</span> {tripData.transportation.fromAirport.recommended}</p>
                        <p><span className="font-medium">Estimated Cost:</span> {
                          tripData.transportation.fromAirport.cost.includes("€") 
                            ? tripData.transportation.fromAirport.cost 
                            : tripData.transportation.fromAirport.cost.includes("$")
                              ? `₹${convertToINR(parseInt(tripData.transportation.fromAirport.cost.replace(/[^\d]/g, '')))}`
                              : tripData.transportation.fromAirport.cost
                        }</p>
                        <p className="mt-2 text-sm">Other options: {tripData.transportation.fromAirport.options.join(", ")}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Local Transportation</h3>
                        <p><span className="font-medium">Recommended:</span> {tripData.transportation.localTransportation.recommended}</p>
                        <p><span className="font-medium">Transit Pass:</span> {
                          tripData.transportation.localTransportation.metroPass && 
                          (tripData.transportation.localTransportation.metroPass.includes("$") 
                            ? `₹${convertToINR(parseInt(tripData.transportation.localTransportation.metroPass.replace(/[^\\d]/g, '')))}`
                            : tripData.transportation.localTransportation.metroPass)
                        }</p>
                        <p className="mt-2 text-sm">All options: {tripData.transportation.localTransportation.options.join(", ")}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Transportation Tips</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Use ride-sharing apps for convenience.</li>
                          <li>Look for day passes on public transportation to save money.</li>
                          <li>Many attractions may be within walking distance.</li>
                          <li>Consider renting bicycles if available.</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p>No transportation data available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Map */}
          <Card>
            <CardContent className="p-0">
              {tripData.startLocation ? (
                <Map 
                  startLocation={tripData.startLocation} 
                  destination={tripData.destination} 
                  className="w-full" 
                />
              ) : (
                <div className="bg-muted w-full h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-sm text-muted-foreground">Map data unavailable</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Budget card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Budget Remaining</span>
                  <span className="font-medium">{formatCurrency(convertToINR(tripData.budget.total - tripData.budget.used))}</span>
                </div>
                <Progress value={budgetRemainingPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Used: {formatCurrency(convertToINR(tripData.budget.used))}</span>
                  <span>Total: {formatCurrency(convertToINR(tripData.budget.total))}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <p className="text-sm font-medium">Breakdown</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Accommodation</span>
                    <span>{formatCurrency(convertToINR(tripData.budget.breakdown.accommodation))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Food</span>
                    <span>{formatCurrency(convertToINR(tripData.budget.breakdown.food))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Activities</span>
                    <span>{formatCurrency(convertToINR(tripData.budget.breakdown.activities))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transportation</span>
                    <span>{formatCurrency(convertToINR(tripData.budget.breakdown.transportation))}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Weather forecast */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weather Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {tripData.weather ? (
                <div className="grid grid-cols-7 gap-1">
                  {tripData.weather.map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs">{day.day.split(" ")[1]}</p>
                      <div className="flex justify-center my-1">
                        <WeatherIcon condition={day.condition} />
                      </div>
                      <p className="text-xs font-medium">{day.temp}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">Weather forecast unavailable</p>
              )}
            </CardContent>
          </Card>
          
          {/* Packing list */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Packing List</CardTitle>
            </CardHeader>
            <CardContent>
              {tripData.packingList ? (
                <ul className="space-y-2">
                  {tripData.packingList.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-sm border flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-muted-foreground">No packing list available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

