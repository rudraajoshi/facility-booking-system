const User     = require('./User.model');
const Category = require('./Category.model');
const State    = require('./State.model');
const City     = require('./City.model');
const Facility = require('./Facility.model');
const Booking  = require('./Booking.model');

// associations
// state <-> city
State.hasMany(City, {foreignKey: 'state_id', as: 'cities'});
City.belongsTo(State, {foreignKey: 'state_id', as: 'state'});

// cat <-> facility
Category.hasMany(Facility, {foreignKey: 'category_id', as: 'facilities'});
Facility.belongsTo(Category, {foreignKey: 'category_id', as: 'category'});

// state <-> facility
State.hasMany(Facility, {foreignKey: 'state_id', as: 'facilities'});
Facility.belongsTo(State, {foreignKey: 'state_id', as: 'state'});

// city <-> facility
City.hasMany(Facility, {foreignKey: 'city_id', as: 'facilities'});
Facility.belongsTo(State, {foreignKey: 'city_id', as: 'city'});

// user <-> booking
User.hasMany(Booking, {foreignKey: 'user_id', as: 'bookings'});
Booking.belongsTo(User, {foreignKey: 'user_id', as: 'user'});

// facility <-> booking
Facility.hasMany(Booking, {foreignKey: 'facility_id', as: 'bookings'});
Booking.belongsTo(Facility, {foreignKey: 'facility_id', as: 'facility'});


// exporting
module.exports = { User, Category, State, City, Facility, Booking };