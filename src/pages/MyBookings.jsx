import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '@/context/BookingContext';
import { FacilityContext } from '@/context/FacilityContext';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

function MyBookings() {
  const {
    bookings,
    loading,
    fetchMyBookings,
    getUpcomingBookings,
    getPastBookings,
    getCancelledBookings,
  } = useContext(BookingContext);

  const { getFacilityById } = useContext(FacilityContext);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const upcoming = getUpcomingBookings();
  const past = getPastBookings();
  const cancelled = getCancelledBookings();

  const current =
    activeTab === 'upcoming'
      ? upcoming
      : activeTab === 'past'
      ? past
      : cancelled;

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelling(bookingId);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_status: 'cancelled' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to cancel booking');
      }

      await fetchMyBookings();
      
      alert('✅ Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('❌ Failed to cancel booking: ' + error.message);
    } finally {
      setCancelling(null);
    }
  };

  if (loading && bookings.length === 0) {
    return <Loading size="lg" text="Loading your bookings..." fullscreen />;
  }

  const tabs = [
    { id: 'upcoming', label: 'UPCOMING', count: upcoming.length },
    { id: 'past', label: 'PAST', count: past.length },
    { id: 'cancelled', label: 'CANCELLED', count: cancelled.length },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-bold mb-6">My Bookings</h1>

        <div className="flex gap-3 mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {current.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-xl text-neutral-600">
                No {activeTab} bookings.
              </p>
              {activeTab === 'upcoming' && (
                <div className="mt-6">
                  <Link to="/facilities">
                    <Button size="lg">+ Book a Facility</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        ) : (
          <div className="space-y-4">
            {current.map(booking => {
              const facility = getFacilityById(booking.facility_id);
              const isCancelling = cancelling === booking.booking_id;

              return (
                <Card key={booking.booking_id} className="hover:shadow-lg transition-shadow">
                  <Card.Body>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {facility?.facility_name || facility?.name || 'Unknown Facility'}
                        </h3>
                        <div className="text-neutral-600 space-y-1">
                          <p>📅 {booking.booking_date}</p>
                          <p>🕐 {booking.start_time} - {booking.end_time}</p>
                          {booking.attendees && <p>👥 {booking.attendees} attendees</p>}
                          {booking.purpose && <p>📝 {booking.purpose}</p>}
                        </div>
                      </div>

                      <Badge
                        variant={
                          booking.booking_status === 'confirmed'
                            ? 'success'
                            : booking.booking_status === 'cancelled'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {booking.booking_status.toUpperCase()}
                      </Badge>
                    </div>

                    {booking.booking_status === 'confirmed' && ( 
                      <Button
                        size="sm"
                        variant="danger"
                        className="mt-2"
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelling...
                          </span>
                        ) : (
                          'Cancel Booking'
                        )}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link to="/facilities">
            <Button size="lg" className="w-full sm:w-auto">
              + New Booking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;