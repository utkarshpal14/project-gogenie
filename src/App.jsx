import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PlanTrip from "./pages/PlanTrip";
import TripResult from "./pages/TripResult";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import MoodBasedTrip from "./pages/MoodBasedTrip";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/plan-trip" element={
              <ProtectedRoute>
                <Layout><PlanTrip /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/trip-result" element={
              <ProtectedRoute>
                <Layout><TripResult /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/booking" element={
              <ProtectedRoute>
                <Layout><Booking /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <Layout><MyBookings /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/mood-trip" element={
              <ProtectedRoute>
                <Layout><MoodBasedTrip /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/explore" element={<Layout><Explore /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
