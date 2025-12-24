import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Car, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Navigation,
  DollarSign,
  Zap,
  Shield,
  Star,
  CheckCircle
} from "lucide-react";
import { searchCabs, bookCab } from "@/services/booking";
import { formatCurrency } from "@/services/api";

export default function CabBooking({ tripData, onBookingComplete }) {
  const [searchParams, setSearchParams] = useState({
    from: tripData?.startLocation || "",
    to: tripData?.destination || "",
    passengers: 1,
    date: tripData?.startDate || "",
    time: "09:00"
  });
  
  const [cabs, setCabs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCab, setSelectedCab] = useState(null);
  const { toast } = useToast();

  const cabTypes = [
    {
      id: 'economy',
      name: 'Economy Cab',
      icon: '🚗',
      description: 'Budget-friendly option',
      features: ['AC', '4 Seats', 'Basic comfort'],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'premium',
      name: 'Premium Cab',
      icon: '🚙',
      description: 'Comfortable ride',
      features: ['AC', '4 Seats', 'Extra legroom', 'Charging port'],
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'luxury',
      name: 'Luxury Cab',
      icon: '🚘',
      description: 'Premium experience',
      features: ['AC', '4 Seats', 'Leather seats', 'WiFi', 'Water bottles'],
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  const timeSlots = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to) {
      toast({
        title: "Missing Information",
        description: "Please fill in pickup and destination locations.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const result = await searchCabs(searchParams);
      if (result.success) {
        setCabs(result.data);
        if (result.data.length === 0) {
          setError("No cabs available for your route.");
        } else {
          toast({
            title: "Cabs Found! 🚗",
            description: `Found ${result.total} cab options for your route.`,
          });
        }
      } else {
        setError(result.error || "Failed to search cabs");
      }
    } catch (error) {
      setError("Unable to search cabs. Please check your API configuration.");
      toast({
        title: "Search Failed",
        description: "Unable to search cabs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookCab = async (cab) => {
    setIsBooking(true);
    try {
      const bookingData = {
        cab: cab,
        passengers: searchParams.passengers,
        date: searchParams.date,
        time: searchParams.time,
        totalPrice: cab.price,
        currency: 'INR'
      };

      const result = await bookCab(bookingData);
      if (result.success) {
        toast({
          title: "Cab Booked! 🚗",
          description: `Your cab has been confirmed. Confirmation: ${result.data.confirmationCode}`,
        });
        onBookingComplete?.(result.data);
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to book cab. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getCabTypeInfo = (type) => {
    return cabTypes.find(t => t.id === type) || cabTypes[0];
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-goginie-primary" />
            Book a Cab
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">Pickup Location</Label>
              <Input
                id="from"
                value={searchParams.from}
                onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value }))}
                placeholder="e.g., Delhi Airport, Connaught Place"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">Destination</Label>
              <Input
                id="to"
                value={searchParams.to}
                onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value }))}
                placeholder="e.g., Hotel, Restaurant, Station"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Pickup Time</Label>
              <Select
                value={searchParams.time}
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="w-full bg-goginie-primary hover:bg-goginie-secondary"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching Cabs...
              </>
            ) : (
              <>
                <Car className="h-4 w-4 mr-2" />
                Search Cabs
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

      {/* Cab Results */}
      {cabs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Cabs</h3>
          {cabs.map((cab) => {
            const cabType = getCabTypeInfo(cab.type);
            return (
              <Card key={cab.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-goginie-primary/10 rounded-lg flex items-center justify-center text-2xl">
                        {cabType.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{cab.name}</h4>
                        <p className="text-sm text-muted-foreground">{cabType.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cabType.color}>
                            {cab.type.charAt(0).toUpperCase() + cab.type.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{cab.capacity} seats</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-goginie-primary">
                        {formatCurrency(cab.price)}
                      </p>
                      <p className="text-sm text-muted-foreground">estimated fare</p>
                    </div>
                  </div>

                  {/* Route Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Pickup</p>
                      <p className="font-semibold text-sm">{cab.from}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{cab.duration}</p>
                      <div className="flex items-center justify-center mt-1">
                        <div className="w-16 h-px bg-gray-300"></div>
                        <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Distance: {cab.distance}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-semibold text-sm">{cab.to}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {cabType.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Estimated arrival: {cab.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Fare includes: Base + Distance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Insured & Licensed</span>
                    </div>
                  </div>

                  {/* Booking Section */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Booking Details</p>
                        <p className="font-semibold">
                          {searchParams.passengers} {searchParams.passengers === 1 ? 'Passenger' : 'Passengers'} • {searchParams.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(searchParams.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleBookCab(cab)}
                        disabled={isBooking}
                        className="bg-goginie-primary hover:bg-goginie-secondary"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <Car className="h-4 w-4 mr-2" />
                            Book Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Results Message */}
      {cabs.length === 0 && !isSearching && !error && (
        <Card>
          <CardContent className="p-8 text-center">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Cabs Available</h3>
            <p className="text-muted-foreground">
              Try adjusting your pickup and destination locations.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Booking Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Booking Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fares are estimated and may vary based on traffic conditions</li>
                <li>• Driver will contact you 10 minutes before pickup</li>
                <li>• Payment can be made via cash or digital wallet</li>
                <li>• Cancellation is free up to 30 minutes before pickup</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 