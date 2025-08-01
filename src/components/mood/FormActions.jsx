
import { Button } from "@/components/ui/button";
import { Compass, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FormActions({ isSubmitting = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Button 
        type="submit" 
        className="flex-1 bg-goginie-primary hover:bg-goginie-secondary"
        disabled={isSubmitting}
      >
        <Compass className="mr-2 h-5 w-5" />
        Find Perfect Activities
      </Button>
      <Button 
        type="button" 
        variant="outline"
        className="flex-1"
        onClick={() => navigate("/explore")}
      >
        <MapPin className="mr-2 h-5 w-5" />
        Explore Destinations
      </Button>
    </div>
  );
}
