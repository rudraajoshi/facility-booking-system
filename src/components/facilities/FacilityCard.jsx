import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { getImageUrl } from '@/services/api';

const FacilityCard = ({ facility, onBook, onViewDetails }) => {
  const navigate = useNavigate();

  const handleBookClick = (e) => {
    e.stopPropagation();
    console.log('🔵 Book clicked for facility ID:', facility.id);
    if (onBook) {
      onBook(facility.id);
    } else {
      navigate(`/booking/${facility.id}`);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    console.log('🔵 View Details clicked for facility ID:', facility.id);
    if (onViewDetails) {
      onViewDetails(facility.id);
    } else {
      navigate(`/facilities/${facility.id}`);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'neutral';
    switch (status.toLowerCase()) {
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

  return (
    <Card className="hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* images */}
      {facility.images && facility.images.length > 0 && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={getImageUrl(facility.images[0])}
            alt={facility.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('❌ Image failed to load:', facility.images[0]);
              e.target.src = '/images/placeholder-facility.jpg';
            }}
          />
          {facility.status && (
            <div className="absolute top-3 right-3">
              <Badge variant={getStatusColor(facility.status)}>
                {facility.status}
              </Badge>
            </div>
          )}
        </div>
      )}

      <Card.Body className="flex-1 flex flex-col">
        {/* T=title */}
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {facility.name}
        </h3>

        {/* description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2 flex-grow">
          {facility.description}
        </p>

        {/* location info */}
        <div className="space-y-2 mb-4">
          {/* city, state */}
          {(facility.city || facility.state) && (
            <div className="flex items-start gap-2 text-sm">
              <svg 
                className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" 
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
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                {typeof facility.city === 'object' ? facility.city?.city_name : facility.city}
                {facility.city && facility.state && ', '}
                {typeof facility.state === 'object' ? facility.state?.state_name : facility.state}
              </span>
            </div>
          )}

          {/* building */}
          <div className="flex items-start gap-2 text-sm">
            <svg 
              className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0" 
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
            <span className="text-neutral-600 dark:text-neutral-400">
              {facility.location}
            </span>
          </div>
        </div>

        {/* capacity */}
        {facility.capacity && (
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <span>
              {facility.capacity.min || 0}-{facility.capacity.max || 0} people
            </span>
          </div>
        )}

        {/* price and actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700 mt-auto">
          <div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Starting from</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ${facility.pricing?.hourly || 0}
              <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400">/hour</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="text-sm"
            >
              View Details
            </Button>
            {facility.status?.toLowerCase() !== 'booked' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleBookClick}
                className="text-sm"
              >
                Book Now
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

FacilityCard.propTypes = {
  facility: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    capacity: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    pricing: PropTypes.shape({
      hourly: PropTypes.number,
      halfDay: PropTypes.number,
      fullDay: PropTypes.number,
    }),
    location: PropTypes.string.isRequired,
    city: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        city_id: PropTypes.string,
        city_name: PropTypes.string,
      })
    ]),
    state: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        state_id: PropTypes.string,
        state_name: PropTypes.string,
      })
    ]),
    status: PropTypes.string,
  }).isRequired,
  onBook: PropTypes.func,
  onViewDetails: PropTypes.func,
};

export default FacilityCard;