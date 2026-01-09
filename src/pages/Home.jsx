import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import FacilityCard from '../components/facilities/FacilityCard';
import BookingForm from '../components/booking/BookingForm';
import Loading from '../components/common/Loading';
import {useFacilities}  from '../hooks/useFacilities';
import { useBookings } from '../hooks/useBookings';

function Home() {
  const navigate = useNavigate();
  const { facilities, loading, error } = useFacilities();
  const { addBooking } = useBookings();

  // Get only featured facilities (first 3)
  const featuredFacilities = facilities.slice(0, 3);
  const handleBook = (facilityId) => {
    console.log(`Booking facility ${facilityId}`);
    navigate(`/booking/${facilityId}`);
  };
  const handleViewDetails = (facilityId) => {
    console.log(`Viewing details for facility ${facilityId}`);
    navigate(`/facilities/${facilityId}`);
  };
  const handleQuickBooking = (formData) => {
    console.log('Quick booking:', formData);
    
    // find the facility by name to get its ID
    const facility = facilities.find(f => f.name === formData.facility);
    if (facility) {
      // create booking object
      const bookingData = {
        facilityId: facility.id,
        facilityName: facility.name,
        date: formData.date,
        timeSlot: formData.time,
        duration: parseInt(formData.duration),
        userName: 'Guest User', // You can collect this from a login system
        userEmail: 'guest@example.com', // You can collect this from a login system
        userPhone: '', // You can collect this from a login system
        attendees: 0, // Not collected in quick booking
        purpose: formData.purpose || 'Quick Booking',
        specialRequests: '',
        totalAmount: facility.pricing.hourly * parseInt(formData.duration)
      };

      // Add booking
      const newBooking = addBooking(bookingData);
      
      // Show success message
      alert(`Booking confirmed! Your booking ID is: ${newBooking.bookingId}`);
      
      // Navigate to my bookings
      navigate('/my-bookings');
    } else {
      alert('Please select a valid facility');
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading facilities..." fullscreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error-600 mb-4">Error Loading Facilities</h2>
          <p className="text-neutral-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* hero section*/}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-5xl font-display font-bold mb-4 animate-fade-in">
            Book Your Facility in Seconds
          </h2>
          <p className="text-xl text-primary-100 mb-8 animate-fade-in-up">
            Reserve conference rooms, meeting spaces, and more with ease
          </p>
          <Link to="/facilities">
            <Button 
              variant="white" 
              size="lg" 
              className="animate-fade-in-up inline-block font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Browse Facilities
            </Button>
          </Link>
        </div>
      </section>

      {/* facilities */}
      <section className="container-custom py-16">
        <h3 className="text-3xl font-display font-semibold mb-8">
          Featured Facilities
        </h3>

        {featuredFacilities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">No facilities available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFacilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onBook={handleBook}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* quick booking */}
      <section className="bg-neutral-100 py-16">
        <div className="container-custom max-w-2xl">
          <BookingForm onSubmit={handleQuickBooking} facilities={facilities} />
        </div>
      </section>
    </>
  );
}

export default Home;