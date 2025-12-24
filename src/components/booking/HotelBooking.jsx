import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Hotel, 
  Calendar, 
  MapPin, 
  Users, 
  Star,
  Loader2,
  AlertCircle,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves
} from "lucide-react";

export default function HotelBooking({ onBookingComplete }) {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
    budget: 'moderate'
  });
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  });
  
  const { toast } = useToast();

  const budgetOptions = [
    { value: 'budget', label: 'Budget (₹1000-3000/night)', icon: '₹' },
    { value: 'moderate', label: 'Moderate (₹3000-8000/night)', icon: '₹₹' },
    { value: 'premium', label: 'Premium (₹8000+/night)', icon: '₹₹₹' }
  ];

  const searchHotels = async () => {
    if (!searchParams.location || !searchParams.checkIn || !searchParams.checkOut) {
      toast({
        title: "Details Required",
        description: "Please fill in location, check-in, and check-out dates.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      });
      
      if (response.ok) {
        const data = await response.json();
        setHotels(data.hotels || []);
        toast({
          title: "Hotels Found",
          description: `Found ${data.hotels?.length || 0} hotels matching your criteria.`
        });
      } else {
        throw new Error('Failed to search hotels');
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search hotels. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const bookHotel = async (hotel) => {
    if (!bookingDetails.name || !bookingDetails.phone || !bookingDetails.email) {
      toast({
        title: "Details Required",
        description: "Please fill in all booking details.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        hotel: hotel,
        booking: {
          ...bookingDetails,
          ...searchParams,
          bookingId: `HOT_${Date.now()}`,
          status: 'confirmed',
          bookingDate: new Date().toISOString(),
          totalAmount: hotel.price * searchParams.rooms * getNights()
        }
      };

      const response = await fetch('/api/hotels/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description: `Your room at ${hotel.name} has been reserved.`
        });
        
        if (onBookingComplete) {
          onBookingComplete(bookingData.booking);
        }
        
        // Reset form
        setSelectedHotel(null);
        setBookingDetails({ name: '', phone: '', email: '', specialRequests: '' });
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Unable to complete booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 1;
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5" />
            Find & Book Hotels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter city or area"
                value={searchParams.location}
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input
                id="checkIn"
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                id="checkOut"
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="guests">Guests</Label>
              <Select value={searchParams.guests.toString()} onValueChange={(value) => setSearchParams(prev => ({ ...prev, guests: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="rooms">Rooms</Label>
              <Select value={searchParams.rooms.toString()} onValueChange={(value) => setSearchParams(prev => ({ ...prev, rooms: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rooms" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Room' : 'Rooms'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={searchParams.budget} onValueChange={(value) => setSearchParams(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map(budget => (
                    <SelectItem key={budget.value} value={budget.value}>
                      {budget.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={searchHotels} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching Hotels...
              </>
            ) : (
              'Search Hotels'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hotels.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Hotels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg">{hotel.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{hotel.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{hotel.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{hotel.roomType}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities?.map(amenity => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-green-600">
                        ₹{hotel.price?.toLocaleString()}/night
                      </div>
                      <Button 
                        onClick={() => setSelectedHotel(hotel)}
                        size="sm"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedHotel && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-y-auto">
          <CardHeader>
            <CardTitle>Book Room at {selectedHotel.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={bookingDetails.name}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={bookingDetails.phone}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingDetails.email}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label>Total Amount</Label>
                <div className="text-lg font-bold text-green-600">
                  ₹{(selectedHotel.price * searchParams.rooms * getNights()).toLocaleString()}
                  <span className="text-sm text-gray-500 ml-2">
                    ({getNights()} nights × {searchParams.rooms} room{searchParams.rooms > 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Input
                id="specialRequests"
                value={bookingDetails.specialRequests}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special requirements or requests"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => bookHotel(selectedHotel)}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setSelectedHotel(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 