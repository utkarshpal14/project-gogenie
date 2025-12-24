import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Train, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Wifi,
  Utensils,
  Bed,
  Zap,
  CheckCircle
} from "lucide-react";
import { searchTrains, bookTrain } from "@/services/booking";

export default function TrainBooking({ tripData, onBookingComplete }) {
  const [searchParams, setSearchParams] = useState({
    from: tripData?.startLocation || "",
    to: tripData?.destination || "",
    departureDate: tripData?.startDate || "",
    passengers: 1,
    class: "all"
  });
  
  const [trains, setTrains] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const { toast } = useToast();

  // Format currency helper function
  const formatCurrency = (amount, currency = 'INR') => {
    const numAmount = typeof amount === 'number' ? amount : parseInt(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(numAmount);
  };

  // Safe string renderer
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

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
      const result = await searchTrains(searchParams);
      if (result.success) {
        setTrains(result.data || []);
        if (result.data.length === 0) {
          setError("No trains available for your route.");
        } else {
          toast({
            title: "Trains Found! 🚂",
            description: `Found ${result.total} train options for your route.`,
          });
        }
      } else {
        setError(result.error || "Failed to search trains");
      }
    } catch (error) {
      setError("Unable to search trains. Please check your API configuration.");
      toast({
        title: "Search Failed",
        description: "Unable to search trains. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookTrain = async (train, trainClass) => {
    setIsBooking(true);
    try {
      const bookingData = {
        train: train,
        trainClass: trainClass,
        passengers: searchParams.passengers,
        date: searchParams.departureDate,
        totalPrice: (trainClass.fare || 0) * searchParams.passengers,
        currency: 'INR'
      };

      const result = await bookTrain(bookingData);
      if (result.success) {
        toast({
          title: "Train Booked! 🚂",
          description: `Your train ticket has been confirmed. Confirmation: ${result.data.confirmationCode}`,
        });
        onBookingComplete?.(result.data);
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to book train. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getClassColor = (className) => {
    const colors = {
      'AC 1st Class': 'bg-red-100 text-red-800 border-red-200',
      'AC 2nd Class': 'bg-blue-100 text-blue-800 border-blue-200',
      'AC 3rd Class': 'bg-green-100 text-green-800 border-green-200',
      'AC Chair Car': 'bg-purple-100 text-purple-800 border-purple-200',
      'AC Executive': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sleeper': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[className] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'AC': <Zap className="h-4 w-4" />,
      'Food': <Utensils className="h-4 w-4" />,
      'WiFi': <Wifi className="h-4 w-4" />,
      'Bedding': <Bed className="h-4 w-4" />
    };
    return icons[amenity] || <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-goginie-primary" />
            Book Train Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From Station</Label>
              <Input
                id="from"
                value={searchParams.from}
                onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value }))}
                placeholder="e.g., Delhi, Mumbai, Bangalore"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To Station</Label>
              <Input
                id="to"
                value={searchParams.to}
                onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value }))}
                placeholder="e.g., Delhi, Mumbai, Bangalore"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Journey Date</Label>
              <Input
                id="date"
                type="date"
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
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
          </div>
          
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
            className="w-full bg-goginie-primary hover:bg-goginie-secondary"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching Trains...
              </>
            ) : (
              <>
                <Train className="h-4 w-4 mr-2" />
                Search Trains
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

      {/* Train Results */}
      {trains.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Trains</h3>
          {trains.map((train) => (
            <Card key={train.id || Math.random()} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-goginie-primary/10 rounded-lg flex items-center justify-center text-2xl">
                      🚂
                    </div>
                    <div>
                      <h4 className="font-semibold">{safeRender(train.name)}</h4>
                      <p className="text-sm text-muted-foreground">{safeRender(train.number)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{safeRender(train.type)}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{safeRender(train.distance)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Running Days</p>
                    <p className="font-semibold">{safeRender(train.days)}</p>
                  </div>
                </div>

                {/* Route Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="font-semibold">{safeRender(train.departure)}</p>
                    <p className="text-sm text-muted-foreground">{safeRender(train.from)}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{safeRender(train.duration)}</p>
                    <div className="flex items-center justify-center mt-1">
                      <div className="w-16 h-px bg-gray-300"></div>
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="font-semibold">{safeRender(train.arrival)}</p>
                    <p className="text-sm text-muted-foreground">{safeRender(train.to)}</p>
                  </div>
                </div>

                {/* Amenities */}
                {train.amenities && Array.isArray(train.amenities) && train.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {train.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                          {getAmenityIcon(safeRender(amenity))}
                          <span>{safeRender(amenity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Class Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Available Classes</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {train.classes && Array.isArray(train.classes) && train.classes.map((trainClass, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          selectedTrain?.id === train.id && selectedClass?.name === trainClass.name
                            ? 'border-goginie-primary bg-goginie-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        } cursor-pointer transition-colors`}
                        onClick={() => {
                          setSelectedTrain(train);
                          setSelectedClass(trainClass);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getClassColor(safeRender(trainClass.name))}>
                            {safeRender(trainClass.name)}
                          </Badge>
                          <div className="text-right">
                            <p className="font-semibold text-goginie-primary">
                              {formatCurrency(trainClass.fare)}
                            </p>
                            <p className="text-xs text-muted-foreground">per person</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{trainClass.available ? 'Available' : 'Waitlist'}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookTrain(train, trainClass);
                            }}
                            disabled={isBooking || !trainClass.available}
                            className="bg-goginie-primary hover:bg-goginie-secondary"
                          >
                            {isBooking ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Book Now'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {trains.length === 0 && !isSearching && !error && (
        <Card>
          <CardContent className="p-8 text-center">
            <Train className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Trains Available</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 