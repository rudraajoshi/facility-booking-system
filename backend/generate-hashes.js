// Run this ONCE inside your /backend folder:  node generate-hashes.js
// Then copy the printed hashes into the Users INSERT in facility_booking_db.sql

const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const customerHash = bcrypt.hashSync('test123', salt);
const adminHash    = bcrypt.hashSync('admin123', salt);

console.log('------------------------------');
console.log('Customer (test@example.com)');
console.log(customerHash);
console.log('------------------------------');
console.log('Admin    (admin@facility.com)');
console.log(adminHash);
console.log('------------------------------');
console.log('Copy these two hashes into the Users INSERT in facility_booking_db.sql');