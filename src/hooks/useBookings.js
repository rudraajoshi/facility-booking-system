import {useContext} from 'react';
import { BookingContext } from '../context/BookingContext';
/**
 * custom hooks to access booking context
 * @returns {Object}
 * @throws {Error}
 */
export const useBookings = () =>{
    const context = useContext(BookingContext);
    if(!context){
        throw new Error('useBookings must be used within a BookingProvider');
    }
    return context;
};

export default useBookings;
