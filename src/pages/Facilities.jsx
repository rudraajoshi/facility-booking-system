import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import SearchBar from '@/components/facilities/SearchBar';
import FilterSection from '@/components/facilities/FilterSection';
import FacilityGrid from '@/components/facilities/FacilityGrid';

function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
    category: 'all',
    minCapacity: '',
    maxPrice: '',
    status: 'all',
    amenities: [],
    sortBy: 'name-asc' 
  });

  // api call for search and filter
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        //query parameters
        const params = new URLSearchParams();
        
        if (searchTerm && searchTerm.trim()) {
          params.append('search', searchTerm.trim());
        }
        
        if (filters.category && filters.category !== 'all') {
          params.append('category', filters.category);
        }
        
        if (filters.minCapacity) {
          params.append('minCapacity', filters.minCapacity);
        }
        
        if (filters.maxPrice) {
          params.append('maxPrice', filters.maxPrice);
        }
        
        if (filters.status && filters.status !== 'all') {
          params.append('status', filters.status);
        }
        
        if (filters.amenities && filters.amenities.length > 0) {
          params.append('amenities', filters.amenities.join(','));
        }
        
        if (filters.sortBy) {
          params.append('sortBy', filters.sortBy);
        }

        const queryString = params.toString();
        const url = `/api/facilities${queryString ? `?${queryString}` : ''}`;

        console.log('🔍 Fetching facilities with params:', queryString);

        const response = await fetch(url, {
          signal: controller.signal
        });
        
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch facilities');
        }

        if (isMounted && result.success) {
          setFacilities(result.data);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError(err.message);
          console.error('Error fetching facilities:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFacilities();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchTerm, filters]); 

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
      amenities: [],
      sortBy: 'name-asc'
    });
  };

  const getSortedFacilities = () => {
    let results = [...facilities];
    
    if (filters.sortBy) {
      results = results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc':
            return a.pricing.hourly - b.pricing.hourly;
          case 'price-desc':
            return b.pricing.hourly - a.pricing.hourly;
          case 'rating-desc':
            return b.rating - a.rating;
          case 'capacity-desc':
            return b.capacity.max - a.capacity.max;
          default:
            return 0;
        }
      });
    }
    
    return results;
  };

  const displayFacilities = getSortedFacilities();

  // error state
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
            Showing <span className="font-semibold text-neutral-800">{displayFacilities.length}</span> {displayFacilities.length === 1 ? 'facility' : 'facilities'}
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
        {!loading && displayFacilities.length > 0 && (
          <FacilityGrid facilities={displayFacilities} />
        )}

        {/* empty state */}
        {!loading && displayFacilities.length === 0 && (
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