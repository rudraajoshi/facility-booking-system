import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import SearchBar from '../components/facilities/SearchBar';
import FilterSection from '../components/facilities/FilterSection';
import FacilityCard from '../components/facilities/FacilityCard';
import FacilityGrid from '../components/facilities/FacilityGrid';
// refactored
// dummy data
const mockFacilities = [
    {
      id: 1,
      name: 'Conference Room A',
      status: 'Available',
      description: 'Spacious room with modern AV equipment',
      capacity: 20,
      location: 'Building 1',
      price: 50
    },
    {
      id: 2,
      name: 'Meeting Room B',
      status: 'Limited',
      description: 'Intimate space perfect for team meetings',
      capacity: 8,
      location: 'Building 2',
      price: 30
    },
    {
      id: 3,
      name: 'Training Hall',
      status: 'Booked',
      description: 'Large hall for workshops and training sessions',
      capacity: 50,
      location: 'Building 3',
      price: 100
    }
  ];

function Facilities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'all' });
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ type: 'all' });
  };

  const filteredFacilities = mockFacilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.amenities.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filters.type === 'all' || facility.type === filters.type;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
            Browse Facilities
          </h1>
          <p className="text-neutral-600">
            Explore a wide range of available facilities for your booking needs
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* search bar */}
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        {/* filter section */}
        <FilterSection filters={filters} onFilterChange={handleFilterChange} />

        {/* results count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            Showing <span className="font-semibold text-neutral-800">{filteredFacilities.length}</span> {filteredFacilities.length === 1 ? 'facility' : 'facilities'}
          </p>
        </div>

        {/* loading state */}
        {loading && (
          <div className="py-12">
            <Loading />
          </div>
        )}

        {/* facilities grid */}
        {!loading && filteredFacilities.length > 0 && (
          <FacilityGrid facilities={filteredFacilities} />
        )}

        {/* empty state */}
        {!loading && filteredFacilities.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">
              No facilities found
            </h2>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <Button variant="primary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Facilities;