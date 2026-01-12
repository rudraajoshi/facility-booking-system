import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import PropTypes from 'prop-types';

const DateTimeStep = ({ bookingData, handleInputChange, handleNext }) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Select Date & Time</Card.Title>
      </Card.Header>
      <Card.Body className="space-y-6">
        <Input
          label="Booking Date *"
          type="date"
          name="date"
          value={bookingData.date}
          onChange={handleInputChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <p className="text-sm text-neutral-500 -mt-4">
          Select a date for your booking
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time *"
            type="time"
            name="startTime"
            value={bookingData.startTime}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Duration (hours) *"
            type="select"
            name="duration"
            value={bookingData.duration}
            onChange={handleInputChange}
            required
          >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="6">6 hours</option>
            <option value="8">8 hours</option>
          </Input>
        </div>
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-semibold text-primary-900 mb-1">Availability Note</p>
              <p className="text-primary-800">
                Most slots are available between 8:00 AM - 8:00 PM. Check real-time availability in the calendar view.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button onClick={handleNext}>
            Next: Add Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
DateTimeStep.propTypes = {
  bookingData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired
};

export default DateTimeStep;