import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  Brain, 
  Zap, 
  Send, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Sparkles,
  Loader2
} from "lucide-react";
import { processNaturalLanguageRequest } from "@/services/ai";

export default function AITripPlanner({ onTripDataExtracted }) {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      toast({
        title: "Please describe your trip",
        description: "Tell us where you want to go and what you'd like to do!",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setConfidence(0);

    try {
      // Process natural language request with AI
      const result = await processNaturalLanguageRequest(userInput);
      
      if (result) {
        setExtractedData(result);
        setConfidence(result.confidence * 100);
        
        toast({
          title: "Trip Details Extracted! 🧠",
          description: "AI has analyzed your request and extracted the key details.",
        });

        // Pass extracted data to parent component
        if (onTripDataExtracted) {
          onTripDataExtracted(result);
        }
      } else {
        toast({
          title: "Could not process request",
          description: "Please try describing your trip in a different way.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      toast({
        title: "Processing failed",
        description: "Please try again or use the manual form.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const examplePrompts = [
    "I want to go to Paris for 5 days with a budget of $2000. I love culture and food, traveling with my partner.",
    "Planning a family trip to Tokyo for 7 days, budget $3000. We have 2 kids and want to see anime culture and try local food.",
    "Solo backpacking trip to Thailand for 10 days, budget $1500. I'm adventurous and want to explore nature and local markets.",
    "Business trip to New York for 3 days, budget $1000. Need a hotel near Times Square and good restaurants for meetings."
  ];

  const handleExampleClick = (example) => {
    setUserInput(example);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-goginie-primary" />
            <CardTitle>AI Trip Planner</CardTitle>
            <Badge variant="secondary" className="ml-auto">
              <Zap className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Describe your dream trip in natural language and let AI extract all the details for you!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Describe Your Trip
              </label>
              <Textarea
                placeholder="e.g., I want to go to Paris for 5 days with a budget of $2000. I love culture and food, traveling with my partner."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[120px]"
                disabled={isProcessing}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-goginie-primary hover:bg-goginie-secondary"
              disabled={isProcessing || !userInput.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI is analyzing your request...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Extract Trip Details
                </>
              )}
            </Button>
          </form>

          {/* Example prompts */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-3 text-xs"
                  onClick={() => handleExampleClick(example)}
                  disabled={isProcessing}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing indicator */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-goginie-primary animate-pulse" />
                <span className="font-medium">AI is analyzing your request...</span>
              </div>
              <Progress value={confidence} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Extracting destination, dates, budget, and preferences...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted data display */}
      {extractedData && !isProcessing && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              <CardTitle>Extracted Trip Details</CardTitle>
              <Badge variant="outline" className="ml-auto">
                {confidence.toFixed(0)}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extractedData.destination && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{extractedData.destination}</p>
                  </div>
                </div>
              )}
              
              {extractedData.duration && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{extractedData.duration} days</p>
                  </div>
                </div>
              )}
              
              {extractedData.budget && (
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Budget</p>
                    <p className="text-sm text-muted-foreground">${extractedData.budget}</p>
                  </div>
                </div>
              )}
              
              {extractedData.groupSize && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Group Size</p>
                    <p className="text-sm text-muted-foreground">{extractedData.groupSize} people</p>
                  </div>
                </div>
              )}
            </div>

            {extractedData.interests && extractedData.interests.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Interests</p>
                <div className="flex flex-wrap gap-1">
                  {extractedData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {extractedData.specialRequirements && extractedData.specialRequirements.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Special Requirements</p>
                <div className="flex flex-wrap gap-1">
                  {extractedData.specialRequirements.map((req, index) => (
                    <Badge key={index} variant="outline">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <Button 
                onClick={() => {
                  setExtractedData(null);
                  setUserInput("");
                  setConfidence(0);
                }}
                variant="outline"
              >
                Start Over
              </Button>
              <Button 
                onClick={() => onTripDataExtracted && onTripDataExtracted(extractedData)}
                className="bg-goginie-primary hover:bg-goginie-secondary"
              >
                Use This Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 