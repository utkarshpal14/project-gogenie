import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Utensils, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  Loader2,
  AlertCircle,
  Phone,
  Globe,
  Calendar
} from "lucide-react";

export default function RestaurantBooking({ onBookingComplete }) {
  const [searchParams, setSearchParams] = useState({
    location: '',
    cuisine: '',
    date: '',
    time: '',
    guests: 2,
    budget: 'moderate'
  });
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  });
  
  const { toast } = useToast();

  const cuisineOptions = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 
    'Japanese', 'American', 'Mediterranean', 'French', 'Korean'
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget (₹200-500)', icon: '₹' },
    { value: 'moderate', label: 'Moderate (₹500-1500)', icon: '₹₹' },
    { value: 'premium', label: 'Premium (₹1500+)', icon: '₹₹₹' }
  ];

  const searchRestaurants = async () => {
    if (!searchParams.location) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search for restaurants.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/restaurants/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      });
      
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.restaurants || []);
        toast({
          title: "Restaurants Found",
          description: `Found ${data.restaurants?.length || 0} restaurants matching your criteria.`
        });
      } else {
        throw new Error('Failed to search restaurants');
      }
    } catch (error) {
      console.error('Restaurant search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search restaurants. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const bookRestaurant = async (restaurant) => {
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
        restaurant: restaurant,
        booking: {
          ...bookingDetails,
          ...searchParams,
          bookingId: `RES_${Date.now()}`,
          status: 'confirmed',
          bookingDate: new Date().toISOString()
        }
      };

      const response = await fetch('/api/restaurants/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description: `Your table at ${restaurant.name} has been reserved.`
        });
        
        if (onBookingComplete) {
          onBookingComplete(bookingData.booking);
        }
        
        // Reset form
        setSelectedRestaurant(null);
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

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Find & Book Restaurants
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
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Select value={searchParams.cuisine} onValueChange={(value) => setSearchParams(prev => ({ ...prev, cuisine: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineOptions.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
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
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={searchParams.time}
                onChange={(e) => setSearchParams(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Select value={searchParams.guests.toString()} onValueChange={(value) => setSearchParams(prev => ({ ...prev, guests: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={searchRestaurants} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching Restaurants...
              </>
            ) : (
              'Search Restaurants'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {restaurants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Restaurants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg">{restaurant.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{restaurant.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{restaurant.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.timings}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{restaurant.cuisine}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {restaurant.priceRange && (
                        <Badge variant="secondary">{restaurant.priceRange}</Badge>
                      )}
                      {restaurant.features?.map(feature => (
                        <Badge key={feature} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className="w-full"
                    >
                      Book Table
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedRestaurant && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-y-auto">
          <CardHeader>
            <CardTitle>Book Table at {selectedRestaurant.name}</CardTitle>
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
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  value={searchParams.guests}
                  disabled
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Input
                id="specialRequests"
                value={bookingDetails.specialRequests}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special dietary requirements or requests"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => bookRestaurant(selectedRestaurant)}
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
                onClick={() => setSelectedRestaurant(null)}
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