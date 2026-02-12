console.log('🔗 Starting model associations setup...');

const User = require('./User.model');
const Facility = require('./Facility.model');
const Booking = require('./Booking.model');
const Category = require('./Category.model');
const City = require('./City.model');
const State = require('./State.model');

console.log('📦 Models loaded');


User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });


Facility.hasMany(Booking, { foreignKey: 'facility_id', as: 'bookings' });
Facility.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Facility.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Facility.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(Facility, { foreignKey: 'facility_id', as: 'facility' });


Category.hasMany(Facility, { foreignKey: 'category_id', as: 'facilities' });

State.hasMany(City, { foreignKey: 'state_id', as: 'cities' });
State.hasMany(Facility, { foreignKey: 'state_id', as: 'facilities' });  

City.hasMany(Facility, { foreignKey: 'city_id', as: 'facilities' });
City.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

console.log('✅ Associations established:');
console.log('   Booking associations:', Object.keys(Booking.associations));
console.log('   User associations:', Object.keys(User.associations));
console.log('   Facility associations:', Object.keys(Facility.associations));

module.exports = {
    User,
    Facility,
    Booking,
    Category,
    City,
    State
};