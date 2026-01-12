import Card from './Card';
import Badge from './Badge';
import Button from './Button';

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
          <span>👥 {facility.capacity} people</span>
          <span>📍 {facility.location}</span>
        </div>
      </Card.Body>
      <Card.Footer>
        <span className="text-sm text-neutral-500">${facility.price}/hour</span>
        {facility.status === 'Booked' ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(facility.id)}
          >
            View Details
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onBook(facility.id)}
          >
            Book Now
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default FacilityCard;