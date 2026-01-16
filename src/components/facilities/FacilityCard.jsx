import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FacilityCard = ({ facility, onBook, onViewDetails }) => {
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

  const isBooked = facility.status.toLowerCase() === 'booked';

  return (
    <Card hover>
      <Card.Header>
        <Card.Title>{facility.name}</Card.Title>
        <Badge variant={getBadgeVariant(facility.status)}>
          {facility.status}
        </Badge>
      </Card.Header>
      
      <Card.Body>
        <p className="text-neutral-600 mb-4">{facility.description}</p>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span>👥 {facility.capacity.min}-{facility.capacity.max} people</span>
          <span>📍 {facility.location}</span>
        </div>
      </Card.Body>
      
      <Card.Footer className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">
          ${facility.pricing.hourly}/hour
        </span>
  
        <div className="flex gap-2">
          <Link to={`/facilities/${facility.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>

          {!isBooked && (
            <Link to={`/booking/${facility.id}`}>
              <Button variant="primary" size="sm">
                Book Now
              </Button>
            </Link>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

FacilityCard.propTypes = {
  facility: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired
    }).isRequired,
    pricing: PropTypes.shape({
      hourly: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  onBook: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
};

export default FacilityCard;