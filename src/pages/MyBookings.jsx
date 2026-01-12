import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import { useFacilities } from '../hooks/useFacilities';
import { useBookings } from '../hooks/useBookings';

function MyBookings() {
  const navigate = useNavigate();
  const { getFacilityById } = useFacilities();
  const { 
    bookings, 
    loading, 
    cancelBooking, 
    getUpcomingBookings, 
    getPastBookings 
  } = useBookings();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  //  current user
  useEffect(() => {
    const email = localStorage.getItem('currentUserEmail');
    if (email) {
      setCurrentUserEmail(email);
    } else {
      setCurrentUserEmail('guest@example.com');
    }
  }, []);

  // filter bookings by status and user
  const upcomingBookings = getUpcomingBookings().filter(
    b => b.userEmail === currentUserEmail
  );
  
  const pastBookings = getPastBookings().filter(
    b => b.userEmail === currentUserEmail && b.status !== 'cancelled'
  );
  
  const cancelledBookings = bookings.filter(
    b => b.userEmail === currentUserEmail && b.status === 'cancelled'
  );

  const currentBookings = 
    activeTab === 'upcoming' ? upcomingBookings :
    activeTab === 'past' ? pastBookings :
    cancelledBookings;

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (selectedBooking) {
      const success = cancelBooking(selectedBooking.bookingId);
      
      if (success) {
        alert(`Booking ${selectedBooking.bookingId} cancelled successfully!`);
        setShowCancelModal(false);
        setSelectedBooking(null);
        
        // switch to cancelled tab to show the cancelled booking
        setActiveTab('cancelled');
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleBookAgain = (booking) => {
    navigate(`/booking/${booking.facilityId}`);
  };

  const getStatusVariant = (status) => {
    const statusMap = {
      confirmed: 'success',
      completed: 'gray',
      cancelled: 'error'
    };
    return statusMap[status] || 'gray';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes));
    startDate.setHours(startDate.getHours() + duration);
    return startDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // check if booking can be cancelled 
  const canCancelBooking = (booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.timeSlot}`);
    const now = new Date();
    const hoursDifference = (bookingDateTime - now) / (1000 * 60 * 60);
    return hoursDifference > 24;
  };

  if (loading) {
    return <Loading size="lg" text="Loading your bookings..." fullscreen />;
  }

  // show user info banner if logged in
  const showUserInfo = currentUserEmail && currentUserEmail !== 'guest@example.com';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
            My Bookings
          </h1>
          <p className="text-neutral-600">
            View and manage all your facility reservations
          </p>
          {showUserInfo && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-primary-900 font-medium">{currentUserEmail}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* sidebar => stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
              <Card.Body className="text-center p-6">
                <div className="text-5xl font-bold mb-2">
                  {upcomingBookings.length}
                </div>
                <div className="text-primary-100 font-medium">Upcoming Bookings</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center p-6">
                <div className="text-4xl font-bold text-neutral-800 mb-2">
                  {pastBookings.length}
                </div>
                <div className="text-sm text-neutral-600 font-medium">Past Bookings</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center p-6">
                <div className="text-4xl font-bold text-error-600 mb-2">
                  {cancelledBookings.length}
                </div>
                <div className="text-sm text-neutral-600 font-medium">Cancelled</div>
              </Card.Body>
            </Card>

            <Link to="/facilities">
              <Button variant="primary" className="w-full shadow-lg">
                + New Booking
              </Button>
            </Link>
          </div>

          {/* main */}
          <div className="lg:col-span-3">
            {/* tabs */}
            <Card className="mb-6 shadow-sm">
              <Card.Body className="p-0">
                <div className="flex border-b border-neutral-200">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                      activeTab === 'upcoming'
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    Upcoming ({upcomingBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                      activeTab === 'past'
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    Past ({pastBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                      activeTab === 'cancelled'
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    Cancelled ({cancelledBookings.length})
                  </button>
                </div>
              </Card.Body>
            </Card>

            {/* booking list */}
            {currentBookings.length === 0 ? (
              <Card className="shadow-sm">
                <Card.Body className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    No {activeTab} bookings
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {activeTab === 'upcoming' 
                      ? 'You have no upcoming bookings. Book a facility to get started!'
                      : activeTab === 'past'
                      ? 'No past bookings to display.'
                      : 'No cancelled bookings.'}
                  </p>
                  {activeTab === 'upcoming' && (
                    <Link to="/facilities">
                      <Button variant="primary" size="lg">
                        Browse Facilities
                      </Button>
                    </Link>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <div className="space-y-4">
                {currentBookings.map((booking) => {
                  const facility = getFacilityById(booking.facilityId);
                  const endTime = calculateEndTime(booking.timeSlot, booking.duration);
                  const canCancel = canCancelBooking(booking);

                  return (
                    <Card key={booking.bookingId} hover className="border-l-4 border-primary-600 shadow-sm">
                      <Card.Body>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* left side - booking info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-neutral-800 mb-1">
                                  {booking.facilityName}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {facility?.location || 'Location not available'}
                                </div>
                              </div>
                              <Badge variant={getStatusVariant(booking.status)} size="md">
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="flex items-center gap-2 text-neutral-700">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">{formatDate(booking.date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-neutral-700">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{booking.timeSlot} - {endTime}</span>
                              </div>
                              <div className="flex items-center gap-2 text-neutral-700">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{booking.attendees} attendees</span>
                              </div>
                              <div className="flex items-center gap-2 text-neutral-700">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold text-primary-600">${booking.totalAmount}</span>
                              </div>
                            </div>

                            <div className="bg-neutral-50 rounded px-3 py-2 text-sm text-neutral-600">
                              <span className="font-medium">Purpose:</span> {booking.purpose}
                            </div>

                            {booking.specialRequests && booking.specialRequests !== 'None' && (
                              <div className="mt-2 bg-primary-50 rounded px-3 py-2 text-sm text-neutral-600">
                                <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                              </div>
                            )}

                            {booking.status === 'cancelled' && (
                              <div className="mt-2 text-sm text-error-600">
                                Cancelled on {formatDate(booking.createdAt)}
                              </div>
                            )}
                          </div>

                          {/* right side => actions */}
                          <div className="flex flex-col gap-2 md:min-w-[140px]">
                            <div className="text-right mb-2">
                              <div className="text-xs text-neutral-500 mb-1">Booking ID</div>
                              <div className="font-mono text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded border border-neutral-200">
                                {booking.bookingId.slice(0, 12)}...
                              </div>
                            </div>

                            {booking.status === 'confirmed' && (
                              <>
                                <Link to={`/facilities/${booking.facilityId}`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                    View Details
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCancelClick(booking)}
                                  disabled={!canCancel}
                                  className="w-full text-error-600 hover:bg-error-50 hover:text-error-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={!canCancel ? 'Cannot cancel within 24 hours of booking' : 'Cancel booking'}
                                >
                                  {canCancel ? 'Cancel Booking' : 'Cannot Cancel'}
                                </Button>
                              </>
                            )}

                            {booking.status === 'completed' && (
                              <>
                                <Link to={`/facilities/${booking.facilityId}`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                    View Facility
                                  </Button>
                                </Link>
                                <Button 
                                  variant="primary" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => handleBookAgain(booking)}
                                >
                                  Book Again
                                </Button>
                              </>
                            )}

                            {booking.status === 'cancelled' && (
                              <Link to={`/facilities/${booking.facilityId}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  View Facility
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* cancel confirmation */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedBooking(null);
        }}
        title="Cancel Booking?"
        size="md"
      >
        {selectedBooking && (
          <>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <p className="text-neutral-600 text-center mb-6">
              Are you sure you want to cancel your booking for <span className="font-semibold">{selectedBooking.facilityName}</span> on {formatDate(selectedBooking.date)}?
            </p>

            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-warning-800">
                <span className="font-semibold">Cancellation Policy:</span> Free cancellation up to 24 hours before the booking start time. Cancellations made within 24 hours may incur a fee.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleCancelConfirm}
              >
                Yes, Cancel
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default MyBookings;