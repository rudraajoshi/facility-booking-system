import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StepIndicator from '@/components/booking/StepIndicator';
import BookingSummary from '@/components/booking/BookingSummary';
import DateTimeStep from '@/components/booking/DateTimeStep';
import DetailsStep from '@/components/booking/DetailsStep';
import ConfirmationStep from '@/components/booking/ConfirmationStep';
import Loading from '@/components/common/Loading';
import { useFacilities } from '@/hooks/useFacilities';
import { useBookings } from '@/hooks/useBookings';

function BookingPage() {
  const { facilityId } = useParams();
  const navigate = useNavigate();

  const { getFacilityById, loading: facilitiesLoading } = useFacilities();
  const { createBooking, loading: bookingLoading } = useBookings();

  const [facility, setFacility] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
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

  useEffect(() => {
    const loadFacility = async () => {
      setPageLoading(true);

      try {
        const contextFacility = getFacilityById(facilityId);

        if (contextFacility) {
          setFacility(contextFacility);
        } else {
          const response = await fetch(`/api/facilities/${facilityId}`);
          const result = await response.json();

          if (result.success && result.data) {
            setFacility(result.data);
          } else {
            setFacility(null);
          }
        }
      } catch (err) {
        console.error('Error loading facility:', err);
        setFacility(null);
      } finally {
        setPageLoading(false);
      }
    };

    if (facilityId) loadFacility();
  }, [facilityId, getFacilityById]);

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
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleEquipmentToggle = (item) => {
    setBookingData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item]
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && (!bookingData.date || !bookingData.startTime)) {
      alert('Please select date and start time');
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime) return '';

    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setHours(date.getHours() + Number(duration || 1));

    return date.toTimeString().slice(0, 5); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      bookingData.date,
      bookingData.startTime,
      bookingData.purpose,
      bookingData.attendees,
      bookingData.name,
      bookingData.email,
      bookingData.phone
    ];

    if (requiredFields.some(f => !f)) {
      alert('Please fill in all required fields');
      return;
    }

    const endTime = calculateEndTime(
      bookingData.startTime,
      bookingData.duration
    );

    const newBooking = {
      facility_id: Number(facilityId),
      booking_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: endTime,
      duration: Number(bookingData.duration),
      purpose: bookingData.purpose,
      attendees: Number(bookingData.attendees) || 0,
      equipment: bookingData.equipment.join(', '),
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone
    };

    console.log('📦 Sending booking:', newBooking);

    try {
      const createdBooking = await createBooking(newBooking);

      if (!createdBooking) {
        alert('Failed to create booking');
        return;
      }

      alert(
        `Booking confirmed!\n\n` +
        `Booking ID: ${createdBooking.booking_id}\n` +
        `Facility: ${facility.facility_name || facility.name}\n` +
        `Date: ${bookingData.date}\n` +
        `Time: ${bookingData.startTime}\n` +
        `Total: $${calculateTotal()}`
      );

      navigate('/my-bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking: ' + err.message);
    }
  };

  const calculateTotal = () => {
    if (!facility?.pricing) return 0;
    return facility.pricing.hourly * Number(bookingData.duration || 1);
  };

  if (pageLoading || facilitiesLoading || bookingLoading) {
    return <Loading size="lg" text="Loading facility details..." fullscreen />;
  }

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Facility Not Found</h2>
          <Link to="/facilities" className="btn-primary">
            Browse Facilities
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="container-custom py-6">
          <Link
            to={`/facilities/${facilityId}`}
            className="text-primary-600 font-medium"
          >
            ← Back to Facility
          </Link>

          <h1 className="text-3xl font-bold mt-2">
            Book {facility.name}
          </h1>
        </div>
      </div>

      <div className="container-custom py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StepIndicator currentStep={currentStep} />

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

        <BookingSummary
          facility={facility}
          bookingData={bookingData}
          calculateTotal={calculateTotal}
        />
      </div>
    </div>
  );
}

export default BookingPage;