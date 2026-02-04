const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const {verifyToken} = require('../middleware/auth.middleware');
const { verify } = require('jsonwebtoken');

router.get('/', verifyToken, bookingController.getAllBookings);
router.get('/:id', verifyToken, bookingController.getBookingById);
router.post('/', verifyToken, bookingController.createBooking);
router.put('/:id', verifyToken, bookingController.updateBooking);
router.put('/:id/status', verifyToken, bookingController.updateBookingStatus);
router.delete('/:id', verifyToken, bookingController.cancelBooking);

module.exports = router;