import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import FacilityCard from '../components/facilities/FacilityCard';
import BookingForm from '../components/booking/BookingForm';
// refactored
function Home() {
  const facilities = [
    {
      id: 1,
      name: 'Conference Room A',
      status: 'Available',
      description: 'Spacious room with modern AV equipment',
      capacity: 20,
      location: 'Building 1',
      price: 50
    },
    {
      id: 2,
      name: 'Meeting Room B',
      status: 'Limited',
      description: 'Intimate space perfect for team meetings',
      capacity: 8,
      location: 'Building 2',
      price: 30
    },
    {
      id: 3,
      name: 'Training Hall',
      status: 'Booked',
      description: 'Large hall for workshops and training sessions',
      capacity: 50,
      location: 'Building 3',
      price: 100
    }
  ];

  const handleBook = (facilityId) => {
    console.log(`Booking facility ${facilityId}`);
  };
  const handleViewDetails = (facilityId) => {
    console.log(`Viewing details for facility ${facilityId}`);
  };
  const handleQuickBooking = (formData) => {
    console.log('Quick booking:', formData);
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onBook={handleBook}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </section>

      {/* quick booking */}
      <section className="bg-neutral-100 py-16">
        <div className="container-custom max-w-2xl">
          <BookingForm onSubmit={handleQuickBooking} />
        </div>
      </section>
    </>
  );
}

export default Home;