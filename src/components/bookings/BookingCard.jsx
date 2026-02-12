import { useContext } from 'react';
import { BookingContext } from '@/context/BookingContext';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

const BookingCard = ({ booking, showActions = true, onStatusChange }) => {
  const { updateBookingStatus, cancelBooking } = useContext(BookingContext);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateBookingStatus(booking.id, newStatus);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(booking.id);
        if (onStatusChange) onStatusChange();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5); 
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {booking.facilityName}
          </h3>
          <p className="text-sm text-gray-500">{booking.facilityLocation}</p>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status?.toUpperCase()}
        </Badge>
      </div>

      {/* booking details */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">User</p>
            <p className="text-sm text-gray-900">{booking.userName}</p>
            <p className="text-xs text-gray-500">{booking.userEmail}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Booking ID</p>
            <p className="text-sm text-gray-900">#{booking.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Date</p>
            <p className="text-sm text-gray-900">{formatDate(booking.date)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Time</p>
            <p className="text-sm text-gray-900">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
          </div>
        </div>
      </div>

      {/* actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {booking.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => handleStatusUpdate('confirmed')}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
          
          {booking.status === 'confirmed' && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusUpdate('completed')}
              >
                Mark Complete
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}

          {booking.status === 'cancelled' && (
            <p className="text-sm text-gray-500 italic">This booking has been cancelled</p>
          )}

          {booking.status === 'completed' && (
            <p className="text-sm text-gray-500 italic">This booking has been completed</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;