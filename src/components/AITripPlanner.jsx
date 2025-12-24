import { useState } from "react";
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
  Plane,
  Train,
  Car,
  Hotel,
  Utensils,
  Clock,
  Star,
  Loader2,
  Bot,
  CheckCircle,
  ArrowRight,
  Globe,
  Camera,
  Heart,
  Coffee
} from "lucide-react";

// Import AI service
import { generateSmartItinerary } from "@/services/ai";

export default function AITripPlanner() {
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
  const [tripItinerary, setTripItinerary] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const interestOptions = [
    'Adventure', 'Culture', 'Nature', 'Food', 'History', 
    'Nightlife', 'Shopping', 'Beach', 'Mountains', 'Art', 'Music', 'Photography'
  ];

  const travelStyles = [
    { value: 'budget', label: 'Budget Travel' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'backpacking', label: 'Backpacking' }
  ];

  const transportOptions = [
    { value: 'flight', label: 'Flight', icon: Plane },
    { value: 'train', label: 'Train', icon: Train },
    { value: 'bus', label: 'Bus', icon: Car },
    { value: 'mixed', label: 'Mixed Transport' }
  ];

  const foodOptions = [
    'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Local Cuisine', 
    'Fine Dining', 'Street Food', 'Mixed'
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
    
    if (!formData.destination || !formData.startLocation || !formData.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in destination, start location, and departure date.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      // Generate itinerary using AI
      const itinerary = await generateSmartItinerary({
        ...formData,
        detailedPlanning: true,
        includeBooking: false
      });

      if (itinerary) {
        setTripItinerary(itinerary);
        setShowResults(true);
        
        toast({
          title: "🎉 Itinerary Generated!",
          description: "AI has created your perfect travel plan",
        });
      } else {
        throw new Error('Failed to generate itinerary');
      }
    } catch (error) {
      console.error('Itinerary generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInterestIcon = (interest) => {
    const iconMap = {
      'Adventure': '🏔️',
      'Culture': '��️',
      'Nature': '🌿',
      'Food': '🍽️',
      'History': '📚',
      'Nightlife': '🌃',
      'Shopping': '🛍️',
      'Beach': '🏖️',
      'Mountains': '⛰️',
      'Art': '🎨',
      'Music': '🎵',
      'Photography': '📸'
    };
    return iconMap[interest] || '🌟';
  };

  const getActivityIcon = (activity) => {
    if (activity.toLowerCase().includes('eat') || activity.toLowerCase().includes('food') || activity.toLowerCase().includes('restaurant')) {
      return <Utensils className="h-4 w-4" />;
    } else if (activity.toLowerCase().includes('hotel') || activity.toLowerCase().includes('stay')) {
      return <Hotel className="h-4 w-4" />;
    } else if (activity.toLowerCase().includes('flight') || activity.toLowerCase().includes('airport')) {
      return <Plane className="h-4 w-4" />;
    } else if (activity.toLowerCase().includes('train') || activity.toLowerCase().includes('station')) {
      return <Train className="h-4 w-4" />;
    } else if (activity.toLowerCase().includes('visit') || activity.toLowerCase().includes('tour')) {
      return <Camera className="h-4 w-4" />;
    } else if (activity.toLowerCase().includes('shop') || activity.toLowerCase().includes('market')) {
      return <Globe className="h-4 w-4" />;
    } else {
      return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bot className="h-8 w-8" />
            AI-Powered Trip Planner
          </CardTitle>
          <p className="text-blue-100">
            Tell us your preferences and let AI create the perfect itinerary for you
          </p>
        </CardHeader>
      </Card>

      {!showResults ? (
        /* Input Form */
        <Card>
          <CardHeader>
            <CardTitle>Your Travel Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Where do you want to go?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startLocation">Starting Location</Label>
                  <Input
                    id="startLocation"
                    value={formData.startLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, startLocation: e.target.value }))}
                    placeholder="Where are you starting from?"
                    required
                  />
                </div>
              </div>

              {/* Dates and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              {/* Budget and Group */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="1000"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.groupSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelStyle">Travel Style</Label>
                  <Select value={formData.travelStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, travelStyle: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {travelStyles.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transport Preference */}
              <div className="space-y-2">
                <Label>Transport Preference</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {transportOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <div
                        key={option.value}
                        onClick={() => setFormData(prev => ({ ...prev, transportPreference: option.value }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.transportPreference === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Food Preferences */}
              <div className="space-y-2">
                <Label>Food Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {foodOptions.map(food => (
                    <div
                      key={food}
                      onClick={() => setFormData(prev => ({ ...prev, foodPreferences: food }))}
                      className={`p-2 border rounded-lg cursor-pointer text-center transition-all ${
                        formData.foodPreferences === food
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm">{food}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label>Your Interests (Select Multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {interestOptions.map(interest => (
                    <div
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.interests.includes(interest)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{getInterestIcon(interest)}</span>
                        <span className="text-sm">{interest}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      AI is Planning Your Trip...
                    </>
                  ) : (
                    <>
                      <Bot className="h-5 w-5 mr-2" />
                      Generate AI Itinerary
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Results Display */
        <div className="space-y-6">
          {/* Trip Overview */}
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Your AI-Generated Trip Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="text-sm opacity-90">Destination</p>
                    <p className="font-semibold">{formData.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-sm opacity-90">Duration</p>
                    <p className="font-semibold">{formData.duration} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <div>
                    <p className="text-sm opacity-90">Group Size</p>
                    <p className="font-semibold">{formData.groupSize} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <div>
                    <p className="text-sm opacity-90">Budget</p>
                    <p className="font-semibold">₹{formData.budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day-by-Day Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Day-by-Day Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {tripItinerary?.itinerary?.map((day, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50">
                        {day.day || `Day ${index + 1}`}
                      </Badge>
                      <span className="text-lg">{day.date}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              {getActivityIcon(activity.activity || activity.description)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-blue-600">{activity.time}</span>
                              {activity.cost && (
                                <Badge variant="outline" className="ml-auto">
                                  ₹{activity.cost}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {activity.activity || activity.description}
                            </h4>
                            {activity.location && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Budget Breakdown */}
          {tripItinerary?.budgetBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(tripItinerary.budgetBreakdown).map(([category, amount]) => (
                    <div key={category} className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600 capitalize">{category}</p>
                      <p className="text-2xl font-bold text-blue-600">₹{amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {tripItinerary?.recommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotels */}
              {tripItinerary.recommendations.hotels && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hotel className="h-5 w-5" />
                      Recommended Hotels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tripItinerary.recommendations.hotels.map((hotel, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{hotel.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{hotel.priceRange}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Restaurants */}
              {tripItinerary.recommendations.restaurants && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Recommended Restaurants
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tripItinerary.recommendations.restaurants.map((restaurant, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{restaurant.name}</h4>
                          <Badge variant="outline">{restaurant.cuisine}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{restaurant.priceRange}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Packing List */}
          {tripItinerary?.packingList && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Packing List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tripItinerary.packingList.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Local Tips */}
          {tripItinerary?.localTips && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5" />
                  Local Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tripItinerary.localTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Button 
              onClick={() => setShowResults(false)}
              variant="outline"
              size="lg"
            >
              Plan Another Trip
            </Button>
            <Button 
              onClick={() => {
                // Here you can add functionality to save or share the itinerary
                toast({
                  title: "Itinerary Saved!",
                  description: "Your trip plan has been saved successfully.",
                });
              }}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Save This Itinerary
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 