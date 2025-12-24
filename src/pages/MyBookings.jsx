import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "flight", label: "Flights" },
    { value: "train", label: "Trains" },
    { value: "cab", label: "Cabs" },
    { value: "hotel", label: "Hotels" },
    { value: "restaurant", label: "Restaurants" }
  ];

  useEffect(() => {
    // Load bookings from localStorage or API
    const savedBookings = JSON.parse(localStorage.getItem('goGinieBookings') || '[]');
    setBookings(savedBookings);
    setFilteredBookings(savedBookings);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter bookings based on search and filters
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(booking => booking.type === typeFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, typeFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'flight':
        return '✈️';
      case 'train':
        return '🚂';
      case 'cab':
        return '🚗';
      case 'hotel':
        return '🏨';
      case 'restaurant':
        return '🍽️';
      default:
        return '📅';
    }
  };

  const cancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      
      // Update localStorage
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      localStorage.setItem('goGinieBookings', JSON.stringify(updatedBookings));
    }
  };

  const downloadBooking = (booking) => {
    // Create a simple text receipt
    const receipt = `
GoGinie Booking Receipt
=======================

Booking ID: ${booking.bookingId || booking.id}
Type: ${booking.type?.charAt(0).toUpperCase() + booking.type?.slice(1)}
Status: ${booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
Date: ${new Date(booking.bookingDate || booking.timestamp).toLocaleDateString()}

${booking.totalAmount ? `Total Amount: ₹${booking.totalAmount.toLocaleString()}` : ''}

Thank you for choosing GoGinie!
    `;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.bookingId || booking.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-xl text-gray-600">
            Manage and track all your travel bookings in one place
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {bookings.length === 0 
                  ? "You haven't made any bookings yet. Start booking your travel!"
                  : "No bookings match your current filters."
                }
              </p>
              {bookings.length === 0 && (
                <Button onClick={() => window.location.href = '/booking'}>
                  Start Booking
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">
                        {getTypeIcon(booking.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {booking.type?.charAt(0).toUpperCase() + booking.type?.slice(1)} Booking
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.bookingDate || booking.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>ID: {booking.bookingId || booking.id}</span>
                          </div>
                          
                          {booking.totalAmount && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-600">
                                ₹{booking.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {booking.name && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Booked by:</span> {booking.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadBooking(booking)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {bookings.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 