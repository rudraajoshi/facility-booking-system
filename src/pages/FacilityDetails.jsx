import { useParams, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

function FacilityDetails() {
  const { id } = useParams();

  // dummy facility data
  const facility = {
    id: id,
    name: id === '1' ? 'Conference Room A' : id === '2' ? 'Meeting Room B' : 'Training Hall',
    description: id === '1' 
      ? 'Spacious room with modern AV equipment perfect for large meetings and presentations'
      : id === '2'
      ? 'Intimate space perfect for team meetings and brainstorming sessions'
      : 'Large hall for workshops and training sessions with state-of-the-art facilities',
    capacity: id === '1' ? 20 : id === '2' ? 8 : 50,
    location: id === '1' ? 'Building 1' : id === '2' ? 'Building 2' : 'Building 3',
    price: id === '1' ? 50 : id === '2' ? 30 : 100,
    status: id === '1' ? 'Available' : id === '2' ? 'Limited' : 'Booked',
    amenities: [
      'WiFi',
      'Projector',
      'Whiteboard',
      'Video Conferencing',
      'Air Conditioning',
      'Coffee Machine'
    ],
    image: '/images/facilities/placeholder.jpg'
  };

  // Map status to badge variant
  const getStatusVariant = (status) => {
    const statusMap = {
      'Available': 'success',
      'Limited': 'warning',
      'Booked': 'error'
    };
    return statusMap[status] || 'gray';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Back Navigation - Enhanced */}
      <div className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="container-custom py-4">
          <Link 
            to="/facilities" 
            className="group inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Facilities
          </Link>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden group">
              <div className="aspect-video bg-gradient-to-br from-primary-100 via-primary-200 to-accent-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse-slow"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-300 rounded-full blur-3xl animate-pulse-slow"></div>
                </div>
                
                <div className="text-center relative z-10">
                  <div className="text-6xl mb-2 animate-bounce-slow">🏢</div>
                  <p className="text-neutral-600 font-medium">Image Gallery Coming Soon</p>
                  <p className="text-sm text-neutral-500 mt-1">Professional photos will be displayed here</p>
                </div>
              </div>
            </Card>

            {/* Facility Info */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Card.Header className="border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">
                      {facility.name}
                    </h1>
                    <div className="flex items-center gap-6 text-neutral-600">
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-semibold">{facility.capacity} people</span>
                      </span>
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-error-50 rounded-lg border border-error-100">
                        <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">{facility.location}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusVariant(facility.status)} size="md">
                      {facility.status === 'Available' && (
                        <span className="relative flex h-2 w-2 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
                        </span>
                      )}
                      {facility.status}
                    </Badge>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary-600 rounded-full"></span>
                    Description
                  </h2>
                  <p className="text-neutral-700 leading-relaxed text-base">
                    {facility.description}
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary-600 rounded-full"></span>
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {facility.amenities.map((amenity, index) => (
                      <div 
                        key={index}
                        className="group flex items-center gap-3 p-3 bg-neutral-50 hover:bg-primary-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-success-100 group-hover:bg-success-200 rounded-lg flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-800 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Information */}
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border-l-4 border-primary-500 shadow-sm">
                  <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Booking Information
                  </h3>
                  <ul className="space-y-2.5 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold mt-0.5">•</span>
                      <span>Minimum booking duration: <span className="font-semibold">1 hour</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold mt-0.5">•</span>
                      <span>Maximum booking duration: <span className="font-semibold">8 hours</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold mt-0.5">•</span>
                      <span>Cancellation allowed up to <span className="font-semibold">24 hours</span> before booking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold mt-0.5">•</span>
                      <span>Setup and cleanup time <span className="font-semibold">included</span></span>
                    </li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-2 border-primary-100">
              <Card.Header className="border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-accent-50">
                <Card.Title className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book This Facility
                </Card.Title>
              </Card.Header>
              
              <Card.Body className="space-y-6">
                {/* Pricing */}
                <div className="text-center py-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="text-5xl font-bold text-white mb-2">
                      ${facility.price}
                    </div>
                    <div className="text-primary-100 font-medium">per hour</div>
                  </div>
                </div>

                {/* Quick Booking Form */}
                <div className="space-y-4">
                  <Input 
                    label={
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Select Date
                      </span>
                    }
                    type="date"
                    name="date"
                    className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                    min={new Date().toISOString().split('T')[0]}
                  />

                  <Input 
                    label={
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start Time
                      </span>
                    }
                    type="time"
                    name="time"
                    className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  />

                  <Input 
                    label={
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Duration (hours)
                      </span>
                    }
                    type="select"
                    name="duration"
                    className="border-2 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  >
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                    <option>4 hours</option>
                    <option>6 hours</option>
                    <option>8 hours</option>
                  </Input>

                  {/* Total Price */}
                  <div className="bg-gradient-to-br from-neutral-50 to-primary-50 rounded-xl p-5 border-2 border-neutral-200 shadow-sm">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-600">Base Price:</span>
                      <span className="font-semibold text-neutral-900">${facility.price}/hour</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-neutral-600">Duration:</span>
                      <span className="font-semibold text-neutral-900">1 hour</span>
                    </div>
                    <div className="border-t-2 border-neutral-300 pt-4 flex justify-between items-center">
                      <span className="font-bold text-neutral-900 text-lg">Total:</span>
                      <span className="font-bold text-primary-600 text-2xl">
                        ${facility.price}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link to={`/booking/${facility.id}`} className="block">
                    <Button
                      variant={facility.status === 'Booked' ? 'ghost' : 'primary'}
                      size="lg"
                      disabled={facility.status === 'Booked'}
                      className="w-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      {facility.status === 'Booked' ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Currently Unavailable
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Proceed to Booking
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      )}
                    </Button>
                  </Link>

                  {/* Contact Info */}
                  <div className="text-center pt-4 border-t-2 border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-3 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Need help with booking?
                    </p>
                    <button className="group text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Support
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Availability Calendar Section */}
        <div className="mt-12 animate-fade-in-up">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Card.Header className="bg-gradient-to-r from-neutral-50 to-white border-b-2 border-neutral-200">
              <Card.Title className="flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Availability Calendar
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="bg-gradient-to-br from-primary-50 via-accent-50 to-primary-50 border-2 border-dashed border-primary-300 rounded-xl p-16 text-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-primary-400 rounded-full blur-3xl animate-pulse-slow"></div>
                  <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent-400 rounded-full blur-3xl animate-pulse-slow"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-7xl mb-6 animate-bounce-slow">📅</div>
                  <h3 className="text-3xl font-bold text-neutral-900 mb-3">
                    Calendar View Coming Soon
                  </h3>
                  <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                    Interactive calendar showing available time slots will be displayed here.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-600">
                    <span className="inline-block w-2 h-2 bg-primary-600 rounded-full animate-ping"></span>
                    <span className="font-medium">Phase 2 Development</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FacilityDetails;