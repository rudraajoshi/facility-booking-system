import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useFacilities } from '@/hooks/useFacilities';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const {user, logout} = useAuth();
    const {bookings, loading: bookingsLoading} = useBookings();
    const {facilities} = useFacilities();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingBookings: 0,
        pastBookings: 0,
        cancelledBookings: 0
    });

    useEffect(() => {
        if(bookings){
            const now = new Date();
            const total = bookings.length;
            const upcoming = bookings.filter(b => new Date(b.date) >= now && b.status !== 'cancelled').length;
            const past = bookings.filter(b => new Date(b.date) < now && b.status !== 'cancelled').length;
            const cancelled = bookings.filter(b => b.status === 'cancelled').length;

            setStats({
                totalBookings: total,
                upcomingBookings: upcoming,
                pastBookings: past,
                cancelledBookings: cancelled
            });
        }
    }, [bookings]);

    const handleLogout = () =>{
        logout();
        navigate('/login');
    };

    const getUpcomingBookings = () =>{
        if(!bookings) return [];
        const now = new Date();
        return bookings
            .filter(b => new Date(b.date) >= now && b.status !== 'cancelled')
            .sort((a,b) => new Date(a.date) - new Date(b.date))
            .slice(0,5);
    };

    const getFacilityName = (facilityId) => {
        const facility = facilities?.find(f => f.id === facilityId);
        return facility?.name || 'Unknown Facility';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US',{
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if(bookingsLoading){
        return(
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return(
        <div className="min-h-screen bg-gray-50">
            {/* header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-600">Welcome back, {user?.name || 'User'}!</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                    Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                            </div>
                        </div>
                    </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pastBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Cancelled</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
                        </div>
                    </div>
                </div>
            </div>

        {/* quick actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/facilities')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                    >
                        <div className="text-blue-600 mb-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">New Booking</h3>
                        <p className="text-sm text-gray-600">Book a new facility</p>
                    </button>

                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                    >
                        <div className="text-blue-600 mb-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">View All Bookings</h3>
                        <p className="text-sm text-gray-600">Manage your bookings</p>
                    </button>

                    <button
                        onClick={() => navigate('/facilities')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                    >
                        <div className="text-blue-600 mb-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                            <h3 className="font-semibold text-gray-900">Browse Facilities</h3>
                            <p className="text-sm text-gray-600">Explore available facilities</p>
                    </button>
                </div>
            </div>

        {/* upcoming */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {getUpcomingBookings().length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming bookings</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new booking.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/facilities')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                 Book a Facility
                                </button>
                            </div>
                        </div>
                    ) : (
                         getUpcomingBookings().map((booking) => (
                            <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {getFacilityName(booking.facilityId)}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(booking.date)}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {booking.timeSlot || 'Time not specified'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {booking.status || 'Confirmed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {getUpcomingBookings().length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            View all bookings →
                        </button>
                    </div>
                )}
                </div>
            </main>
        </div>
    );
};
export default Dashboard;