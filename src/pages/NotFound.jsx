import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Map } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-goginie-soft-purple to-white p-4 text-center">
      <div className="mb-6">
        <Compass size={60} className="text-goginie-primary mx-auto" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-6xl font-bold text-goginie-dark mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-6 text-goginie-dark">Page Not Found</h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        It seems like you've wandered off the beaten path. The page you're looking for might have been moved or doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button className="bg-goginie-primary hover:bg-goginie-secondary flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link to="/plan-trip">
          <Button variant="outline" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Plan a Trip
          </Button>
        </Link>
      </div>
      
      <div className="mt-12 text-sm text-muted-foreground">
        Need assistance?{" "}
        <Link to="/contact" className="text-goginie-primary hover:underline">
          Contact our support team
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
