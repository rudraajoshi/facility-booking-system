const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors({origin: process.env.CORS_ORIGIN || 'https://localhost:3000'}));
app.use(express.json());

// routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const stateRoutes = require('./routes/state.routes');
const cityRoutes = require('./routes/city.routes');
const facilityRoutes = require('./routes/facility.routes');
const bookingRoutes = require('./routes/booking.routes');

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);

// error handler
app.use((req, res) => {
    res.status(404).json({success: false, message: 'Route not found'});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({success: false, message: 'Internal server error'});
});

module.exports = app;