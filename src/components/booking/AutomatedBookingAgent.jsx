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
  Loader2
} from "lucide-react";

// Import booking functions
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

export default function AutomatedBookingAgent({ tripData, onBookingComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingStatus, setBookingStatus] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [alternativeDates, setAlternativeDates] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingSummary, setBookingSummary] = useState({});
  const { toast } = useToast();

  const steps = [
    { id: 'flight', name: 'Flight Booking', icon: Plane, color: 'bg-blue-500' },
    { id: 'train', name: 'Train Booking', icon: Train, color: 'bg-green-500' },
    { id: 'hotel', name: 'Hotel Booking', icon: Hotel, color: 'bg-purple-500' },
    { id: 'transport', name: 'Local Transport', icon: Car, color: 'bg-orange-500' },
    { id: 'restaurant', name: 'Restaurant Booking', icon: Utensils, color: 'bg-red-500' }
  ];

  useEffect(() => {
    if (tripData) {
      startAutomatedBooking();
    }
  }, [tripData]);

  const startAutomatedBooking = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    
    try {
      // Step 1: Flight Booking
      await handleFlightBooking();
      
      // Step 2: Train Booking (if needed)
      if (tripData.transportPreference === 'train' || tripData.transportPreference === 'mixed') {
        await handleTrainBooking();
      }
      
      // Step 3: Hotel Booking
      await handleHotelBooking();
      
      // Step 4: Local Transport
      await handleTransportBooking();
      
      // Step 5: Restaurant Booking
      await handleRestaurantBooking();
      
      // Complete booking
      onBookingComplete(bookingSummary);
      
    } catch (error) {
      console.error('Automated booking failed:', error);
      toast({
        title: "Booking Failed",
        description: "Some bookings could not be completed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFlightBooking = async () => {
    setCurrentStep(0);
    setBookingStatus(prev => ({ ...prev, flight: 'searching' }));
    
    try {
      // Search for flights
      const flights = await searchFlights({
        from: tripData.startLocation,
        to: tripData.destination,
        departureDate: tripData.departureDate,
        passengers: tripData.groupSize,
        class: 'economy'
      });

      if (flights && flights.length > 0) {
        // Book the best flight
        const bestFlight = flights[0]; // AI selects the best option
        const booking = await bookFlight({
          flightId: bestFlight.id,
          passengers: tripData.groupSize,
          passengerDetails: generatePassengerDetails(tripData.groupSize)
        });

        if (booking.success) {
          setBookingStatus(prev => ({ ...prev, flight: 'booked' }));
          setBookingSummary(prev => ({ 
            ...prev, 
            flight: booking,
            flightCost: bestFlight.price * tripData.groupSize
          }));
          setTotalCost(prev => prev + (bestFlight.price * tripData.groupSize));
          
          toast({
            title: "✈️ Flight Booked!",
            description: `${bestFlight.airline} ${bestFlight.flightNumber} confirmed`,
          });
        } else {
          throw new Error('Flight booking failed');
        }
      } else {
        // No flights available, suggest alternative dates
        await suggestAlternativeDates('flight');
        setBookingStatus(prev => ({ ...prev, flight: 'unavailable' }));
      }
    } catch (error) {
      console.error('Flight booking error:', error);
      setBookingStatus(prev => ({ ...prev, flight: 'failed' }));
      await suggestAlternativeDates('flight');
    }
  };

  const handleTrainBooking = async () => {
    setCurrentStep(1);
    setBookingStatus(prev => ({ ...prev, train: 'searching' }));
    
    try {
      const trains = await searchTrains({
        from: tripData.startLocation,
        to: tripData.destination,
        departureDate: tripData.departureDate,
        passengers: tripData.groupSize
      });

      if (trains && trains.length > 0) {
        const bestTrain = trains[0];
        const booking = await bookTrain({
          trainId: bestTrain.id,
          passengers: tripData.groupSize,
          class: 'AC3' // AI selects appropriate class
        });

        if (booking.success) {
          setBookingStatus(prev => ({ ...prev, train: 'booked' }));
          setBookingSummary(prev => ({ 
            ...prev, 
            train: booking,
            trainCost: bestTrain.fare * tripData.groupSize
          }));
          setTotalCost(prev => prev + (bestTrain.fare * tripData.groupSize));
          
          toast({
            title: "🚂 Train Booked!",
            description: `${bestTrain.name} confirmed`,
          });
        }
      } else {
        setBookingStatus(prev => ({ ...prev, train: 'unavailable' }));
        await suggestAlternativeDates('train');
      }
    } catch (error) {
      console.error('Train booking error:', error);
      setBookingStatus(prev => ({ ...prev, train: 'failed' }));
    }
  };

  const handleHotelBooking = async () => {
    setCurrentStep(2);
    setBookingStatus(prev => ({ ...prev, hotel: 'searching' }));
    
    try {
      const hotels = await searchHotels({
        location: tripData.destination,
        checkIn: tripData.departureDate,
        checkOut: tripData.returnDate,
        guests: tripData.groupSize,
        budget: tripData.budget * 0.4 // 40% of budget for accommodation
      });

      if (hotels && hotels.length > 0) {
        const bestHotel = hotels[0];
        const booking = await bookHotel({
          hotelId: bestHotel.id,
          checkIn: tripData.departureDate,
          checkOut: tripData.returnDate,
          guests: tripData.groupSize,
          roomType: 'standard'
        });

        if (booking.success) {
          setBookingStatus(prev => ({ ...prev, hotel: 'booked' }));
          setBookingSummary(prev => ({ 
            ...prev, 
            hotel: booking,
            hotelCost: bestHotel.price * tripData.duration
          }));
          setTotalCost(prev => prev + (bestHotel.price * tripData.duration));
          
          toast({
            title: "🏨 Hotel Booked!",
            description: `${bestHotel.name} confirmed`,
          });
        }
      } else {
        setBookingStatus(prev => ({ ...prev, hotel: 'unavailable' }));
      }
    } catch (error) {
      console.error('Hotel booking error:', error);
      setBookingStatus(prev => ({ ...prev, hotel: 'failed' }));
    }
  };

  const handleTransportBooking = async () => {
    setCurrentStep(3);
    setBookingStatus(prev => ({ ...prev, transport: 'searching' }));
    
    try {
      // Book airport/train station pickup
      const pickupBooking = await bookCab({
        from: tripData.startLocation,
        to: tripData.destination,
        date: tripData.departureDate,
        passengers: tripData.groupSize,
        type: 'pickup'
      });

      if (pickupBooking.success) {
        setBookingStatus(prev => ({ ...prev, transport: 'booked' }));
        setBookingSummary(prev => ({ 
          ...prev, 
          transport: pickupBooking,
          transportCost: pickupBooking.fare
        }));
        setTotalCost(prev => prev + pickupBooking.fare);
        
        toast({
          title: "🚗 Transport Booked!",
          description: "Airport pickup confirmed",
        });
      }
    } catch (error) {
      console.error('Transport booking error:', error);
      setBookingStatus(prev => ({ ...prev, transport: 'failed' }));
    }
  };

  const handleRestaurantBooking = async () => {
    setCurrentStep(4);
    setBookingStatus(prev => ({ ...prev, restaurant: 'searching' }));
    
    try {
      const restaurants = await searchRestaurants({
        location: tripData.destination,
        cuisine: tripData.foodPreferences,
        date: tripData.departureDate,
        guests: tripData.groupSize
      });

      if (restaurants && restaurants.length > 0) {
        const bestRestaurant = restaurants[0];
        const booking = await bookRestaurant({
          restaurantId: bestRestaurant.id,
          date: tripData.departureDate,
          time: '19:00', // AI suggests optimal time
          guests: tripData.groupSize
        });

        if (booking.success) {
          setBookingStatus(prev => ({ ...prev, restaurant: 'booked' }));
          setBookingSummary(prev => ({ 
            ...prev, 
            restaurant: booking,
            restaurantCost: bestRestaurant.averageCost * tripData.groupSize
          }));
          setTotalCost(prev => prev + (bestRestaurant.averageCost * tripData.groupSize));
          
          toast({
            title: "🍽️ Restaurant Booked!",
            description: `${bestRestaurant.name} reservation confirmed`,
          });
        }
      }
    } catch (error) {
      console.error('Restaurant booking error:', error);
      setBookingStatus(prev => ({ ...prev, restaurant: 'failed' }));
    }
  };

  const suggestAlternativeDates = async (service) => {
    const dates = [];
    const originalDate = new Date(tripData.departureDate);
    
    // Generate alternative dates (±3 days)
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const newDate = new Date(originalDate);
      newDate.setDate(newDate.getDate() + i);
      dates.push(newDate.toISOString().split('T')[0]);
    }
    
    setAlternativeDates(dates);
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
      case 'searching': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'unavailable': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'booked': return 'Booked';
      case 'searching': return 'Searching...';
      case 'unavailable': return 'Unavailable';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" />
            AI Booking Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Booking Progress</span>
                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <Progress value={(currentStep / steps.length) * 100} className="w-full" />
            </div>

            {/* Booking Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const status = bookingStatus[step.id] || 'pending';
                
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      index === currentStep 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${step.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{step.name}</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(status)}
                        <span className="text-xs text-gray-600">
                          {getStatusText(status)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alternative Dates */}
            {alternativeDates.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Alternative Dates Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 mb-3">
                    Some services are not available on your preferred date. Here are alternative dates:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {alternativeDates.map((date) => (
                      <Button
                        key={date}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Update trip data with new date
                          const updatedTripData = { ...tripData, departureDate: date };
                          startAutomatedBooking();
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(date).toLocaleDateString()}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Summary */}
            {totalCost > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Total Cost: ₹{totalCost.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bookingSummary.flight && (
                      <div className="flex justify-between">
                        <span>Flight</span>
                        <span>₹{bookingSummary.flightCost?.toLocaleString()}</span>
                      </div>
                    )}
                    {bookingSummary.train && (
                      <div className="flex justify-between">
                        <span>Train</span>
                        <span>₹{bookingSummary.trainCost?.toLocaleString()}</span>
                      </div>
                    )}
                    {bookingSummary.hotel && (
                      <div className="flex justify-between">
                        <span>Hotel</span>
                        <span>₹{bookingSummary.hotelCost?.toLocaleString()}</span>
                      </div>
                    )}
                    {bookingSummary.transport && (
                      <div className="flex justify-between">
                        <span>Transport</span>
                        <span>₹{bookingSummary.transportCost?.toLocaleString()}</span>
                      </div>
                    )}
                    {bookingSummary.restaurant && (
                      <div className="flex justify-between">
                        <span>Restaurant</span>
                        <span>₹{bookingSummary.restaurantCost?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 