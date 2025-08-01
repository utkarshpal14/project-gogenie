
import { Link } from "react-router-dom";
import { Compass, Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-goginie-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Compass size={30} className="text-goginie-primary" strokeWidth={2} />
              <span className="text-xl font-semibold">GoGinie</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-xs">
              Your AI-powered travel companion. Plan your perfect trip with just a few clicks.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-300 hover:text-goginie-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-goginie-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-goginie-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-goginie-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/hotels" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  Hotel Bookings
                </Link>
              </li>
              <li>
                <Link to="/services/flights" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  Flight Bookings
                </Link>
              </li>
              <li>
                <Link to="/services/restaurants" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  Restaurant Recommendations
                </Link>
              </li>
              <li>
                <Link to="/services/activities" className="text-gray-300 hover:text-goginie-primary transition-colors">
                  Activities & Tours
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-goginie-primary" />
                <span className="text-gray-300">support@goginie.com</span>
              </li>
              <li>
                <p className="text-gray-300">
                  123 Travel Street, <br />
                  Explore City, EC 12345
                </p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 GoGinie. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 text-sm hover:text-goginie-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 text-sm hover:text-goginie-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 text-sm hover:text-goginie-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
