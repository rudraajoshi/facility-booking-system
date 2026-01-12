import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import PropTypes from 'prop-types';

const DetailsStep = ({ 
  bookingData, 
  facility, 
  equipmentOptions, 
  handleInputChange, 
  handleEquipmentToggle, 
  handleNext, 
  handlePrevious 
}) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Booking Details</Card.Title>
      </Card.Header>
      <Card.Body className="space-y-6">
        <Input
          label="Purpose of Booking *"
          type="textarea"
          name="purpose"
          value={bookingData.purpose}
          onChange={handleInputChange}
          placeholder="e.g., Team meeting, Client presentation, Training session..."
          rows="3"
          required
        />
        <div>
          <Input
            label="Number of Attendees *"
            type="number"
            name="attendees"
            value={bookingData.attendees}
            onChange={handleInputChange}
            placeholder="e.g., 10"
            min="1"
            max={facility.capacity.max}
            required
          />
          <p className="text-sm text-neutral-500 mt-1">
            Maximum capacity: {facility.capacity.max} people
          </p>
        </div>
        <div>
          <label className="label">Additional Equipment</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {equipmentOptions.map((equipment) => (
              <label 
                key={equipment}
                className="flex items-center gap-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <input 
                  type="checkbox"
                  checked={bookingData.equipment.includes(equipment)}
                  onChange={() => handleEquipmentToggle(equipment)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm text-neutral-700">{equipment}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <h3 className="font-semibold text-neutral-800 mb-3">Contact Information</h3>
          <div className="space-y-4">
            <Input
              label="Full Name *"
              type="text"
              name="name"
              value={bookingData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email *"
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Phone *"
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-3 pt-4 border-t border-neutral-200">
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
          <Button onClick={handleNext}>
            Next: Review Booking
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
DetailsStep.propTypes = {
  bookingData: PropTypes.object.isRequired,
  facility: PropTypes.object.isRequired,
  equipmentOptions: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEquipmentToggle: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrevious: PropTypes.func.isRequired
};

export default DetailsStep;