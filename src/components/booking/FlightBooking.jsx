import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plane, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { searchFlights, bookFlight } from "@/services/booking";
import { formatCurrency } from "@/services/api";

export default function FlightBooking({ tripData, onBookingComplete }) {
  const [searchParams, setSearchParams] = useState({
    from: tripData?.startLocation || "",
    to: tripData?.destination || "",
    departureDate: tripData?.startDate || "",
    returnDate: tripData?.endDate || "",
    passengers: 1,
    class: "economy"
  });
  
  const [flights, setFlights] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const result = await searchFlights(searchParams);
      if (result.success) {
        setFlights(result.data);
        if (result.data.length === 0) {
          setError("No flights found for your search criteria.");
        } else {
          toast({
            title: "Flights Found! ✈️",
            description: `Found ${result.total} flights for your search.`,
          });
        }
      } else {
        setError(result.error || "Failed to search flights");
      }
    } catch (error) {
      setError("Unable to search flights. Please check your API configuration.");
      toast({
        title: "Search Failed",
        description: "Unable to search flights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookFlight = async (flight) => {
    setIsBooking(true);
    try {
      const bookingData = {
        flight: flight,
        passengers: searchParams.passengers,
        totalPrice: flight.price * searchParams.passengers,
        currency: flight.currency
      };

      const result = await bookFlight(bookingData);
      if (result.success) {
        toast({
          title: "Flight Booked! ✈️",
          description: `Your flight has been confirmed. Confirmation: ${result.data.confirmationCode}`,
        });
        onBookingComplete?.(result.data);
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to book flight. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-goginie-primary" />
            Search Flights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From (IATA Code)</Label>
              <Input
                id="from"
                value={searchParams.from}
                onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value.toUpperCase() }))}
                placeholder="e.g., DEL for Delhi"
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To (IATA Code)</Label>
              <Input
                id="to"
                value={searchParams.to}
                onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value.toUpperCase() }))}
                placeholder="e.g., CDG for Paris"
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departure">Departure Date</Label>
              <Input
                id="departure"
                type="date"
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return">Return Date</Label>
              <Input
                id="return"
                type="date"
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <Select
                value={searchParams.passengers.toString()}
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, passengers: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={searchParams.class}
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, class: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="w-full bg-goginie-primary hover:bg-goginie-secondary"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching Flights...
              </>
            ) : (
              <>
                <Plane className="h-4 w-4 mr-2" />
                Search Flights
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flight Results */}
      {flights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Flights</h3>
          {flights.map((flight) => (
            <Card key={flight.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-goginie-primary/10 rounded-lg flex items-center justify-center">
                      <Plane className="h-6 w-6 text-goginie-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{flight.airline}</h4>
                      <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-goginie-primary">
                      {formatCurrency(flight.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="font-semibold">{formatTime(flight.departure)}</p>
                    <p className="text-sm">{formatDate(flight.departure)}</p>
                    <p className="text-sm text-muted-foreground">{flight.from}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{flight.duration}</p>
                    <div className="flex items-center justify-center mt-1">
                      <div className="w-16 h-px bg-gray-300"></div>
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="font-semibold">{formatTime(flight.arrival)}</p>
                    <p className="text-sm">{formatDate(flight.arrival)}</p>
                    <p className="text-sm text-muted-foreground">{flight.to}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {flight.class}
                    </span>
                    {flight.refundable && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Refundable
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleBookFlight(flight)}
                    disabled={isBooking}
                    className="bg-goginie-primary hover:bg-goginie-secondary"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      'Book Now'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 