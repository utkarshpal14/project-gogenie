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
  Coffee,
  ThumbsUp,
  ThumbsDown,
  Edit,
  AlertCircle
} from "lucide-react";

export default function CompleteTripPlanner() {
  const [currentStep, setCurrentStep] = useState('input');
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

  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const interestOptions = [
    'Adventure', 'Sightseeing', 'Food & Dining', 'Culture & History', 
    'Nature & Wildlife', 'Beaches', 'Mountains', 'Nightlife', 
    'Shopping', 'Photography', 'Wellness & Spa', 'Sports'
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
    { value: 'car', label: 'Car', icon: Car }
  ];

  const foodOptions = [
    'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Local Cuisine', 
    'Fine Dining', 'Street Food', 'Mixed'
  ];

  const durationOptions = [
    { value: 1, label: '1 Day' },
    { value: 2, label: '2 Days' },
    { value: 3, label: '3 Days' },
    { value: 4, label: '4 Days' },
    { value: 5, label: '5 Days' },
    { value: 7, label: '1 Week' },
    { value: 10, label: '10 Days' },
    { value: 14, label: '2 Weeks' },
    { value: 21, label: '3 Weeks' },
    { value: 30, label: '1 Month' }
  ];

  // Get today's date for minimum date validation
  const today = new Date().toISOString().split('T')[0];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate duration if both dates are set
      if (field === 'departureDate' && newData.returnDate) {
        const depDate = new Date(value);
        const retDate = new Date(newData.returnDate);
        const diffTime = Math.abs(retDate - depDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newData.duration = diffDays > 0 ? diffDays : 1;
      } else if (field === 'returnDate' && newData.departureDate) {
        const depDate = new Date(newData.departureDate);
        const retDate = new Date(value);
        const diffTime = Math.abs(retDate - depDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        newData.duration = diffDays > 0 ? diffDays : 1;
      }
      
      return newData;
    });
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

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Trip Planned!",
        description: "Your trip has been planned successfully!",
      });
      console.log('Trip Data:', formData);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Trip Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Trip Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination*</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Where do you want to go?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startLocation">Starting From*</Label>
                  <Input
                    id="startLocation"
                    value={formData.startLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, startLocation: e.target.value }))}
                    placeholder="Your starting location"
                    required
                  />
                </div>
              </div>

              {/* DATE INPUTS - NEW SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date*</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    min={today}
                    value={formData.departureDate}
                    onChange={(e) => handleDateChange('departureDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    min={formData.departureDate || today}
                    value={formData.returnDate}
                    onChange={(e) => handleDateChange('returnDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days)*</Label>
                  <Select value={formData.duration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
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
                    min="1000"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Select value={formData.groupSize.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'Person' : 'People'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Summary */}
            {(formData.departureDate || formData.returnDate) && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Trip Dates Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Departure:</span>
                    <p className="text-blue-600">
                      {formData.departureDate ? new Date(formData.departureDate).toLocaleDateString() : 'Not selected'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Return:</span>
                    <p className="text-blue-600">
                      {formData.returnDate ? new Date(formData.returnDate).toLocaleDateString() : 'Not selected'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-blue-600">{formData.duration} days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preferred Transport */}
            <div className="space-y-4">
              <Label>Preferred Transport</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {transportOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, transportPreference: option.value }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                        formData.transportPreference === option.value
                          ? 'border-purple-500 bg-purple-500 text-white'
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
              <Label htmlFor="foodPreferences">Food Preferences</Label>
              <Select value={formData.foodPreferences} onValueChange={(value) => setFormData(prev => ({ ...prev, foodPreferences: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select food preference" />
                </SelectTrigger>
                <SelectContent>
                  {foodOptions.map(food => (
                    <SelectItem key={food} value={food}>
                      {food}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <Label>Interests</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {interestOptions.map(interest => (
                  <div
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                      formData.interests.includes(interest)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="h-4 w-4" />
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
                disabled={isProcessing || !formData.departureDate}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 disabled:opacity-50"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Planning Your Trip...
                  </>
                ) : (
                  <>
                    <Plane className="h-5 w-5 mr-2" />
                    Plan My Trip
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 