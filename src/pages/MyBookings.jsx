import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

function MyBookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // dummy booking data
  const mockBookings = {
    upcoming: [
      {
        id: 'BK001',
        facilityId: '1',
        facilityName: 'Conference Room A',
        location: 'Building 1',
        date: '2026-01-15',
        startTime: '10:00',
        endTime: '12:00',
        duration: 2,
        status: 'confirmed',
        attendees: 15,
        purpose: 'Quarterly Business Review',
        price: 100
      },
      {
        id: 'BK002',
        facilityId: '2',
        facilityName: 'Meeting Room B',
        location: 'Building 2',
        date: '2026-01-20',
        startTime: '14:00',
        endTime: '15:00',
        duration: 1,
        status: 'confirmed',
        attendees: 6,
        purpose: 'Team Sync Meeting',
        price: 30
      },
      {
        id: 'BK005',
        facilityId: '3',
        facilityName: 'Training Hall',
        location: 'Building 3',
        date: '2026-01-25',
        startTime: '09:00',
        endTime: '13:00',
        duration: 4,
        status: 'confirmed',
        attendees: 45,
        purpose: 'Product Training Workshop',
        price: 400
      }
    ],
    past: [
      {
        id: 'BK003',
        facilityId: '1',
        facilityName: 'Conference Room A',
        location: 'Building 1',
        date: '2026-01-05',
        startTime: '09:00',
        endTime: '12:00',
        duration: 3,
        status: 'completed',
        attendees: 20,
        purpose: 'Client Presentation',
        price: 150
      },
      {
        id: 'BK006',
        facilityId: '2',
        facilityName: 'Meeting Room B',
        location: 'Building 2',
        date: '2025-12-28',
        startTime: '15:00',
        endTime: '17:00',
        duration: 2,
        status: 'completed',
        attendees: 8,
        purpose: 'Project Planning',
        price: 60
      }
    ],
    cancelled: [
      {
        id: 'BK004',
        facilityId: '3',
        facilityName: 'Training Hall',
        location: 'Building 3',
        date: '2026-01-10',
        startTime: '11:00',
        endTime: '15:00',
        duration: 4,
        status: 'cancelled',
        attendees: 30,
        purpose: 'Annual Team Building',
        price: 400,
        cancelledDate: '2026-01-08'
      }
    ]
  };

  const currentBookings = mockBookings[activeTab] || [];

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    console.log('Cancelling booking:', selectedBooking.id);
    alert('Booking cancelled successfully! (This is a demo)');
    setShowCancelModal(false);
    setSelectedBooking(null);
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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
            My Bookings
          </h1>
          <p className="text-neutral-600">
            View and manage all your facility reservations
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <Card.Body className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-1">
                  {mockBookings.upcoming.length}
                </div>
                <div className="text-sm text-neutral-600">Upcoming Bookings</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-4xl font-bold text-neutral-800 mb-1">
                  {mockBookings.past.length}
                </div>
                <div className="text-sm text-neutral-600">Past Bookings</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-4xl font-bold text-error-600 mb-1">
                  {mockBookings.cancelled.length}
                </div>
                <div className="text-sm text-neutral-600">Cancelled</div>
              </Card.Body>
            </Card>

            <Link to="/facilities">
              <Button variant="primary" className="w-full">
                + New Booking
              </Button>
            </Link>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <Card className="mb-6">
              <Card.Body className="p-0">
                <div className="flex border-b border-neutral-200">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'upcoming'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    Upcoming ({mockBookings.upcoming.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'past'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    Past ({mockBookings.past.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'cancelled'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    Cancelled ({mockBookings.cancelled.length})
                  </button>
                </div>
              </Card.Body>
            </Card>

            {/* Booking List */}
            {currentBookings.length === 0 ? (
              <Card>
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
                      <Button variant="primary">
                        Browse Facilities
                      </Button>
                    </Link>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <div className="space-y-4">
                {currentBookings.map((booking) => (
                  <Card key={booking.id} hover className="border-l-4 border-primary-600">
                    <Card.Body>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left side - Booking Info */}
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
                                {booking.location}
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
                              <span>{booking.startTime} - {booking.endTime}</span>
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
                              <span className="font-semibold text-primary-600">${booking.price}</span>
                            </div>
                          </div>

                          <div className="bg-neutral-50 rounded px-3 py-2 text-sm text-neutral-600">
                            <span className="font-medium">Purpose:</span> {booking.purpose}
                          </div>

                          {booking.status === 'cancelled' && booking.cancelledDate && (
                            <div className="mt-2 text-sm text-error-600">
                              Cancelled on {formatDate(booking.cancelledDate)}
                            </div>
                          )}
                        </div>

                        {/* Right side - Actions */}
                        <div className="flex flex-col gap-2 md:min-w-[140px]">
                          <div className="text-right mb-2">
                            <div className="text-xs text-neutral-500 mb-1">Booking ID</div>
                            <div className="font-mono text-sm font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded border border-neutral-200">
                              {booking.id}
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
                                className="w-full text-error-600 hover:bg-error-50 hover:text-error-700"
                              >
                                Cancel Booking
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
                              <Button variant="primary" size="sm" className="w-full">
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
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