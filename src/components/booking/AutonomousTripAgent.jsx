import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bot, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Plane,
  Train,
  Hotel,
  Car,
  Utensils,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Edit,
  ArrowRight,
  Star
} from "lucide-react";

// Import AI and booking functions
import { generateSmartItinerary } from "@/services/ai";
import { 
  searchFlights, 
  bookFlight,
  searchTrains, 
  bookTrain,
  searchHotels, 
  bookHotel,
  searchRestaurants, 
  bookRestaurant,
  searchCabs, 
  bookCab
} from "@/services/booking";

export default function AutonomousTripAgent({ userPreferences, onComplete }) {
  const [currentPhase, setCurrentPhase] = useState('planning');
  const [tripPlan, setTripPlan] = useState(null);
  const [availabilityCheck, setAvailabilityCheck] = useState({});
  const [finalPlan, setFinalPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userApproval, setUserApproval] = useState(null);
  const [bookingProgress, setBookingProgress] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const { toast } = useToast();

  const phases = [
    { id: 'planning', name: 'AI Planning', description: 'Creating your perfect itinerary' },
    { id: 'availability', name: 'Checking Availability', description: 'Verifying all services' },
    { id: 'review', name: 'Plan Review', description: 'Review your complete trip' },
    { id: 'booking', name: 'Auto Booking', description: 'Booking everything for you' },
    { id: 'complete', name: 'Complete', description: 'Your trip is ready!' }
  ];

  useEffect(() => {
    if (userPreferences) {
      startAutonomousProcess();
    }
  }, [userPreferences]);

  const startAutonomousProcess = async () => {
    setIsProcessing(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      console.log('🚀 Starting autonomous process with preferences:', userPreferences);
      
      // Phase 1: AI Planning
      const generatedPlan = await generateCompleteTripPlan();
      console.log('✅ Trip plan generated:', generatedPlan);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify trip plan is set
      if (!tripPlan && !generatedPlan) {
        throw new Error('Failed to generate trip plan');
      }
      
      // Phase 2: Check Availability
      await checkAllAvailability();
      
      // Phase 3: Show Final Plan
      setCurrentPhase('review');
      
    } catch (error) {
      console.error('Autonomous process failed:', error);
      setError(error.message);
      setDebugInfo({
        currentPhase,
        tripPlan: tripPlan ? 'Generated' : 'Not generated',
        error: error.message
      });
      toast({
        title: "Planning Failed",
        description: error.message || "AI agent encountered an error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCompleteTripPlan = async () => {
    setCurrentPhase('planning');
    
    try {
      console.log(' Generating trip plan...');
      
      // Generate detailed itinerary using AI
      const aiResponse = await generateSmartItinerary({
        ...userPreferences,
        includeBooking: true,
        detailedPlanning: true
      });

      console.log('📋 AI Response received:', aiResponse);

      if (aiResponse) {
        // Structure the response properly
        const structuredPlan = {
          // Use AI response data
          itinerary: aiResponse.itinerary || generateDefaultItinerary(userPreferences),
          budgetBreakdown: aiResponse.budgetBreakdown || {},
          recommendations: aiResponse.recommendations || {},
          packingList: aiResponse.packingList || [],
          localTips: aiResponse.localTips || [],
          
          // Add transport and accommodation info
          transport: {
            type: userPreferences.transportPreference || 'flight',
            from: userPreferences.startLocation,
            to: userPreferences.destination,
            date: userPreferences.departureDate
          },
          accommodation: {
            location: userPreferences.destination,
            checkIn: userPreferences.departureDate,
            checkOut: userPreferences.returnDate,
            guests: userPreferences.groupSize
          },
          dining: {
            cuisine: userPreferences.foodPreferences,
            location: userPreferences.destination,
            date: userPreferences.departureDate,
            guests: userPreferences.groupSize
          },
          
          // Add metadata
          destination: userPreferences.destination,
          duration: userPreferences.duration,
          budget: userPreferences.budget,
          groupSize: userPreferences.groupSize,
          travelStyle: userPreferences.travelStyle,
          interests: userPreferences.interests
        };
        
        console.log('✅ Structured plan created:', structuredPlan);
        setTripPlan(structuredPlan);
        
        toast({
          title: "🎯 Trip Plan Generated!",
          description: "AI has created your perfect itinerary",
        });
        
        return structuredPlan; // Return the plan for immediate use
      } else {
        throw new Error('AI did not return a valid trip plan');
      }
    } catch (error) {
      console.error('Trip planning error:', error);
      throw new Error(`Trip planning failed: ${error.message}`);
    }
  };

  const generateDefaultItinerary = (preferences) => {
    const days = [];
    const startDate = new Date(preferences.departureDate);
    
    for (let i = 0; i < preferences.duration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      days.push({
        day: `Day ${i + 1}`,
        date: currentDate.toISOString().split('T')[0],
        activities: [
          { 
            time: '09:00', 
            activity: 'Morning sightseeing',
            location: preferences.destination,
            cost: 50
          },
          { 
            time: '12:00', 
            activity: 'Lunch at local restaurant',
            location: 'Local area',
            cost: 30
          },
          { 
            time: '14:00', 
            activity: 'Afternoon activities',
            location: preferences.destination,
            cost: 40
          },
          { 
            time: '18:00', 
            activity: 'Evening relaxation',
            location: 'Hotel area',
            cost: 20
          }
        ]
      });
    }
    
    return days;
  };

  const checkAllAvailability = async () => {
    setCurrentPhase('availability');
    
    console.log('🔍 Checking availability...');
    console.log('Trip plan status:', tripPlan ? 'Available' : 'Not available');
    
    // Use the trip plan from state or create a fallback
    const currentTripPlan = tripPlan || {
      transport: {
        type: userPreferences.transportPreference || 'flight',
        from: userPreferences.startLocation,
        to: userPreferences.destination,
        date: userPreferences.departureDate
      },
      accommodation: {
        location: userPreferences.destination,
        checkIn: userPreferences.departureDate,
        checkOut: userPreferences.returnDate,
        guests: userPreferences.groupSize
      },
      dining: {
        cuisine: userPreferences.foodPreferences,
        location: userPreferences.destination,
        date: userPreferences.departureDate,
        guests: userPreferences.groupSize
      }
    };

    const availability = {
      transport: { available: false, alternatives: [] },
      hotels: { available: false, alternatives: [] },
      restaurants: { available: false, alternatives: [] },
      activities: { available: false, alternatives: [] }
    };

    try {
      // Check transport availability with null safety
      const transportType = currentTripPlan.transport?.type || userPreferences.transportPreference || 'flight';
      console.log(' Transport type:', transportType);
      
      if (transportType === 'flight') {
        console.log('✈️ Searching for flights...');
        const flights = await searchFlights({
          from: userPreferences.startLocation,
          to: userPreferences.destination,
          departureDate: userPreferences.departureDate,
          passengers: userPreferences.groupSize
        });
        
        console.log('✈️ Flight search results:', flights);
        
        if (flights && flights.length > 0) {
          availability.transport.available = true;
          availability.transport.selected = flights[0];
          availability.transport.alternatives = flights.slice(1, 3);
        }
      } else if (transportType === 'train') {
        console.log('🚂 Searching for trains...');
        const trains = await searchTrains({
          from: userPreferences.startLocation,
          to: userPreferences.destination,
          departureDate: userPreferences.departureDate,
          passengers: userPreferences.groupSize
        });
        
        console.log(' Train search results:', trains);
        
        if (trains && trains.length > 0) {
          availability.transport.available = true;
          availability.transport.selected = trains[0];
          availability.transport.alternatives = trains.slice(1, 3);
        }
      }

      // Check hotel availability
      console.log(' Searching for hotels...');
      const hotels = await searchHotels({
        location: userPreferences.destination,
        checkIn: userPreferences.departureDate,
        checkOut: userPreferences.returnDate,
        guests: userPreferences.groupSize,
        budget: userPreferences.budget * 0.4
      });

      console.log(' Hotel search results:', hotels);

      if (hotels && hotels.length > 0) {
        availability.hotels.available = true;
        availability.hotels.selected = hotels[0];
        availability.hotels.alternatives = hotels.slice(1, 3);
      }

      // Check restaurant availability
      console.log('🍽️ Searching for restaurants...');
      const restaurants = await searchRestaurants({
        location: userPreferences.destination,
        cuisine: userPreferences.foodPreferences,
        date: userPreferences.departureDate,
        guests: userPreferences.groupSize
      });

      console.log('🍽️ Restaurant search results:', restaurants);

      if (restaurants && restaurants.length > 0) {
        availability.restaurants.available = true;
        availability.restaurants.selected = restaurants[0];
        availability.restaurants.alternatives = restaurants.slice(1, 3);
      }

      console.log('✅ Availability check complete:', availability);
      setAvailabilityCheck(availability);

      // Create final plan with availability
      const finalPlanData = {
        ...currentTripPlan,
        availability,
        totalCost: calculateTotalCost(availability),
        confirmationCode: generateConfirmationCode()
      };

      console.log('📋 Final plan created:', finalPlanData);
      setFinalPlan(finalPlanData);

    } catch (error) {
      console.error('Availability check error:', error);
      throw new Error(`Availability check failed: ${error.message}`);
    }
  };

  const calculateTotalCost = (availability) => {
    let total = 0;
    
    if (availability.transport.available) {
      total += (availability.transport.selected.price || 0) * userPreferences.groupSize;
    }
    
    if (availability.hotels.available) {
      total += (availability.hotels.selected.price || 0) * userPreferences.duration;
    }
    
    if (availability.restaurants.available) {
      total += (availability.restaurants.selected.averageCost || 0) * userPreferences.groupSize;
    }

    return total;
  };

  const generateConfirmationCode = () => {
    return 'GG' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleUserApproval = (approved) => {
    setUserApproval(approved);
    
    if (approved) {
      startAutomaticBooking();
    } else {
      toast({
        title: "Plan Rejected",
        description: "Please modify your preferences and try again.",
        variant: "destructive",
      });
    }
  };

  const startAutomaticBooking = async () => {
    setCurrentPhase('booking');
    setIsProcessing(true);

    const bookingProgress = {
      transport: 'pending',
      hotel: 'pending',
      restaurant: 'pending',
      activities: 'pending'
    };

    try {
      // Book transport
      if (availabilityCheck.transport.available) {
        bookingProgress.transport = 'booking';
        setBookingProgress({ ...bookingProgress });

        const transportType = tripPlan?.transport?.type || userPreferences.transportPreference || 'flight';
        
        if (transportType === 'flight') {
          const booking = await bookFlight({
            flightId: availabilityCheck.transport.selected.id,
            passengers: userPreferences.groupSize,
            passengerDetails: generatePassengerDetails(userPreferences.groupSize)
          });
          
          if (booking.success) {
            bookingProgress.transport = 'booked';
          } else {
            bookingProgress.transport = 'failed';
          }
        } else if (transportType === 'train') {
          const booking = await bookTrain({
            trainId: availabilityCheck.transport.selected.id,
            passengers: userPreferences.groupSize,
            class: 'AC3'
          });
          
          if (booking.success) {
            bookingProgress.transport = 'booked';
          } else {
            bookingProgress.transport = 'failed';
          }
        }
      }

      // Book hotel
      if (availabilityCheck.hotels.available) {
        bookingProgress.hotel = 'booking';
        setBookingProgress({ ...bookingProgress });

        const booking = await bookHotel({
          hotelId: availabilityCheck.hotels.selected.id,
          checkIn: userPreferences.departureDate,
          checkOut: userPreferences.returnDate,
          guests: userPreferences.groupSize,
          roomType: 'standard'
        });

        if (booking.success) {
          bookingProgress.hotel = 'booked';
        } else {
          bookingProgress.hotel = 'failed';
        }
      }

      // Book restaurant
      if (availabilityCheck.restaurants.available) {
        bookingProgress.restaurant = 'booking';
        setBookingProgress({ ...bookingProgress });

        const booking = await bookRestaurant({
          restaurantId: availabilityCheck.restaurants.selected.id,
          date: userPreferences.departureDate,
          time: '19:00',
          guests: userPreferences.groupSize
        });

        if (booking.success) {
          bookingProgress.restaurant = 'booked';
        } else {
          bookingProgress.restaurant = 'failed';
        }
      }

      setBookingProgress(bookingProgress);
      setCurrentPhase('complete');

      toast({
        title: "🎉 Booking Complete!",
        description: "Your entire trip has been booked automatically!",
      });

      // Call completion callback
      onComplete({
        tripPlan: finalPlan,
        bookings: bookingProgress,
        totalCost: finalPlan.totalCost,
        confirmationCode: finalPlan.confirmationCode
      });

    } catch (error) {
      console.error('Automatic booking failed:', error);
      toast({
        title: "Booking Failed",
        description: "Some bookings could not be completed automatically.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePassengerDetails = (count) => {
    const details = [];
    for (let i = 0; i < count; i++) {
      details.push({
        firstName: `Passenger${i + 1}`,
        lastName: 'User',
        email: 'user@example.com',
        phone: '+91-9876543210'
      });
    }
    return details;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'booking': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Error Occurred
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">{error}</p>
            
            {debugInfo && (
              <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
                <h4 className="font-semibold mb-2">Debug Information:</h4>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setError(null);
                  setDebugInfo(null);
                  startAutonomousProcess();
                }}
                variant="outline"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => {
                  setError(null);
                  setDebugInfo(null);
                  setCurrentPhase('planning');
                }}
                variant="outline"
              >
                Restart Planning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" />
            Autonomous AI Trip Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Agent Progress</span>
                <span>{Math.round((phases.findIndex(p => p.id === currentPhase) / phases.length) * 100)}%</span>
              </div>
              <Progress value={(phases.findIndex(p => p.id === currentPhase) / phases.length) * 100} className="w-full" />
            </div>

            {/* Phase Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {phases.map((phase, index) => {
                const isActive = phase.id === currentPhase;
                const isCompleted = phases.findIndex(p => p.id === currentPhase) > index;
                
                return (
                  <div
                    key={phase.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : isCompleted
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        isActive ? 'bg-blue-500' : isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      } text-white`}>
                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <span className="text-sm font-medium text-center">{phase.name}</span>
                      <span className="text-xs text-gray-600 text-center">{phase.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phase Content */}
      {currentPhase === 'planning' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">AI is Planning Your Perfect Trip</h3>
                <p className="text-gray-600">Analyzing your preferences and creating a detailed itinerary...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPhase === 'availability' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Checking Availability</h3>
                <p className="text-gray-600">Verifying flights, hotels, and restaurants for your dates...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPhase === 'review' && finalPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Your Complete Trip Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trip Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">Destination</h4>
                <p className="text-blue-600">{userPreferences.destination}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Duration</h4>
                <p className="text-green-600">{userPreferences.duration} days</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800">Total Cost</h4>
                <p className="text-purple-600">₹{finalPlan.totalCost.toLocaleString()}</p>
              </div>
            </div>

            {/* Detailed Itinerary */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Day-by-Day Itinerary</h4>
              {finalPlan.itinerary?.map((day, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{day.day || `Day ${index + 1}`}</Badge>
                      <span className="font-medium">{day.date}</span>
                    </div>
                    <div className="space-y-2">
                      {day.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{activity.time}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span>{activity.activity || activity.description}</span>
                          {activity.cost && (
                            <Badge variant="outline" className="ml-auto">
                              ₹{activity.cost}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Booking Summary */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Booking Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availabilityCheck.transport.available && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Transport</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-green-700">
                        {availabilityCheck.transport.selected.name || availabilityCheck.transport.selected.airline}
                      </p>
                      <p className="text-sm font-medium text-green-800">
                        ₹{(availabilityCheck.transport.selected.price || 0) * userPreferences.groupSize}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {availabilityCheck.hotels.available && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Hotel className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Hotel</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-green-700">
                        {availabilityCheck.hotels.selected.name}
                      </p>
                      <p className="text-sm font-medium text-green-800">
                        ₹{(availabilityCheck.hotels.selected.price || 0) * userPreferences.duration}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {availabilityCheck.restaurants.available && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Restaurant</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-green-700">
                        {availabilityCheck.restaurants.selected.name}
                      </p>
                      <p className="text-sm font-medium text-green-800">
                        ₹{(availabilityCheck.restaurants.selected.averageCost || 0) * userPreferences.groupSize}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* User Approval */}
            <div className="flex justify-center space-x-4 pt-6 border-t">
              <Button 
                onClick={() => handleUserApproval(true)}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <ThumbsUp className="h-5 w-5 mr-2" />
                Approve & Book Everything
              </Button>
              <Button 
                onClick={() => handleUserApproval(false)}
                variant="outline"
                size="lg"
              >
                <Edit className="h-5 w-5 mr-2" />
                Modify Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPhase === 'booking' && (
        <Card>
          <CardHeader>
            <CardTitle>Automatic Booking in Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(bookingProgress).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <span className="font-medium capitalize">{service}</span>
                </div>
                <Badge variant={status === 'booked' ? 'default' : status === 'failed' ? 'destructive' : 'secondary'}>
                  {status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {currentPhase === 'complete' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Your Trip is Ready!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Confirmation Code: {finalPlan?.confirmationCode}
              </h3>
              <p className="text-green-700 mb-4">
                Everything has been booked automatically! Your complete trip is ready.
              </p>
              <Button 
                onClick={() => onComplete && onComplete(finalPlan)}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                View Complete Trip Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 