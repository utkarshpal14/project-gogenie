import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plane, 
  Train, 
  Hotel, 
  Car, 
  Utensils,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  Loader2,
  ArrowRight,
  Star
} from "lucide-react";
import { searchFlights, bookFlight } from "@/services/booking";
import { searchTrains, bookTrain } from "@/services/booking";
import { searchHotels, bookHotel } from "@/services/booking";
import { searchCabs, bookCab } from "@/services/booking";
import { searchRestaurants, bookRestaurant } from "@/services/booking";

export default function IntegratedBooking({ tripData, onBookingComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookings, setBookings] = useState({
    flights: [],
    trains: [],
    hotels: [],
    cabs: [],
    restaurants: []
  });
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Extract trip data
  const {
    destination,
    startLocation,
    duration,
    budget,
    interests,
    travelStyle,
    groupSize,
    foodPreferences,
    transportPreference,
    startDate,
    endDate
  } = tripData || {};

  const steps = [
    { id: 'flights', label: 'Flights', icon: Plane, color: 'bg-blue-500' },
    { id: 'trains', label: 'Trains', icon: Train, color: 'bg-green-500' },
    { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'bg-purple-500' },
    { id: 'cabs', label: 'Local Transport', icon: Car, color: 'bg-yellow-500' },
    { id: 'restaurants', label: 'Restaurants', icon: Utensils, color: 'bg-orange-500' }
  ];

  // Generate itinerary based on trip data
  const generateItinerary = () => {
    const itinerary = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      const dayNumber = Math.ceil((day - start) / (1000 * 60 * 60 * 24)) + 1;
      
      itinerary.push({
        day: dayNumber,
        date: day.toISOString().split('T')[0],
        activities: generateDayActivities(dayNumber, day)
      });
    }
    
    return itinerary;
  };

  const generateDayActivities = (dayNumber, date) => {
    const activities = [];
    
    // Morning activities
    if (dayNumber === 1) {
      activities.push({
        time: '09:00',
        type: 'flight',
        title: `Flight to ${destination}`,
        description: `Departure from ${startLocation}`,
        duration: '2-3 hours'
      });
    }
    
    // Daily activities based on interests
    if (interests?.includes('sightseeing')) {
      activities.push({
        time: '10:00',
        type: 'sightseeing',
        title: 'City Tour',
        description: 'Explore local attractions',
        duration: '3-4 hours'
      });
    }
    
    if (interests?.includes('food')) {
      activities.push({
        time: '13:00',
        type: 'restaurant',
        title: 'Local Cuisine',
        description: 'Try authentic local food',
        duration: '1-2 hours'
      });
    }
    
    // Evening activities
    activities.push({
      time: '19:00',
      type: 'restaurant',
      title: 'Dinner',
      description: 'Evening meal at recommended restaurant',
      duration: '1-2 hours'
    });
    
    return activities;
  };

  const searchAndBook = async (type, searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (type) {
        case 'flights':
          result = await searchFlights(searchParams);
          break;
        case 'trains':
          result = await searchTrains(searchParams);
          break;
        case 'hotels':
          result = await searchHotels(searchParams);
          break;
        case 'cabs':
          result = await searchCabs(searchParams);
          break;
        case 'restaurants':
          result = await searchRestaurants(searchParams);
          break;
        default:
          throw new Error('Invalid booking type');
      }
      
      if (result.success) {
        setBookings(prev => ({
          ...prev,
          [type]: result.data || []
        }));
        
        toast({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Found!`,
          description: `Found ${result.data?.length || 0} options for your trip.`,
        });
      } else {
        setError(result.error || `Failed to search ${type}`);
      }
    } catch (error) {
      setError(`Unable to search ${type}. Please try again.`);
      toast({
        title: "Search Failed",
        description: `Unable to search ${type}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookItem = async (type, item, additionalData = {}) => {
    setLoading(true);
    
    try {
      let result;
      const bookingData = {
        ...item,
        ...additionalData,
        tripData: tripData
      };
      
      switch (type) {
        case 'flights':
          result = await bookFlight(bookingData);
          break;
        case 'trains':
          result = await bookTrain(bookingData);
          break;
        case 'hotels':
          result = await bookHotel(bookingData);
          break;
        case 'cabs':
          result = await bookCab(bookingData);
          break;
        case 'restaurants':
          result = await bookRestaurant(bookingData);
          break;
        default:
          throw new Error('Invalid booking type');
      }
      
      if (result.success) {
        setSelectedItems(prev => ({
          ...prev,
          [type]: item
        }));
        
        toast({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Booked!`,
          description: `Your ${type} has been confirmed.`,
        });
        
        if (onBookingComplete) {
          onBookingComplete(result.data);
        }
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: `Unable to book ${type}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSearchParams = (type) => {
    const baseParams = {
      from: startLocation,
      to: destination,
      date: startDate,
      passengers: groupSize || 1
    };
    
    switch (type) {
      case 'flights':
        return {
          ...baseParams,
          departureDate: startDate,
          class: 'economy'
        };
      case 'trains':
        return {
          ...baseParams,
          departureDate: startDate,
          class: 'all'
        };
      case 'hotels':
        return {
          location: destination,
          checkIn: startDate,
          checkOut: endDate,
          guests: groupSize || 1,
          rooms: 1,
          budget: budget || 'moderate'
        };
      case 'cabs':
        return {
          from: startLocation,
          to: destination,
          date: startDate,
          time: '09:00',
          passengers: groupSize || 1
        };
      case 'restaurants':
        return {
          location: destination,
          cuisine: foodPreferences || 'all',
          date: startDate,
          time: '19:00',
          guests: groupSize || 1
        };
      default:
        return baseParams;
    }
  };

  const renderBookingCard = (type, items) => {
    if (!items || items.length === 0) return null;
    
    const step = steps.find(s => s.id === type);
    const Icon = step?.icon || Plane;
    
    return (
      <Card key={type} className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {step?.label} Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name || item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description || item.from + ' → ' + item.to}
                  </p>
                  {item.price && (
                    <p className="text-sm font-medium text-green-600">
                      ₹{item.price.toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleBookItem(type, item)}
                  disabled={loading}
                  size="sm"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Book Now'
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderItinerary = () => {
    const itinerary = generateItinerary();
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Trip Itinerary</h3>
        {itinerary.map((day, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Day {day.day} - {new Date(day.date).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <Badge variant="outline">{activity.duration}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Trip Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Trip Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-semibold">{destination}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{duration} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Group Size</p>
              <p className="font-semibold">{groupSize} people</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-semibold">₹{budget?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travel Style</p>
              <p className="font-semibold">{travelStyle}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interests</p>
              <p className="font-semibold">{interests?.join(', ')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary */}
      {renderItinerary()}

      {/* Booking Steps */}
      <Tabs value={steps[currentStep]?.id} onValueChange={(value) => {
        const stepIndex = steps.findIndex(s => s.id === value);
        setCurrentStep(stepIndex);
      }}>
        <TabsList className="grid w-full grid-cols-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <TabsTrigger key={step.id} value={step.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {steps.map((step) => (
          <TabsContent key={step.id} value={step.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Book {step.label}</h3>
              <Button
                onClick={() => searchAndBook(step.id, getSearchParams(step.id))}
                disabled={loading}
                className="bg-goginie-primary hover:bg-goginie-secondary"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <step.icon className="h-4 w-4 mr-2" />
                    Search {step.label}
                  </>
                )}
              </Button>
            </div>

            {renderBookingCard(step.id, bookings[step.id])}

            {selectedItems[step.id] && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">
                      {step.label} Booked: {selectedItems[step.id].name || selectedItems[step.id].title}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Booking Button */}
      {Object.keys(selectedItems).length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
            <p className="text-muted-foreground mb-4">
              You have booked {Object.keys(selectedItems).length} items for your trip.
            </p>
            <Button
              onClick={() => {
                toast({
                  title: "Trip Booked! 🎉",
                  description: "Your complete trip has been booked successfully.",
                });
                if (onBookingComplete) {
                  onBookingComplete(selectedItems);
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Booking
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 