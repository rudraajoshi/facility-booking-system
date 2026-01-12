import PropTypes from 'prop-types';
import FacilityCard from './FacilityCard';
import { useNavigate } from 'react-router-dom';
const FacilityGrid = ({ facilities }) => {
  const navigate = useNavigate();
  const handleBook = (facilityId) => {
    navigate(`/booking/${facilityId}`);
  };
  const handleViewDetails = (facilityId) => {
    navigate(`/facilities/${facilityId}`);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
          onBook={handleBook}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
};
FacilityGrid.propTypes = {
  facilities: PropTypes.array.isRequired
};

export default FacilityGrid;