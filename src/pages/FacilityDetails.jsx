import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFacilities } from '@/hooks/useFacilities';
import { useBookings } from '@/hooks/useBookings';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Loading from '@/components/common/Loading';
import Card from '@/components/common/Card';
import Calendar from '@/components/booking/Calendar';

const FacilityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFacilityById } = useFacilities();
  const { bookings } = useBookings();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  useEffect(() => {
    const loadFacility = async () => {
      setLoading(true);
      try {
        console.log('🔍 Loading facility with ID:', id);
        const facilityData = getFacilityById(id);
        
        if (facilityData) {
          console.log('✅ Found facility in context:', facilityData);
          setFacility(facilityData);
        } else {

          console.log('⚠️ Facility not in context, fetching from API...');
          const response = await fetch(`/api/facilities/${id}`);
          const result = await response.json();
          
          console.log('📡 API Response:', result);
          
          if (result.success) {
            console.log('✅ Facility loaded from API:', result.data);
            setFacility(result.data);
          } else {
            console.error('❌ Facility not found in API');
          }
        }
      } catch (error) {
        console.error('❌ Error loading facility:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadFacility();
    }
  }, [id, getFacilityById]);


  const getExistingBookings = () => {
    if (!bookings || !id) return {};
    
    const facilityBookings = bookings.filter(b => 
      (b.facility_id === id || b.facility_id === facility?.id) && 
      b.booking_status !== 'cancelled'
    );

    const bookingsByDate = {};
    facilityBookings.forEach(booking => {
      const date = booking.booking_date;
      if (!bookingsByDate[date]) {
        bookingsByDate[date] = [];
      }
      if (booking.start_time) {
        bookingsByDate[date].push(booking.start_time);
      }
    });
    
    return bookingsByDate;
  };

  const handleDateTimeSelect = (dateTime) => {
    console.log('📅 Date/Time selected:', dateTime);
    setSelectedDateTime(dateTime);
  };

  const handleBookNow = () => {
    if (selectedDateTime) {

      navigate(`/booking/${id}`, { 
        state: { 
          selectedDate: selectedDateTime.date,
          selectedTime: selectedDateTime.time
        } 
      });
    } else {
      navigate(`/booking/${id}`);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'neutral';
    const statusStr = typeof status === 'string' ? status : status.toString();
    switch (statusStr.toLowerCase()) {
      case 'available':
        return 'success';
      case 'limited':
        return 'warning';
      case 'booked':
        return 'error';
      default:
        return 'neutral';
    }
  };


  const getCityValue = () => {
    if (!facility?.city) return '';
    return typeof facility.city === 'object' ? facility.city.city_name : facility.city;
  };

  const getStateValue = () => {
    if (!facility?.state) return '';
    return typeof facility.state === 'object' ? facility.state.state_name : facility.state;
  };

  const getStatusValue = () => {
    if (!facility?.status) return 'Unknown';
    return typeof facility.status === 'object' ? facility.status.status_name : facility.status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading facility details..." />
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Facility Not Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The facility you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/facilities')}>
            Browse All Facilities
          </Button>
        </div>
      </div>
    );
  }

  const cityValue = getCityValue();
  const stateValue = getStateValue();
  const statusValue = getStatusValue();
  const existingBookings = getExistingBookings();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Facilities
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Body className="p-0">
                {facility.images && facility.images.length > 0 ? (
                  <>
                    <div className="relative h-96 overflow-hidden rounded-t-lg">
                      <img
                        src={facility.images[selectedImage]}
                        alt={facility.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-facility.jpg';
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant={getStatusColor(statusValue)} size="lg">
                          {statusValue}
                        </Badge>
                      </div>
                    </div>

                    {/* Thumbnail Images */}
                    {facility.images.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {facility.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImage === index
                                ? 'border-primary-600 ring-2 ring-primary-200'
                                : 'border-neutral-200 hover:border-primary-400'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${facility.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-96 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-t-lg">
                    <p className="text-neutral-500">No image available</p>
                  </div>
                )}
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  {facility.name}
                </h1>

                <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">

                  {(cityValue || stateValue) && (
                    <div className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Location</p>
                        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          {cityValue}{cityValue && stateValue && ', '}{stateValue}
                        </p>
                      </div>
                    </div>
                  )}


                  {facility.location && (
                    <div className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Building</p>
                        <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                          {facility.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>


                {facility.description && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                      About this facility
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                )}


                {facility.capacity && (
                  <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                      Capacity
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                        />
                      </svg>
                      <span className="text-lg">
                        {facility.capacity.min || 0} - {facility.capacity.max || 0} people
                      </span>
                    </div>
                  </div>
                )}

                {facility.amenities && facility.amenities.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Amenities & Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {facility.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {facility.operatingHours && (
                  <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                      Operating Hours
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <p className="text-lg">
                        {facility.operatingHours.start} - {facility.operatingHours.end}
                      </p>
                    </div>
                  </div>
                )}


                {(facility.floor || facility.area || facility.type) && (
                  <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Additional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {facility.type && (
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Type</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{facility.type}</p>
                          </div>
                        </div>
                      )}
                      {facility.floor && (
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Floor</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{facility.floor}</p>
                          </div>
                        </div>
                      )}
                      {facility.area && (
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Area</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{facility.area} sq ft</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {facility.rules && facility.rules.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                      Facility Rules
                    </h3>
                    <ul className="space-y-2">
                      {facility.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Calendar 
              facilityId={id}
              onDateSelect={handleDateTimeSelect}
              existingBookings={existingBookings}
            />
          </div>


          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <Card.Body>
                  {facility.pricing && (
                    <>
                      <div className="mb-6">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Starting from</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                            ${facility.pricing.hourly || 0}
                          </span>
                          <span className="text-neutral-600 dark:text-neutral-400">/hour</span>
                        </div>
                      </div>
                      {(facility.pricing.halfDay || facility.pricing.fullDay) && (
                        <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                          {facility.pricing.halfDay && (
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">Half Day</span>
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                ${facility.pricing.halfDay}
                              </span>
                            </div>
                          )}
                          {facility.pricing.fullDay && (
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">Full Day</span>
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                ${facility.pricing.fullDay}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}


                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 dark:text-neutral-400">Status</span>
                      <Badge variant={getStatusColor(statusValue)}>
                        {statusValue}
                      </Badge>
                    </div>

                    {facility.rating && (
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600 dark:text-neutral-400">Rating</span>
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {facility.rating}
                          </span>
                          {facility.reviewCount && (
                            <span className="text-sm text-neutral-500">
                              ({facility.reviewCount} reviews)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedDateTime && (
                    <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-1">
                        Selected Date & Time
                      </p>
                      <p className="text-primary-700 dark:text-primary-300">
                        {new Date(selectedDateTime.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-primary-700 dark:text-primary-300">
                        {selectedDateTime.time}
                      </p>
                    </div>
                  )}


                  {statusValue.toLowerCase() !== 'booked' ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleBookNow}
                    >
                      {selectedDateTime ? 'Continue to Booking' : 'Book Now'}
                    </Button>
                  ) : (
                    <Button variant="neutral" size="lg" className="w-full" disabled>
                      Currently Unavailable
                    </Button>
                  )}

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-4">
                    You won't be charged yet
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;