import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '@/services/api';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);


  const mapBooking = (booking) => {
    const facilityLocation = booking.facility 
      ? `${booking.facility.building_name}${booking.facility.floor ? ', Floor ' + booking.facility.floor : ''}${booking.facility.city?.city_name ? ', ' + booking.facility.city.city_name : ''}${booking.facility.city?.state?.state_name ? ', ' + booking.facility.city.state.state_name : ''}`
      : 'N/A';
    
    return {

      id: booking.booking_id,
      userId: booking.user_id,
      facilityId: booking.facility_id,
      facilityName: booking.facility?.facility_name || 'Unknown Facility',
      facilityLocation: facilityLocation,
      buildingName: booking.facility?.building_name || 'N/A',
      floor: booking.facility?.floor || 'N/A',
      cityName: booking.facility?.city?.city_name || 'N/A',
      stateName: booking.facility?.city?.state?.state_name || 'N/A',
      categoryName: booking.facility?.category?.category_name || 'N/A',
      userName: booking.user?.name || 'N/A',
      userEmail: booking.user?.email || 'N/A',
      date: booking.booking_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      status: booking.booking_status,
      createdAt: booking.created_at,
      

      booking_id: booking.booking_id,
      user_id: booking.user_id,
      facility_id: booking.facility_id,
      booking_date: booking.booking_date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      booking_status: booking.booking_status,
      created_at: booking.created_at,

      facility: booking.facility,
      user: booking.user,

      _raw: booking
    };
  };

  const fetchBookings = async (filters = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filters.facility_id) queryParams.append('facility_id', filters.facility_id);
      if (filters.booking_status) queryParams.append('booking_status', filters.booking_status);
      if (filters.booking_date) queryParams.append('booking_date', filters.booking_date);
      if (filters.user_id) queryParams.append('user_id', filters.user_id);
      
      const response = await api.get(`/bookings?${queryParams.toString()}`);
      
      console.log('📊 API Response:', response.data);
      
      const mappedBookings = response.data.data.map(mapBooking);
      
      console.log('✅ Mapped Bookings:', mappedBookings);
      
      setBookings(mappedBookings);
    } catch (err) {
      console.error('❌ Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };


  const fetchMyBookings = async () => {
    return fetchBookings();
  };


  const getUpcomingBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return (
        booking.booking_status === 'confirmed' &&
        bookingDate >= today
      );
    }).sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));
  };


  const getPastBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return (
        booking.booking_status === 'completed' ||
        (bookingDate < today && booking.booking_status !== 'cancelled')
      );
    }).sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
  };


  const getCancelledBookings = () => {
    return bookings.filter(booking => booking.booking_status === 'cancelled')
      .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
  };


  const fetchBookingById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${id}`);
      return mapBooking(response.data.data);
    } catch (err) {
      console.error('Error fetching booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/bookings', bookingData);
      

      await fetchBookings();
      
      return response.data;
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const updateBooking = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/bookings/${id}`, updates);
      

      await fetchBookings();
      
      return response.data;
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(err.response?.data?.message || 'Failed to update booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const updateBookingStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/bookings/${id}/status`, { 
        booking_status: status 
      });
      

      await fetchBookings();
      
      return response.data;
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err.response?.data?.message || 'Failed to update booking status');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const cancelBooking = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.delete(`/bookings/${id}`);
      

      await fetchBookings();
      
      return response.data;
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err.response?.data?.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const value = {
    bookings,
    loading,
    error,
    fetchBookings,
    fetchMyBookings,
    fetchBookingById,
    getUpcomingBookings,
    getPastBookings,
    getCancelledBookings,
    createBooking,
    updateBooking,
    updateBookingStatus,
    cancelBooking,
    refreshBookings: fetchBookings
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};