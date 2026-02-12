const bookingService = require('../services/booking.service');
const facilityService = require('../services/facility.service');
const { STATUS, MESSAGES, ROLES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse, paginatedResponse } = require('../utils/response');

// get api bookings [admin can see all bookings, customer can check self bookings]
exports.getAllBookings = async(req, res, next) => {
    try{
        const {facility_id, booking_status, booking_date, page = 1, limit = 10} = req.query;
        const filters = {};

        // customers can check self bookings
        if(req.userRole !== ROLES.ADMIN){
            filters.user_id = req.userId;
        } else if (req.query.user_id){
            filters.user_id = req.query.user_id;
        }

        if(facility_id) filters.facility_id = facility_id;
        if(booking_status) filters.booking_status = booking_status;
        if(booking_date) filters.booking_date = booking_date;

        const { count, rows } = await bookingService.getAll(filters, page, limit);

        console.log('\n=== BOOKING API RESPONSE ===');
        console.log('Total bookings:', count);
        console.log('First booking:', rows[0]);
        console.log('First booking has user?', !!rows[0]?.user);
        console.log('First booking has facility?', !!rows[0]?.facility);
        if (rows[0]) {
            console.log('User data:', rows[0].user);
            console.log('Facility data:', rows[0].facility);
        }
        console.log('========================\n');
        
        return paginatedResponse(res, rows, count, page, limit);
    } catch(error){
        console.error('ERROR in getAllBookings:', error);
        next(error);
    }
};

// get bookings id
exports.getBookingById = async(req, res, next) => {
    try{
        const booking = await bookingService.getById(req.params.id);
        if(!booking){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BOOKING_NOT_FOUND);
        }

        // customers can see self bookings
        if(req.userRole !== ROLES.ADMIN && booking.user_id !== req.userId){
            return errorResponse(res, STATUS.FORBIDEEN, MESSAGES.ACCESS_DENIED);
        }

        return successResponse(res, 'Bookings fetched successfully', booking);
    } catch(error){
        next(error);
    }
};

// post api bookings 
exports.createBooking = async(req, res, next) => {
    try{
        console.log('📥 Received booking request:', req.body);

        const { facility_id, booking_date, start_time, end_time } = req.body;

        console.log('📝 Parsed booking data:', { facility_id, booking_date, start_time, end_time });

        if(!facility_id || !booking_date || !start_time || !end_time){
            console.error('❌ Missing required fields:', { facility_id, booking_date, start_time, end_time });
            return errorResponse(res, STATUS.BAD_REQUEST, 'facility_id, booking_date, start_time and end_time are required');
        }

        // facility verification
        const facility = await facilityService.getById(facility_id);
        if(!facility){
            console.error('❌ Facility not found:', facility_id);
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.FACILITY_NOT_FOUND);
        }

        console.log('✅ Facility found:', facility.facility_name);

        // check availability status
        if(facility.availability_status === 'booked'){
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.FACILITY_UNAVAILABLE);
        }

        // check time conflict
        const hasConflict = await bookingService.checkConflict(facility_id, booking_date, start_time, end_time);
        if(hasConflict){
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BOOKING_CONFLICT);
        }

        console.log('✅ No conflicts, creating booking...');

        const booking = await bookingService.create({
            user_id: req.userId,
            facility_id,
            booking_date,
            start_time,
            end_time,
            booking_status: 'confirmed',
        });

        console.log('✅ Booking created successfully:', booking);

        return createdResponse(res, MESSAGES.BOOKED_CREATED, booking);
    } catch(error){
        console.error('❌ Error in createBooking:', error);
        next(error);
    }
};

// put bookings id [updated date and time for confirmed bookings]
exports.updateBooking = async(req, res, next) => {
    try{
        const booking = await bookingService.getById(req.params.id);
        if(!booking){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BOOKING_NOT_FOUND);
        }

        // auth
        if(req.userRole !== ROLES.ADMIN && booking.user_id !== req.userId){
            return errorResponse(res, STATUS.FORBIDDEN, MESSAGES.ACCESS_DENIED);
        }

        if(booking.booking_status === 'cancelled' || booking.booking_status === 'completed'){
            return errorResponse(res, STATUS.BAD_REQUEST, 'Cannot update cancelled or completed bookings');
        }

        const { booking_date, start_time, end_time } = req.body;

        const newDate = booking_date || booking.booking_date;
        const newStartTime = start_time || booking.start_time;
        const newEndTime = end_time || booking.end_time;

        // check conflict
        const hasConflict = await bookingService.checkConflict(
            booking.facility_id, newDate, newStartTime, newEndTime, booking.booking_id
        );
        if(hasConflict){
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BOOKING_CONFLICT);
        }

        const updated = await bookingService.update(booking, {
            booking_date: newDate,
            start_time: newStartTime,
            end_time: newEndTime,
        });

        return successResponse(res, MESSAGES.BOOKING_UPDATED, updated);
    } catch(error){
        next(error);
    }
};

// put bookings id/status
exports.updateBookingStatus = async(req, res, next) => {
    try{
        const booking = await bookingService.getById(req.params.id);
        if(!booking){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BOOKING_NOT_FOUND);
        }

        // auth
        if(req.userRole !== ROLES.ADMIN && booking.user_id !== req.userId){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BOOKING_NOT_FOUND);
        }

        const { booking_status } = req.body;

        if(req.userRole !== ROLES.ADMIN && booking_status !== 'cancelled'){
            return errorResponse(res, STATUS.FORBIDDEN, 'Only admins can change status to ' + booking_status);
        }

        const updated = await bookingService.update(booking, {booking_status});
        return successResponse(res, MESSAGES.BOOKING_STATUS_UPDATED, updated);
    } catch(error){
        next(error);
    }
};

// delete bookings id
exports.cancelBooking = async(req, res, next) => {
    try{
        const booking = await bookingService.getById(req.params.id);
        if(!booking){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BOOKING_NOT_FOUND);
        }

        // auth
        if(req.userRole !== ROLES.ADMIN && booking.user_id !== req.userId){
            return errorResponse(res, STATUS.FORBIDDEN, MESSAGES.ACCESS_DENIED);
        }

        await bookingService.update(booking, { booking_status: 'cancelled'});
        return successResponse(res, MESSAGES.BOOKING_CANCELLED);
    } catch(error){
        next(error);
    }
};