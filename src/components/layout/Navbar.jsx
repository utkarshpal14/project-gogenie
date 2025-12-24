
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, User, Menu, Calendar, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Compass size={30} className="text-goginie-primary" strokeWidth={2} />
          <span className="text-xl font-semibold text-goginie-dark">GoGinie</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-goginie-dark hover:text-goginie-primary transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-goginie-dark hover:text-goginie-primary transition-colors">
            Explore
          </Link>
          <Link to="/about" className="text-goginie-dark hover:text-goginie-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-goginie-dark hover:text-goginie-primary transition-colors">
            Contact
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/booking">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar size={18} />
                  Book Now
                </Button>
              </Link>
              <Link to="/my-bookings">
                <Button variant="outline" className="flex items-center gap-2">
                  <BookOpen size={18} />
                  My Bookings
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={18} />
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-goginie-primary hover:bg-goginie-secondary">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="flex flex-col gap-4 pt-10">
                <Link to="/" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md">
                  Home
                </Link>
                <Link to="/explore" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md">
                  Explore
                </Link>
                <Link to="/about" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md">
                  About
                </Link>
                <Link to="/contact" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md">
                  Contact
                </Link>
                <div className="border-t my-2"></div>
                {isAuthenticated ? (
                  <>
                    <Link to="/booking" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md flex items-center gap-2">
                      <Calendar size={18} />
                      Book Now
                    </Link>
                    <Link to="/my-bookings" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md flex items-center gap-2">
                      <BookOpen size={18} />
                      My Bookings
                    </Link>
                    <Link to="/dashboard" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md">
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md">
                      Login
                    </Link>
                    <Link to="/signup" className="text-lg font-medium py-2 px-4 hover:bg-muted rounded-md">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
