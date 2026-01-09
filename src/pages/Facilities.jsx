import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import SearchBar from '../components/facilities/SearchBar';
import FilterSection from '../components/facilities/FilterSection';
import FacilityGrid from '../components/facilities/FacilityGrid';
import { useFacilities } from '../hooks/useFacilities';

function Facilities() {
  const { 
    facilities, 
    loading, 
    error
  } = useFacilities();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
    category: 'all',
    minCapacity: '',
    maxPrice: '',
    status: 'all',
    amenities: []
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ 
      category: 'all',
      minCapacity: '',
      maxPrice: '',
      status: 'all',
      amenities: []
    });
  };

  // Apply search and filters
  const getFilteredFacilities = () => {
    let results = [...facilities];
    
    // Apply search first
    if (searchTerm && searchTerm.trim() !== '') {
      const lowercaseQuery = searchTerm.toLowerCase().trim();
      results = results.filter(facility =>
        facility.name.toLowerCase().includes(lowercaseQuery) ||
        facility.description.toLowerCase().includes(lowercaseQuery) ||
        facility.location.toLowerCase().includes(lowercaseQuery) ||
        facility.amenities.some(amenity =>
          amenity.toLowerCase().includes(lowercaseQuery)
        )
      );
    }
    
    // Then apply filters to the search results
    if (filters.category && filters.category !== 'all') {
      results = results.filter(f => f.category === filters.category);
    }
    
    if (filters.minCapacity) {
      results = results.filter(f => f.capacity.max >= parseInt(filters.minCapacity));
    }
    
    if (filters.maxPrice) {
      results = results.filter(f => f.pricing.hourly <= parseInt(filters.maxPrice));
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(f => 
        filters.amenities.every(amenity => f.amenities.includes(amenity))
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      results = results.filter(f => f.status === filters.status);
    }
    
    return results;
  };

  const filteredFacilities = getFilteredFacilities();

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8">
          <div className="text-error-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Error Loading Facilities</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

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
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />

        {/* filter section */}
        <FilterSection 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* results count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            Showing <span className="font-semibold text-neutral-800">{filteredFacilities.length}</span> {filteredFacilities.length === 1 ? 'facility' : 'facilities'}
            {searchTerm && (
              <span> for "<span className="font-semibold text-neutral-800">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* loading state */}
        {loading && (
          <div className="py-12">
            <Loading size="lg" text="Loading facilities..." />
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
              {searchTerm 
                ? `No results found for "${searchTerm}". Try adjusting your search or filters.`
                : 'Try adjusting your filters to find what you\'re looking for.'
              }
            </p>
            <Button variant="primary" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Facilities;