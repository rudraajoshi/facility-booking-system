const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());


app.use(express.static(path.join(__dirname, '../public')));

require('./models/index');
console.log('✅ Model associations loaded');

// routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const stateRoutes = require('./routes/state.routes');
const cityRoutes = require('./routes/city.routes');
const facilityRoutes = require('./routes/facility.routes');
const bookingRoutes = require('./routes/booking.routes');
const locationRoutes = require('./routes/location.routes'); 

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/locations', locationRoutes); 

// error handler
app.use((req, res) => {
    res.status(404).json({success: false, message: 'Route not found'});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({success: false, message: 'Internal server error', error: err.message});
});

module.exports = app;