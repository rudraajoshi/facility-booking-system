// http status codes
const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// user role
const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};

// booking status
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

// availability status
const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  LIMITED: 'limited',
  BOOKED: 'booked',
};

// category status
const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// messages
const MESSAGES = {
  // auth
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'User with this email already exists',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_MISSING: 'No token provided',
  TOKEN_INVALID: 'Invalid or expired token',
  PROFILE_UPDATED: 'Profile updated successfully',

  // categories
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_EXISTS: 'Category with this name already exists',

  // states
  STATE_CREATED: 'State created successfully',
  STATE_UPDATED: 'State updated successfully',
  STATE_DELETED: 'State deleted successfully',
  STATE_NOT_FOUND: 'State not found',
  STATE_EXISTS: 'State with this name already exists',

  // cities
  CITY_CREATED: 'City created successfully',
  CITY_UPDATED: 'City updated successfully',
  CITY_DELETED: 'City deleted successfully',
  CITY_NOT_FOUND: 'City not found',
  STATE_NOT_FOUND_FOR_CITY: 'State not found for this city',

  // facilities
  FACILITY_CREATED: 'Facility created successfully',
  FACILITY_UPDATED: 'Facility updated successfully',
  FACILITY_DELETED: 'Facility deleted successfully',
  FACILITY_NOT_FOUND: 'Facility not found',
  FACILITY_UNAVAILABLE: 'Facility is currently not available for booking',

  // bookings
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_UPDATED: 'Booking updated successfully',
  BOOKING_STATUS_UPDATED: 'Booking status updated successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  BOOKING_NOT_FOUND: 'Booking not found',
  BOOKING_CONFLICT: 'This time slot is already booked. Please choose a different time.',
  BOOKING_CANNOT_UPDATE: 'Cannot update booking. Only pending bookings can be modified.',
  ONLY_ADMIN_CONFIRM: 'Only admins can confirm bookings',
  ACCESS_DENIED: 'Access denied',
};

module.exports = {
  STATUS,
  ROLES,
  BOOKING_STATUS,
  AVAILABILITY_STATUS,
  CATEGORY_STATUS,
  MESSAGES,
};