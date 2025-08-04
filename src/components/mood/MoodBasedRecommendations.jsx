
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  MapPin,
  Clock, 
  Users, 
  Info, 
  Wallet, 
  Check,
  BarChart4, 
  Lightbulb,
  Coffee,
  Mountain,
  Heart,
  Utensils,
  Moon,
  Sun,
  Brain,
  Zap
} from "lucide-react";
import Map from "@/components/Map";
import { generateMoodBasedRecommendations } from "@/services/ai";

// Get icon based on mood
const getMoodIcon = (mood) => {
  switch (mood) {
    case "adventurous": return <Mountain className="h-5 w-5 text-yellow-500" />;
    case "relaxed": return <Coffee className="h-5 w-5 text-blue-500" />;
    case "romantic": return <Heart className="h-5 w-5 text-pink-500" />;
    case "hungry": return <Utensils className="h-5 w-5 text-orange-500" />;
    case "tired": return <Moon className="h-5 w-5 text-indigo-500" />;
    case "energetic": return <Sun className="h-5 w-5 text-red-500" />;
    default: return <Sun className="h-5 w-5" />;
  }
};

export default function MoodBasedRecommendations({ formData, onReset }) {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useEffect(() => {
    // Fetch AI-powered recommendations based on mood, location and time period
    const fetchRecommendations = async () => {
      try {
        // Generate AI-powered mood-based recommendations
        const aiResponse = await generateMoodBasedRecommendations(
          formData.mood, 
          formData.location, 
          formData.timePeriod
        );
        
        if (aiResponse) {
          setRecommendations(aiResponse.activities || []);
          setSelectedRecommendation(aiResponse.activities?.[0] || null);
        } else {
          // Fallback to mock data if AI fails
          const mockData = {
            adventurous: [
              {
                id: 1,
                title: "Mountain Hiking Trail",
                description: "An exhilarating hike with beautiful views of the valley below, perfect for adventurous souls looking for a challenge.",
                category: "Outdoor Activity",
                imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.505, -0.09],
                duration: "3-4 hours",
                crowdLevel: 4,
                priceLevel: 1,
                localTip: "The west trail is less crowded but more challenging. Locals recommend starting early to catch the morning mist over the valley.",
                distance: "5.2 km"
              },
              {
                id: 2,
                title: "Rock Climbing Center",
                description: "Test your strength and agility on various climbing walls ranging from beginner to expert levels.",
                category: "Adventure Sports",
                imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2093&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.515, -0.1],
                duration: "1-2 hours",
                crowdLevel: 6,
                priceLevel: 2,
                localTip: "Tuesday evenings are usually less crowded. Ask for Alex at the front desk - he gives the best pointers for beginners.",
                distance: "3.1 km"
              },
              {
                id: 3,
                title: "Kayaking Adventure",
                description: "Paddle through scenic waterways and discover hidden coves not accessible by foot.",
                category: "Water Activity",
                imageUrl: "https://images.unsplash.com/photo-1603114595741-3302a2af0833?q=80&w=2070&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.495, -0.11],
                duration: "2-3 hours",
                crowdLevel: 3,
                priceLevel: 2,
                localTip: "The sunset tour is magical but books up quickly. The morning tours often spot more wildlife including river otters.",
                distance: "7.8 km"
              }
            ],
            relaxed: [
              {
                id: 4,
                title: "Tranquil Garden Park",
                description: "A peaceful oasis in the city with beautiful flower arrangements and quiet walking paths.",
                category: "Parks & Gardens",
                imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2069&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.525, -0.08],
                duration: "1-2 hours",
                crowdLevel: 2,
                priceLevel: 1,
                localTip: "There's a hidden meditation spot near the east pond that even locals don't all know about. Bring bread to feed the koi fish!",
                distance: "4.3 km"
              },
              {
                id: 5,
                title: "Seaside Reading Café",
                description: "Combine great books with greater coffee in this cozy café with ocean views.",
                category: "Café",
                imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=2071&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.535, -0.07],
                duration: "1-3 hours",
                crowdLevel: 5,
                priceLevel: 2,
                localTip: "Ask for their off-menu 'Writer's Block' coffee - it's a special blend with a hint of cinnamon and chocolate.",
                distance: "1.5 km"
              }
            ],
            romantic: [
              {
                id: 6,
                title: "Sunset Vineyard Tour",
                description: "Stroll through picturesque vineyards and enjoy wine tasting as the sun sets over the hills.",
                category: "Tour & Tasting",
                imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.515, -0.05],
                duration: "3 hours",
                crowdLevel: 4,
                priceLevel: 3,
                localTip: "Reserve the private balcony area for the most romantic setting. Their house red wine pairs perfectly with the local cheese plate.",
                distance: "8.7 km"
              }
            ],
            hungry: [
              {
                id: 7,
                title: "Local Food Market",
                description: "Sample a variety of local cuisines and street food from award-winning vendors.",
                category: "Food Market",
                imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2787&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.495, -0.02],
                duration: "1-2 hours",
                crowdLevel: 8,
                priceLevel: 2,
                localTip: "The stall at the far corner with the blue awning serves the best dumplings in town, but they usually sell out by 2 PM.",
                distance: "3.3 km"
              }
            ],
            tired: [
              {
                id: 8,
                title: "Relaxation Spa Retreat",
                description: "Rejuvenate with massages, facials, and a hydrothermal pool in this award-winning spa.",
                category: "Spa & Wellness",
                imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.505, -0.01],
                duration: "2-4 hours",
                crowdLevel: 3,
                priceLevel: 3,
                localTip: "Book the 'Local Revival' package which includes treatments using ingredients sourced from the region.",
                distance: "5.9 km"
              }
            ],
            energetic: [
              {
                id: 9,
                title: "Beachside Volleyball",
                description: "Join locals for a game of beach volleyball on this popular sandy stretch.",
                category: "Beach Activity",
                imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2007&auto=format&fit=crop",
                location: formData.location,
                coordinates: [51.525, -0.03],
                duration: "1-2 hours",
                crowdLevel: 7,
                priceLevel: 1,
                localTip: "Sunday mornings have informal tournaments that visitors can join. Bring water - the beach kiosks charge tourist prices!",
                distance: "2.8 km"
              }
            ]
          };
          
          // Get recommendations based on mood
          const moodBasedRecs = mockData[formData.mood] || [];
          
          // If we have recommendations, set the first one as selected by default
          if (moodBasedRecs.length > 0) {
            setSelectedRecommendation(moodBasedRecs[0]);
          }
          
          setRecommendations(moodBasedRecs);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        // Fallback to mock data on error
        const mockData = {
          adventurous: [
            {
              id: 1,
              title: "Mountain Hiking Trail",
              description: "An exhilarating hike with beautiful views of the valley below, perfect for adventurous souls looking for a challenge.",
              category: "Outdoor Activity",
              imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
              location: formData.location,
              coordinates: [51.505, -0.09],
              duration: "3-4 hours",
              crowdLevel: 4,
              priceLevel: 1,
              localTip: "The west trail is less crowded but more challenging. Locals recommend starting early to catch the morning mist over the valley.",
              distance: "5.2 km"
            }
          ],
          relaxed: [
            {
              id: 4,
              title: "Tranquil Garden Park",
              description: "A peaceful oasis in the city with beautiful flower arrangements and quiet walking paths.",
              category: "Parks & Gardens",
              imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=2069&auto=format&fit=crop",
              location: formData.location,
              coordinates: [51.525, -0.08],
              duration: "1-2 hours",
              crowdLevel: 2,
              priceLevel: 1,
              localTip: "There's a hidden meditation spot near the east pond that even locals don't all know about. Bring bread to feed the koi fish!",
              distance: "4.3 km"
            }
          ],
          romantic: [
            {
              id: 6,
              title: "Sunset Vineyard Tour",
              description: "Stroll through picturesque vineyards and enjoy wine tasting as the sun sets over the hills.",
              category: "Tour & Tasting",
              imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop",
              location: formData.location,
              coordinates: [51.515, -0.05],
              duration: "2-3 hours",
              crowdLevel: 3,
              priceLevel: 3,
              localTip: "The sunset tour is magical but books up quickly. The morning tours often spot more wildlife including river otters.",
              distance: "8.7 km"
            }
          ],
          hungry: [
            {
              id: 7,
              title: "Local Food Market",
              description: "Explore the vibrant local food scene with fresh produce, street food, and authentic local cuisine.",
              category: "Food & Dining",
              imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop",
              location: formData.location,
              coordinates: [51.495, -0.12],
              duration: "1-2 hours",
              crowdLevel: 8,
              priceLevel: 1,
              localTip: "The market is busiest on weekends. Try the food stalls at the back - they're less touristy and more authentic.",
              distance: "2.1 km"
            }
          ],
          tired: [
            {
              id: 8,
              title: "Cozy Bookstore Café",
              description: "A quiet retreat with comfortable seating, good coffee, and a vast collection of books to browse.",
              category: "Café & Relaxation",
              imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2028&auto=format&fit=crop",
              location: formData.location,
              coordinates: [51.505, -0.08],
              duration: "1-3 hours",
              crowdLevel: 2,
              priceLevel: 2,
              localTip: "The upstairs reading room is the quietest spot. They have a great selection of travel books and local guides.",
              distance: "1.8 km"
            }
          ],
          energetic: [
            {
              id: 9,
              title: "Beach Volleyball Courts",
              description: "Join a game or start your own on the sandy courts by the beach. Perfect for burning off energy!",
              category: "Sports & Recreation",
              imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
              location: formData.location,
              coordinates: [51.535, -0.07],
              duration: "1-2 hours",
              crowdLevel: 7,
              priceLevel: 1,
              localTip: "Sunday mornings have informal tournaments that visitors can join. Bring water - the beach kiosks charge tourist prices!",
              distance: "2.8 km"
            }
          ]
        };
        
        const moodBasedRecs = mockData[formData.mood] || [];
        
        if (moodBasedRecs.length > 0) {
          setSelectedRecommendation(moodBasedRecs[0]);
        }
        
        setRecommendations(moodBasedRecs);
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [formData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onReset} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Preferences
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Your mood:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {getMoodIcon(formData.mood)}
            {formData.mood.charAt(0).toUpperCase() + formData.mood.slice(1)}
          </Badge>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[250px] w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[100px] w-full rounded-lg" />
            <Skeleton className="h-[100px] w-full rounded-lg" />
          </div>
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
      ) : recommendations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">No recommendations found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              We couldn't find any recommendations for your current mood in this location.
              Try changing your mood or location for more options.
            </p>
            <Button onClick={onReset}>Change Preferences</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-medium text-lg">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <Card 
                  key={rec.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRecommendation?.id === rec.id ? 'border-goginie-primary border-2' : ''
                  }`}
                  onClick={() => setSelectedRecommendation(rec)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-16 w-16 rounded-md bg-center bg-cover" 
                        style={{ backgroundImage: `url(${rec.imageUrl})` }}
                      />
                      <div>
                        <h4 className="font-medium line-clamp-1">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{rec.category}</p>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <MapPin className="h-3 w-3 text-goginie-primary" />
                          <span>{rec.distance} away</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            {selectedRecommendation && (
              <>
                <Card>
                  <div className="relative h-48 md:h-64 w-full rounded-t-lg overflow-hidden">
                    <img 
                      src={selectedRecommendation.imageUrl}
                      alt={selectedRecommendation.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{selectedRecommendation.title}</CardTitle>
                    <CardDescription>{selectedRecommendation.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{selectedRecommendation.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedRecommendation.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedRecommendation.distance} away</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Crowd Level</span>
                          </div>
                          <span className="text-sm">{selectedRecommendation.crowdLevel}/10</span>
                        </div>
                        <Progress value={selectedRecommendation.crowdLevel * 10} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span>Price Level: {Array(selectedRecommendation.priceLevel).fill('₹').join('')}</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-md flex gap-3 mt-4">
                      <div className="mt-1">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Local Tip</h4>
                        <p className="text-sm text-muted-foreground">{selectedRecommendation.localTip}</p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-medium mb-2">Location</h4>
                      <Map 
                        startLocation={formData.location} 
                        destination={selectedRecommendation.title} 
                        className="h-[200px] w-full" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button variant="outline" className="flex-1">
                      <BarChart4 className="mr-2 h-4 w-4" />
                      View Similar
                    </Button>
                    <Button className="flex-1 bg-goginie-primary hover:bg-goginie-secondary">
                      <Check className="mr-2 h-4 w-4" />
                      Add to My Trip
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
