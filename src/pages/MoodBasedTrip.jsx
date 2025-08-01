import { useState } from "react";
import MoodForm from "@/components/mood/MoodForm";
import MoodBasedRecommendations from "@/components/mood/MoodBasedRecommendations";

export default function MoodBasedTrip() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const handleFormSubmit = (values) => {
    setFormData(values);
    setShowRecommendations(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Mood-Based Travel Recommendations</h1>
          <p className="text-muted-foreground">
            Tell us how you're feeling and we'll suggest the perfect activities for your current mood
          </p>
        </div>
        
        {!showRecommendations ? (
          <MoodForm onSubmitSuccess={handleFormSubmit} />
        ) : (
          <MoodBasedRecommendations
            formData={formData}
            onReset={() => setShowRecommendations(false)}
          />
        )}
      </div>
    </div>
  );
}
