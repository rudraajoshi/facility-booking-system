import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StepIndicator from '../components/booking/StepIndicator';
import BookingSummary from '../components/booking/BookingSummary';
import DateTimeStep from '../components/booking/DateTimeStep';
import DetailsStep from '../components/booking/DetailsStep';
import ConfirmationStep from '../components/booking/ConfirmationStep';
import Loading from '../components/common/Loading';
import { useFacilities } from '../hooks/useFacilities';
import { useBookings } from '../hooks/useBookings';

function BookingPage() {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const { getFacilityById, loading: facilitiesLoading } = useFacilities();
  const { addBooking } = useBookings();
  
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

  // Get facility from context
  const facility = getFacilityById(facilityId);

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
    
    // Create booking object
    const newBooking = {
      facilityId: facility.id,
      facilityName: facility.name,
      date: bookingData.date,
      timeSlot: bookingData.startTime,
      duration: parseInt(bookingData.duration),
      userName: bookingData.name,
      userEmail: bookingData.email,
      userPhone: bookingData.phone,
      attendees: parseInt(bookingData.attendees),
      purpose: bookingData.purpose,
      specialRequests: bookingData.equipment.join(', '),
      totalAmount: calculateTotal()
    };

    // Add booking to context (which saves to localStorage)
    const createdBooking = addBooking(newBooking);
    
    console.log('Booking submitted:', createdBooking);
    alert(`Booking confirmed! Your booking ID is: ${createdBooking.bookingId}`);
    
    // Navigate to my bookings
    navigate('/my-bookings');
  };

  const calculateTotal = () => {
    if (!facility) return 0;
    return facility.pricing.hourly * parseInt(bookingData.duration || 1);
  };

  // Loading state
  if (facilitiesLoading) {
    return <Loading size="lg" text="Loading facility details..." fullscreen />;
  }

  // Facility not found
  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Facility Not Found</h2>
          <p className="text-neutral-600 mb-6">
            The facility you're looking for doesn't exist.
          </p>
          <Link 
            to="/facilities" 
            className="btn-primary inline-block"
          >
            Browse All Facilities
          </Link>
        </div>
      </div>
    );
  }

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
            <div>
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