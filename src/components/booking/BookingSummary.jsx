import Card from '../common/Card';
import PropTypes from 'prop-types';
const BookingSummary = ({ facility, bookingData, calculateTotal }) => {
  return (
    <Card className="sticky top-24">
      <Card.Header className="border-b border-neutral-200">
        <Card.Title>Booking Summary</Card.Title>
      </Card.Header>
      <Card.Body className="space-y-4">
        <div>
          <div className="text-sm text-neutral-600 mb-1">Facility</div>
          <div className="font-semibold text-neutral-800">{facility.name}</div>
        </div>
        <div>
          <div className="text-sm text-neutral-600 mb-1">Date</div>
          <div className="font-semibold text-neutral-800">
            {bookingData.date || 'Not selected'}
          </div>
        </div>
        <div>
          <div className="text-sm text-neutral-600 mb-1">Time</div>
          <div className="font-semibold text-neutral-800">
            {bookingData.startTime || 'Not selected'}
          </div>
        </div>
        <div>
          <div className="text-sm text-neutral-600 mb-1">Duration</div>
          <div className="font-semibold text-neutral-800">
            {bookingData.duration} hour(s)
          </div>
        </div>
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-600">Rate:</span>
            <span className="font-medium">${facility.pricing.hourly}/hour</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-neutral-600">Duration:</span>
            <span className="font-medium">{bookingData.duration} hour(s)</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
            <span className="font-semibold text-neutral-800">Total:</span>
            <span className="text-2xl font-bold text-primary-600">
              ${calculateTotal()}
            </span>
          </div>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600">
          <p className="font-medium text-neutral-800 mb-1">Cancellation Policy</p>
          <p>Free cancellation up to 24 hours before the booking start time.</p>
        </div>
      </Card.Body>
    </Card>
  );
};
BookingSummary.propTypes = {
  facility: PropTypes.object.isRequired,
  bookingData: PropTypes.object.isRequired,
  calculateTotal: PropTypes.func.isRequired
};

export default BookingSummary;