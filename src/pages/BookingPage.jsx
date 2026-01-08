import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import StepIndicator from '../components/booking/StepIndicator';
import BookingSummary from '../components/booking/BookingSummary';
import DateTimeStep from '../components/booking/DateTimeStep';
import DetailsStep from '../components/booking/DetailsStep';
import ConfirmationStep from '../components/booking/ConfirmationStep';
// refactored
function BookingPage() {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    duration: '1',
    purpose: '',
    attendees: '',
    equipment: [],
    name: '',
    email: '',
    phone: ''
  });

  // dummy facility data
  const facility = {
    id: facilityId,
    name: facilityId === '1' ? 'Conference Room A' : facilityId === '2' ? 'Meeting Room B' : 'Training Hall',
    price: facilityId === '1' ? 50 : facilityId === '2' ? 30 : 100,
    capacity: facilityId === '1' ? 20 : facilityId === '2' ? 8 : 50,
    location: facilityId === '1' ? 'Building 1' : facilityId === '2' ? 'Building 2' : 'Building 3'
  };

  const equipmentOptions = [
    'Projector',
    'Whiteboard',
    'Video Conferencing',
    'Microphone',
    'Laptop',
    'Extra Chairs'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipmentToggle = (equipment) => {
    setBookingData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingData);
    alert('Booking submitted successfully! (This is a demo)');
    navigate('/my-bookings');
  };

  const calculateTotal = () => {
    return facility.price * parseInt(bookingData.duration || 1);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-custom py-6">
          <Link 
            to={`/facilities/${facilityId}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Facility Details
          </Link>
          <h1 className="text-3xl font-display font-bold text-neutral-800">
            Book {facility.name}
          </h1>
          <p className="text-neutral-600 mt-2">
            Complete the steps below to reserve your facility
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* main */}
          <div className="lg:col-span-2">
            {/* step indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* content */}
            <div onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <DateTimeStep
                  bookingData={bookingData}
                  handleInputChange={handleInputChange}
                  handleNext={handleNext}
                />
              )}

              {currentStep === 2 && (
                <DetailsStep
                  bookingData={bookingData}
                  facility={facility}
                  equipmentOptions={equipmentOptions}
                  handleInputChange={handleInputChange}
                  handleEquipmentToggle={handleEquipmentToggle}
                  handleNext={handleNext}
                  handlePrevious={handlePrevious}
                />
              )}

              {currentStep === 3 && (
                <ConfirmationStep
                  bookingData={bookingData}
                  facility={facility}
                  handlePrevious={handlePrevious}
                  handleSubmit={handleSubmit}
                />
              )}
            </div>
          </div>

          {/* booking summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              facility={facility}
              bookingData={bookingData}
              calculateTotal={calculateTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;