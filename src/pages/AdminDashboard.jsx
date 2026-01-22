import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { BookingContext } from '@/context/BookingContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { bookings } = useContext(BookingContext);
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.facilityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
              <p className="text-sm text-neutral-600 mt-1">Manage all facility bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-700">Welcome, {user?.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-error-600 text-white rounded-md hover:bg-error-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Bookings" value={stats.total} color="bg-primary-50 text-primary-900" />
          <StatCard title="Pending" value={stats.pending} color="bg-yellow-50 text-yellow-900" />
          <StatCard title="Confirmed" value={stats.confirmed} color="bg-success-50 text-success-900" />
          <StatCard title="Completed" value={stats.completed} color="bg-blue-50 text-blue-900" />
          <StatCard title="Cancelled" value={stats.cancelled} color="bg-error-50 text-error-900" />
        </div>

        {/* filters and search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <FilterButton 
                active={filter === 'all'} 
                onClick={() => setFilter('all')}
                color="bg-primary-600"
              >
                All
              </FilterButton>
              <FilterButton 
                active={filter === 'pending'} 
                onClick={() => setFilter('pending')}
                color="bg-yellow-600"
              >
                Pending
              </FilterButton>
              <FilterButton 
                active={filter === 'confirmed'} 
                onClick={() => setFilter('confirmed')}
                color="bg-success-600"
              >
                Confirmed
              </FilterButton>
              <FilterButton 
                active={filter === 'completed'} 
                onClick={() => setFilter('completed')}
                color="bg-blue-600"
              >
                Completed
              </FilterButton>
              <FilterButton 
                active={filter === 'cancelled'} 
                onClick={() => setFilter('cancelled')}
                color="bg-error-600"
              >
                Cancelled
              </FilterButton>
            </div>
            <div className="flex-1 md:max-w-md md:ml-4">
              <input
                type="text"
                placeholder="Search by facility, user email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* bookings list */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              {filter === 'all' ? 'All Bookings' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings`}
              <span className="text-sm text-neutral-500 ml-2">({filteredBookings.length})</span>
            </h2>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              No bookings found
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredBookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`${color} p-6 rounded-lg shadow`}>
    <h3 className="text-sm font-medium opacity-75">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const FilterButton = ({ active, onClick, color, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md transition-colors ${
      active 
        ? `${color} text-white` 
        : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
    }`}
  >
    {children}
  </button>
);

const BookingRow = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-success-100 text-success-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-error-100 text-error-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="p-6 hover:bg-neutral-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900">{booking.facilityName || 'Facility'}</h3>
          <div className="mt-2 space-y-1 text-sm text-neutral-600">
            <p><strong>User:</strong> {booking.userName || 'N/A'} ({booking.userEmail || 'N/A'})</p>
            <p><strong>Date:</strong> {booking.date || 'N/A'}</p>
            <p><strong>Booking ID:</strong> {booking.id}</p>
          </div>
        </div>
        <div className="ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
            {booking.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;