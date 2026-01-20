import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import PropTypes from 'prop-types';

const ConfirmationStep = ({ bookingData, facility, handlePrevious, handleSubmit }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleConfirmClick = (e) => {
    e.preventDefault();
  
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions to continue.');
      return;
    }

    handleSubmit(e);
  };

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>Review Your Booking</Card.Title>
        </Card.Header>
        <Card.Body className="space-y-6">
          {/* facility info */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Facility Details</h3>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Facility:</span>
                <span className="font-medium text-neutral-800">{facility.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Location:</span>
                <span className="font-medium text-neutral-800">{facility.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Capacity:</span>
                <span className="font-medium text-neutral-800">{facility.capacity.max} people</span>
              </div>
            </div>
          </div>

          {/* date and time */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Date & Time</h3>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Date:</span>
                <span className="font-medium text-neutral-800">{bookingData.date || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Start Time:</span>
                <span className="font-medium text-neutral-800">{bookingData.startTime || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Duration:</span>
                <span className="font-medium text-neutral-800">{bookingData.duration} hour(s)</span>
              </div>
            </div>
          </div>

          {/* booking details */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Booking Information</h3>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Purpose:</span>
                <span className="font-medium text-neutral-800 text-right">{bookingData.purpose || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Attendees:</span>
                <span className="font-medium text-neutral-800">{bookingData.attendees || 'N/A'}</span>
              </div>
              {bookingData.equipment.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Equipment:</span>
                  <span className="font-medium text-neutral-800 text-right">{bookingData.equipment.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* contact info */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-3">Contact Information</h3>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Name:</span>
                <span className="font-medium text-neutral-800">{bookingData.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Email:</span>
                <span className="font-medium text-neutral-800">{bookingData.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Phone:</span>
                <span className="font-medium text-neutral-800">{bookingData.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* T&C */}
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-primary-600 rounded focus:ring-2 focus:ring-primary-500" 
              />
              <span className="text-sm text-neutral-700">
                I agree to the <a href="/cancellation-policy" className="text-primary-600 hover:text-primary-700 font-medium">terms and conditions</a> and <a href="/cancellation-policy" className="text-primary-600 hover:text-primary-700 font-medium">cancellation policy</a>
              </span>
            </label>
          </div>
        </Card.Body>
      </Card>
      
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button 
          onClick={handleConfirmClick}
          disabled={!agreedToTerms}
          className={!agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

ConfirmationStep.propTypes = {
  bookingData: PropTypes.object.isRequired,
  facility: PropTypes.object.isRequired,
  handlePrevious: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default ConfirmationStep;