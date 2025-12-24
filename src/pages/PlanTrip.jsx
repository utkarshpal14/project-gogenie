import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Heart,
  Plane,
  Loader2,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { generateSmartItinerary } from "@/services/ai";
import AutonomousTripAgent from "@/components/booking/AutonomousTripAgent";

export default function PlanTrip() {
  const [formData, setFormData] = useState({
    destination: '',
    startLocation: '',
    duration: 3,
    budget: 50000,
    interests: [],
    travelStyle: 'comfortable',
    groupSize: 2,
    foodPreferences: 'mixed',
    transportPreference: 'flight',
    departureDate: '',
    returnDate: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAutonomousAgent, setShowAutonomousAgent] = useState(false);
  const [tripResult, setTripResult] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const interestOptions = [
    'Adventure', 'Sightseeing', 'Food & Dining', 'Culture & History',
    'Nature & Wildlife', 'Beaches', 'Mountains', 'Nightlife',
    'Shopping', 'Photography', 'Wellness & Spa', 'Sports'
  ];

  const travelStyles = [
    { value: 'budget', label: 'Budget', description: 'Affordable options' },
    { value: 'comfort', label: 'Comfort', description: 'Good value for money' },
    { value: 'luxury', label: 'Luxury', description: 'Premium experiences' }
  ];

  const transportOptions = [
    { value: 'flight', label: 'Flight', icon: '✈️' },
    { value: 'train', label: 'Train', icon: '🚂' },
    { value: 'bus', label: 'Bus', icon: '🚌' },
    { value: 'car', label: 'Car', icon: '🚗' }
  ];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startLocation || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Show autonomous agent instead of manual planning
      setShowAutonomousAgent(true);
      
    } catch (error) {
      console.error('Trip planning error:', error);
      toast({
        title: "Planning Failed",
        description: "Failed to create your trip plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutonomousComplete = (completeTrip) => {
    setTripResult(completeTrip);
    toast({
      title: "🎉 Trip Complete!",
      description: "Your entire trip has been planned and booked automatically!",
    });
  };

  if (showAutonomousAgent) {
    return (
      <AutonomousTripAgent 
        userPreferences={formData}
        onComplete={handleAutonomousComplete}
      />
    );
  }

  const handleDirectBooking = () => {
    if (tripResult) {
      navigate('/booking', { 
        state: { 
          tripData: tripResult,
          fromPlanning: true 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your dream destination and we'll create a personalized itinerary for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trip Planning Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination & Start Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="Where do you want to go?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startLocation">Starting From *</Label>
                    <Input
                      id="startLocation"
                      value={formData.startLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, startLocation: e.target.value }))}
                      placeholder="Your starting location"
                      required
                    />
                  </div>
                </div>

                {/* Duration & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (Days) *</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(days => (
                          <SelectItem key={days} value={days.toString()}>
                            {days} {days === 1 ? 'Day' : 'Days'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (INR)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Your budget"
                    />
                  </div>
                </div>

                {/* Group Size & Travel Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(size => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} {size === 1 ? 'Person' : 'People'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelStyle">Travel Style</Label>
                    <Select value={formData.travelStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, travelStyle: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travel style" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelStyles.map(style => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label} - {style.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Transport Preference */}
                <div className="space-y-2">
                  <Label>Preferred Transport</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {transportOptions.map(transport => (
                      <Button
                        key={transport.value}
                        type="button"
                        variant={formData.transportPreference === transport.value ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, transportPreference: transport.value }))}
                        className="flex items-center gap-2"
                      >
                        <span>{transport.icon}</span>
                        {transport.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Food Preferences */}
                <div className="space-y-2">
                  <Label htmlFor="foodPreferences">Food Preferences</Label>
                  <Select value={formData.foodPreferences} onValueChange={(value) => setFormData(prev => ({ ...prev, foodPreferences: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select food preferences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Cuisine</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="local">Local Cuisine</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {interestOptions.map(interest => (
                      <Button
                        key={interest}
                        type="button"
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        onClick={() => handleInterestToggle(interest)}
                        size="sm"
                        className="justify-start"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-goginie-primary hover:bg-goginie-secondary"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Planning Your Trip...
                    </>
                  ) : (
                    <>
                      <Plane className="h-4 w-4 mr-2" />
                      Plan My Trip
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Trip Result Preview */}
          {tripResult && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Trip Planned Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Destination</p>
                    <p className="font-semibold">{tripResult.destination}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{tripResult.duration} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Group Size</p>
                    <p className="font-semibold">{tripResult.groupSize} people</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">₹{tripResult.budget?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200">
                  <p className="text-sm text-green-700 mb-3">
                    🎉 Your personalized itinerary has been created! 
                    You'll be redirected to the booking page automatically.
                  </p>
                  
                  <Button
                    onClick={handleDirectBooking}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Booking Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
