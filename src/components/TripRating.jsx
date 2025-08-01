import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

export default function TripRating({ tripId, tripName, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Please give your trip a star rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      toast({
        title: "Thank you for your feedback!",
        description: "Your rating has been submitted successfully.",
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Rate Your Trip</CardTitle>
        <CardDescription>
          How was your experience with <span className="font-medium">{tripName}</span>?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((starNumber) => (
              <button
                key={starNumber}
                type="button"
                onClick={() => setRating(starNumber)}
                onMouseEnter={() => setHoveredRating(starNumber)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1"
              >
                <Star
                  size={32}
                  className={`${
                    starNumber <= (hoveredRating || rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium mb-2">
            Share your experience (optional)
          </label>
          <Textarea
            id="feedback"
            placeholder="Tell us about your trip experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </CardFooter>
    </Card>
  );
}
