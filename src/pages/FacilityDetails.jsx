import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';

function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // fetching details from api
  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/facilities/${id}`);
        const result = await response.json();

        if (result.success) {
          setFacility(result.data);
          console.log('Facility loaded:', result.data);
        } else {
          setError(result.error || 'Facility not found');
        }
      } catch (err) {
        setError('Failed to load facility details');
        console.error('Error fetching facility:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchFacilityDetails();
    }
  }, [id]);
  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };
  if (loading) {
    return <Loading size="lg" text="Loading facility details..." fullscreen />;
  }
  if (error || !facility) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <Card.Body className="p-8">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">
              {error || 'Facility Not Found'}
            </h2>
            <p className="text-neutral-600 mb-6">
              The facility you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/facilities">
              <Button variant="primary">Browse All Facilities</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }
  const getStatusColor = (status) => {
    const statusMap = {
      'Available': 'success',
      'Limited': 'warning',
      'Booked': 'error'
    };
    return statusMap[status] || 'gray';
  };
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container-custom">
        <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-600">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/facilities" className="hover:text-primary-600">Facilities</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{facility.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lleft column */}
          <div className="lg:col-span-2 space-y-6">
            {/* images */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-neutral-200 overflow-hidden">
                  <img
                    src={facility.images?.[selectedImage] || facility.image || '/images/placeholder.jpg'}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                {/* status badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant={getStatusColor(facility.status)} size="lg">
                    {facility.status}
                  </Badge>
                </div>
                {facility.images && facility.images.length > 1 && (
                  <div className="p-4 bg-white border-t border-neutral-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {facility.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? 'border-primary-600 shadow-md'
                              : 'border-neutral-200 hover:border-primary-300'
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
                  </div>
                )}
              </div>
            </Card>
            {/* facility details */}
            <Card>
              <Card.Body>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                      {facility.name}
                    </h1>
                    <div className="flex items-center gap-4 text-neutral-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{facility.location}</span>
                      </div>
                      {facility.rating && (
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">{facility.rating}</span>
                          {facility.reviewCount && (
                            <span className="text-sm">({facility.reviewCount} reviews)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-700 leading-relaxed mb-6">
                  {facility.description}
                </p>
                {/* capacity info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-primary-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {facility.capacity?.min || facility.capacity}-{facility.capacity?.max || facility.capacity}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Capacity</div>
                  </div>
                  {facility.pricing && (
                    <>
                      <div className="bg-accent-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-accent-600">
                          ${facility.pricing.hourly || facility.pricePerHour}
                        </div>
                        <div className="text-sm text-neutral-600 mt-1">Per Hour</div>
                      </div>
                      {facility.pricing.halfDay && (
                        <div className="bg-success-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-success-600">
                            ${facility.pricing.halfDay}
                          </div>
                          <div className="text-sm text-neutral-600 mt-1">Half Day</div>
                        </div>
                      )}
                      {facility.pricing.fullDay && (
                        <div className="bg-warning-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-warning-600">
                            ${facility.pricing.fullDay}
                          </div>
                          <div className="text-sm text-neutral-600 mt-1">Full Day</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {/* operating hours */}
                {facility.operatingHours && (
                  <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Operating Hours
                    </h3>
                    <p className="text-neutral-700">
                      {facility.operatingHours.start} - {facility.operatingHours.end}
                    </p>
                  </div>
                )}
                {/* amenities */}
                {facility.amenities && facility.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {facility.amenities.map((amenity, index) => (
                        <Badge key={index} variant="gray" size="md">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {/* features */}
                {facility.features && facility.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {facility.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-neutral-700">
                          <svg className="w-5 h-5 text-success-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* rules */}
                {facility.rules && facility.rules.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">Facility Rules</h3>
                    <ul className="space-y-2">
                      {facility.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2 text-neutral-700">
                          <svg className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
          {/* right column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <Card.Body className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Book This Facility
                </h3>
                {facility.pricing && (
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      ${facility.pricing.hourly || facility.pricePerHour}
                      <span className="text-base font-normal text-neutral-600">/hour</span>
                    </div>
                    {facility.pricing.halfDay && (
                      <div className="text-sm text-neutral-600">
                        ${facility.pricing.halfDay} for half day
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Status</span>
                    <Badge variant={getStatusColor(facility.status)}>
                      {facility.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Capacity</span>
                    <span className="font-medium text-neutral-900">
                      {facility.capacity?.min || facility.capacity}-{facility.capacity?.max || facility.capacity} people
                    </span>
                  </div>
                  {facility.category && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Category</span>
                      <span className="font-medium text-neutral-900 capitalize">
                        {facility.category.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mb-3"
                  onClick={handleBookNow}
                  disabled={facility.status === 'Booked'}
                >
                  {facility.status === 'Booked' ? 'Fully Booked' : 'Book Now'}
                </Button>

                <Link to="/facilities">
                  <Button variant="outline" size="md" className="w-full">
                    Browse Other Facilities
                  </Button>
                </Link>

                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500 text-center">
                    Need help? <Link to="/contact-us" className="text-primary-600 hover:underline">Contact us</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacilityDetails;