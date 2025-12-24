import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plane, 
  Train, 
  Car, 
  Hotel, 
  Utensils,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles
} from "lucide-react";

// Import individual booking components
import FlightBooking from "@/components/booking/FlightBooking";
import TrainBooking from "@/components/booking/TrainBooking";
import CabBooking from "@/components/booking/CabBooking";
import HotelBooking from "@/components/booking/HotelBooking";
import RestaurantBooking from "@/components/booking/RestaurantBooking";
import IntegratedBooking from "@/components/booking/IntegratedBooking";
import AutomatedBookingAgent from "@/components/booking/AutomatedBookingAgent";
import CompleteTripPlanner from "@/components/CompleteTripPlanner";

export default function Booking() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("complete-trip");
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [showAutomated, setShowAutomated] = useState(false);
  const { toast } = useToast();

  // Get trip data from navigation state
  useEffect(() => {
    if (location.state?.tripData) {
      setTripData(location.state.tripData);
      setActiveTab("complete-trip");
      
      // Show welcome message
      if (location.state.fromPlanning) {
        toast({
          title: "Welcome to Booking! 🎉",
          description: "Your trip details have been loaded. Start booking your travel!",
        });
      }
    } else {
      // Fallback to mock data if no trip data
      setTripData({
        destination: "Paris",
        startLocation: "Delhi",
        duration: 5,
        budget: 150000,
        interests: ["sightseeing", "food", "culture"],
        travelStyle: "luxury",
        groupSize: 2,
        foodPreferences: "French",
        transportPreference: "flight",
        startDate: "2025-09-24",
        endDate: "2025-09-28"
      });
    }
  }, [location.state, toast]);

  useEffect(() => {
    // Get trip data from localStorage or location state
    const storedTripData = localStorage.getItem('tripData');
    if (storedTripData) {
      setTripData(JSON.parse(storedTripData));
      setShowAutomated(true);
    }
  }, []);

  if (showAutomated && tripData) {
    return (
      <AutomatedBookingAgent 
        tripData={tripData}
        onBookingComplete={(bookingSummary) => {
          // Handle completed booking
          console.log('Booking completed:', bookingSummary);
        }}
      />
    );
  }

  const bookingTypes = [
    {
      id: "complete-trip",
      label: "Plan & Book",
      icon: Calendar,
      description: "Plan and book your complete trip",
      color: "bg-purple-500"
    },
    {
      id: "integrated",
      label: "Quick Book",
      icon: Calendar,
      description: "Book your entire trip with one click",
      color: "bg-purple-500"
    },
    {
      id: "flights",
      label: "Flights",
      icon: Plane,
      description: "Book domestic & international flights",
      color: "bg-blue-500"
    },
    {
      id: "trains",
      label: "Trains",
      icon: Train,
      description: "Book train tickets across India",
      color: "bg-green-500"
    },
    {
      id: "cabs",
      label: "Cabs",
      icon: Car,
      description: "Book local & intercity cabs",
      color: "bg-yellow-500"
    },
    {
      id: "hotels",
      label: "Hotels",
      icon: Hotel,
      description: "Book hotels & accommodations",
      color: "bg-purple-500"
    },
    {
      id: "restaurants",
      label: "Restaurants",
      icon: Utensils,
      description: "Book restaurant tables",
      color: "bg-orange-500"
    }
  ];

  const handleBookingComplete = (booking) => {
    const newBooking = {
      ...booking,
      id: `booking_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    };
    
    setBookings(prev => [newBooking, ...prev]);
    
    toast({
      title: "Booking Confirmed!",
      description: `Your booking has been successfully confirmed.`,
    });
  };

  const getBookingIcon = (type) => {
    const bookingType = bookingTypes.find(bt => bt.id === type);
    return bookingType ? bookingType.icon : Calendar;
  };

  const getBookingColor = (type) => {
    const bookingType = bookingTypes.find(bt => bt.id === type);
    return bookingType ? bookingType.color : "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {location.state?.fromPlanning && (
              <Sparkles className="h-6 w-6 text-purple-500" />
            )}
            <h1 className="text-4xl font-bold text-gray-900">
              {location.state?.fromPlanning ? "Complete Your Trip" : "Book Your Travel"}
            </h1>
            {location.state?.fromPlanning && (
              <Sparkles className="h-6 w-6 text-purple-500" />
            )}
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {location.state?.fromPlanning 
              ? "Your trip has been planned! Now let's book everything for you." 
              : "Choose your preferred booking method and let's get you traveling!"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Trip Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Trip Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tripData ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Destination:</span>
                      </div>
                      <p className="text-gray-600 ml-6">{tripData.destination}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Duration:</span>
                      </div>
                      <p className="text-gray-600 ml-6">{tripData.duration} days</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">Group Size:</span>
                      </div>
                      <p className="text-gray-600 ml-6">{tripData.groupSize} people</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Budget:</span>
                      </div>
                      <p className="text-gray-600 ml-6">₹{tripData.budget?.toLocaleString()}</p>
                    </div>

                    {location.state?.fromPlanning && (
                      <div className="pt-4 border-t">
                        <Button 
                          onClick={() => setShowAutomated(true)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Auto-Book Everything
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No trip data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Tabs */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Your Travel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-7 mb-6">
                    {bookingTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <TabsTrigger 
                          key={type.id} 
                          value={type.id}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{type.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {/* NEW: Complete Trip Planner Tab */}
                  <TabsContent value="complete-trip" className="space-y-4">
                    <CompleteTripPlanner />
                  </TabsContent>

                  <TabsContent value="integrated" className="space-y-4">
                    {tripData && (
                      <IntegratedBooking 
                        tripData={tripData}
                        onBookingComplete={handleBookingComplete} 
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="flights" className="space-y-4">
                    {tripData && (
                      <FlightBooking 
                        tripData={tripData}
                        onBookingComplete={handleBookingComplete} 
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="trains" className="space-y-4">
                    {tripData && (
                      <TrainBooking 
                        tripData={tripData}
                        onBookingComplete={handleBookingComplete} 
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="cabs" className="space-y-4">
                    {tripData && (
                      <CabBooking 
                        tripData={tripData}
                        onBookingComplete={handleBookingComplete} 
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="hotels" className="space-y-4">
                    {tripData && (
                      <HotelBooking 
                        tripData={tripData}
                        onBookingComplete={handleBookingComplete} 
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="restaurants" className="space-y-4">
                    {tripData && (
                      <RestaurantBooking 
                        tripData={tripData}
                        onBookingComplete={handleBookingComplete} 
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => {
                  const Icon = getBookingIcon(booking.type);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getBookingColor(booking.type)} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.type} Booking</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {booking.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 