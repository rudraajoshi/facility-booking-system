import { useState } from 'react';
import { getImageUrl } from '@/services/api';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';

const FacilityCard = ({ facility, onBook, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);

  const getBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'limited':
        return 'warning';
      case 'booked':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleImageError = () => {
    console.error('❌ Image failed to load:', facility.image_url);
    setImageError(true);
  };

  // get the proper image URL
  const imageUrl = getImageUrl(facility.image_url);

  return (
    <Card hover>
      {/* image section */}
      <div className="w-full h-48 overflow-hidden bg-neutral-100">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={facility.facility_name || facility.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-4xl">🏢</span>
          </div>
        )}
      </div>
      
      <Card.Header>
        <Card.Title>{facility.facility_name || facility.name}</Card.Title>
        <Badge variant={getBadgeVariant(facility.availability_status || facility.status)}>
          {facility.availability_status || facility.status}
        </Badge>
      </Card.Header>
      <Card.Body>
        <p className="text-neutral-600 mb-4">{facility.description}</p>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span>👥 {facility.capacity_min}-{facility.capacity_max || facility.capacity} people</span>
          <span>📍 {facility.location || `${facility.city?.city_name}, ${facility.state?.state_name}`}</span>
        </div>
      </Card.Body>
      <Card.Footer>
        <span className="text-sm text-neutral-500">
          ${facility.price_per_hour || facility.price}/hour
        </span>
        {(facility.availability_status === 'booked' || facility.status === 'Booked') ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(facility.facility_id || facility.id)}
          >
            View Details
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onBook(facility.facility_id || facility.id)}
          >
            Book Now
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default FacilityCard;