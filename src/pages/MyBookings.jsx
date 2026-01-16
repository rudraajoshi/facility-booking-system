import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FacilityContext } from '../context/FacilityContext';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';

function MyBookings() {
  const navigate = useNavigate();
  const { getFacilityById } = useContext(FacilityContext);
  const { bookings, loading, cancelBooking, getUpcomingBookings, getPastBookings } = useContext(BookingContext);
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const currentUserEmail = user?.email || '';

  const upcomingBookings = getUpcomingBookings().filter(b => b.userEmail === currentUserEmail);
  const pastBookings = getPastBookings().filter(b => b.userEmail === currentUserEmail && b.status !== 'cancelled');
  const cancelledBookings = bookings.filter(b => b.userEmail === currentUserEmail && b.status === 'cancelled');

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
      cancelBooking(selectedBooking.id);
      setShowCancelModal(false);
      setSelectedBooking(null);
      setActiveTab('cancelled');
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
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateEndTime = (startTime, duration) => {
    const [h, m] = startTime.split(':');
    const d = new Date();
    d.setHours(h, m);
    d.setHours(d.getHours() + duration);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const canCancelBooking = (booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.timeSlot}`);
    const now = new Date();
    return (bookingDateTime - now) / (1000 * 60 * 60) > 24;
  };

  if (loading) return <Loading size="lg" text="Loading your bookings..." fullscreen />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
        <p className="text-neutral-600 mb-6">View and manage all your facility reservations</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card><Card.Body className="text-center p-6"><div className="text-4xl font-bold">{upcomingBookings.length}</div>Upcoming</Card.Body></Card>
            <Card><Card.Body className="text-center p-6"><div className="text-4xl font-bold">{pastBookings.length}</div>Past</Card.Body></Card>
            <Card><Card.Body className="text-center p-6"><div className="text-4xl font-bold">{cancelledBookings.length}</div>Cancelled</Card.Body></Card>
            <Link to="/facilities"><Button className="w-full">+ New Booking</Button></Link>
          </div>

          <div className="lg:col-span-3">
            <div className="flex mb-4">
              {['upcoming','past','cancelled'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 ${activeTab===tab?'border-b-2 border-primary-600':''}`}>
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {currentBookings.length === 0 ? (
              <Card><Card.Body className="text-center py-12">No {activeTab} bookings.</Card.Body></Card>
            ) : (
              currentBookings.map(booking => {
                const facility = getFacilityById(booking.facilityId);
                return (
                  <Card key={booking.id} className="mb-4">
                    <Card.Body>
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{booking.facilityName}</h3>
                          <p>{facility?.location}</p>
                          <p>{formatDate(booking.date)} | {booking.timeSlot} - {calculateEndTime(booking.timeSlot, booking.duration)}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                          <div className="mt-2 text-xs font-mono">{booking.id.slice(0,12)}...</div>
                        </div>
                      </div>

                      {booking.status === 'confirmed' && canCancelBooking(booking) && (
                        <Button size="sm" variant="danger" className="mt-2" onClick={() => handleCancelClick(booking)}>
                          Cancel Booking
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Booking?">
        {selectedBooking && (
          <>
            <p>Cancel booking for {selectedBooking.facilityName} on {formatDate(selectedBooking.date)}?</p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>No</Button>
              <Button variant="danger" onClick={handleCancelConfirm}>Yes, Cancel</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default MyBookings;
