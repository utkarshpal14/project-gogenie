import { useState, useEffect } from 'react';

/**
 * Custom hook for managing booking state
 * Handles localStorage persistence and booking operations
 */
export const useBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('goGinieBookings') || '[]');
    setBookings(savedBookings);
    setLoading(false);
  }, []);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('goGinieBookings', JSON.stringify(bookings));
    }
  }, [bookings, loading]);

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: booking.status || 'confirmed'
    };
    
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBooking = (bookingId, updates) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, ...updates }
          : booking
      )
    );
  };

  const cancelBooking = (bookingId) => {
    updateBooking(bookingId, { status: 'cancelled' });
  };

  const deleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const getBookingById = (bookingId) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const getBookingsByType = (type) => {
    return bookings.filter(booking => booking.type === type);
  };

  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  const getTotalSpent = () => {
    return bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  };

  const getBookingStats = () => {
    return {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      pending: bookings.filter(b => b.status === 'pending').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalSpent: getTotalSpent()
    };
  };

  return {
    bookings,
    loading,
    addBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    getBookingById,
    getBookingsByType,
    getBookingsByStatus,
    getTotalSpent,
    getBookingStats
  };
};

export default useBooking; 