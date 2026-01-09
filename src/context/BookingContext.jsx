import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

/**
 * booking context for managing booking data globally
 */
export const BookingContext = createContext();

export const BookingProvider = ({children}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // load bookings from localStorage
    useEffect(() => {
        try {
            const storedBookings = localStorage.getItem('bookings');
            if (storedBookings) {
                setBookings(JSON.parse(storedBookings));
            }
            setLoading(false);
        } catch (error) {
            console.log('Error loading bookings:', error);
            setLoading(false);
        }
    }, []);
    
    // save bookings to localStorage 
    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem('bookings', JSON.stringify(bookings));
            } catch (error) {
                console.log('Error saving bookings:', error);
            }
        }
    }, [bookings, loading]);

    /**
     * generate unique booking id
     * @returns {string}
     */
    const generateBookingId = () => {
        return `BK${Date.now()}${Math.random().toString(36).substr(2,9)}`.toUpperCase();
    };

    /**
     * add new booking
     * @param {Object} bookingData
     * @returns {Object}
     */
    const addBooking = (bookingData) => {
        const newBooking = {
            bookingId: generateBookingId(),
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        setBookings(prev => [newBooking, ...prev]);
        return newBooking;
    };
    
    /**
     * update existing booking
     * @param {string} bookingId
     * @param {Object} updates
     * @returns {Object|null}
     */
    const updateBooking = (bookingId, updates) => {
        let updatedBooking = null;
        
        setBookings(prev => {
            const index = prev.findIndex(b => b.bookingId === bookingId);
            if (index === -1) return prev;

            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            updatedBooking = updated[index];
            return updated; // FIXED: Added return statement
        });
        
        return updatedBooking;
    };

    /**
     * cancel booking
     * @param {string} bookingId
     * @returns {boolean}
     */
    const cancelBooking = (bookingId) => {
        const booking = bookings.find(b => b.bookingId === bookingId);
        if (!booking) return false;
        
        updateBooking(bookingId, {status: 'cancelled'});
        return true;
    };
    
    /**
     * get booking by id
     * @param {string} bookingId
     * @returns {Object|null}
     */
    const getBookingById = (bookingId) => {
        return bookings.find(b => b.bookingId === bookingId) || null;
    };

    /**
     * get all bookings for particular user
     * @param {string} userEmail
     * @returns {Array}
     */
    const getUserBookings = (userEmail) => {
        return bookings.filter(b => b.userEmail === userEmail);
    };
    
    /**
     * get bookings for particular facility
     * @param {string} facilityId
     * @returns {Array}
     */
    const getFacilityBookings = (facilityId) => {
        return bookings.filter(b => b.facilityId === facilityId);
    };

    /**
     * check if particular time slot is available
     * @param {string} facilityId
     * @param {string} date
     * @param {string} timeSlot
     * @returns {boolean}
     */
    const isTimeSlotAvailable = (facilityId, date, timeSlot) => {
        return !bookings.some(b =>
            b.facilityId === facilityId &&
            b.date === date &&
            b.timeSlot === timeSlot &&
            b.status === 'confirmed'
        );
    };
    
    /**
     * get upcoming bookings
     * @returns {Array}
     */
    const getUpcomingBookings = () => {
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter(b =>
            b.date >= today && b.status === 'confirmed'
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    /**
     * get past bookings
     * @returns {Array}
     */
    const getPastBookings = () => {
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter(b => b.date < today)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const value = {
        bookings,
        loading,
        addBooking,
        updateBooking,
        cancelBooking,
        getBookingById,
        getUserBookings,
        getFacilityBookings,
        isTimeSlotAvailable,
        getUpcomingBookings,
        getPastBookings
    };
    
    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

BookingProvider.propTypes = {
    children: PropTypes.node.isRequired
};