import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch bookings from API
  const fetchBookings = async (userEmail = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = userEmail 
        ? `/api/bookings?userEmail=${userEmail}`
        : '/api/bookings';
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setBookings(result.data);
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userEmail = localStorage.getItem('currentUserEmail');
        const url = userEmail 
          ? `/api/bookings?userEmail=${userEmail}`
          : '/api/bookings';
        
        const response = await fetch(url, {
          signal: controller.signal
        });
        const result = await response.json();

        if (isMounted && result.success) {
          setBookings(result.data);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError('Failed to load bookings');
          console.error('Error fetching bookings:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  /**
   * create a new booking
   * @param {Object} bookingData
   * @returns {Promise<Object|null>}
   */
  const createBooking = async (bookingData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        setBookings(prev => [...prev, result.data]);
        return result.data;
      } else {
        console.error('Failed to create booking:', result.error);
        return null;
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      return null;
    }
  };

  /**
   * get booking by ID
   * @param {string} bookingId
   * @returns {Object|null}
   */
  const getBookingById = (bookingId) => {
    return bookings.find(b => b.bookingId === bookingId) || null;
  };

  /**
   * get bookings by facility ID
   * @param {string} facilityId
   * @returns {Array}
   */
  const getBookingsByFacility = (facilityId) => {
    return bookings.filter(b => b.facilityId === facilityId);
  };

  /**
   * get upcoming bookings
   * @returns {Array}
   */
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= now && booking.status === 'confirmed';
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  /**
   * get past bookings
   * @returns {Array}
   */
  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate < now || booking.status === 'completed';
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  /**
   * cancel a booking
   * @param {string} bookingId
   * @returns {Promise<boolean>}
   */
  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setBookings(prev =>
          prev.map(b =>
            b.bookingId === bookingId
              ? { ...b, status: 'cancelled', updatedAt: new Date().toISOString() }
              : b
          )
        );
        return true;
      } else {
        console.error('Failed to cancel booking:', result.error);
        return false;
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      return false;
    }
  };

  /**
   * update a booking
   * @param {string} bookingId
   * @param {Object} updates
   * @returns {Promise<boolean>}
   */
  const updateBooking = async (bookingId, updates) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (result.success) {
        setBookings(prev =>
          prev.map(b => (b.bookingId === bookingId ? result.data : b))
        );
        return true;
      } else {
        console.error('Failed to update booking:', result.error);
        return false;
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      return false;
    }
  };

  /**
   * check if a time slot is available
   * @param {string} facilityId
   * @param {string} date
   * @param {string} timeSlot
   * @returns {boolean}
   */
  const isTimeSlotAvailable = (facilityId, date, timeSlot) => {
    return !bookings.some(
      booking =>
        booking.facilityId === facilityId &&
        booking.date === date &&
        booking.timeSlot === timeSlot &&
        booking.status !== 'cancelled'
    );
  };

  const value = {
    bookings,
    loading,
    error,
    createBooking,
    getBookingById,
    getBookingsByFacility,
    getUpcomingBookings,
    getPastBookings,
    cancelBooking,
    updateBooking,
    isTimeSlotAvailable,
    fetchBookings, 
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

BookingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};