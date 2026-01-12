import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Badge from '../common/Badge';

const FilterSection = ({ filters, onFilterChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'meeting-room', label: 'Meeting Rooms' },
    { value: 'training-room', label: 'Training Rooms' },
    { value: 'sports-court', label: 'Sports Courts' },
    { value: 'event-hall', label: 'Event Halls' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'Available', label: 'Available' },
    { value: 'Limited', label: 'Limited' },
    { value: 'Booked', label: 'Booked' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low-High)' },
    { value: 'price-desc', label: 'Price (High-Low)' },
    { value: 'rating-desc', label: 'Rating (High-Low)' },
    { value: 'capacity-desc', label: 'Capacity (High-Low)' }
  ];

  const commonAmenities = [
    'Projector',
    'Whiteboard',
    'Video Conferencing',
    'WiFi',
    'Air Conditioning',
    'Parking'
  ];

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    onFilterChange('amenities', newAmenities);
  };

  const activeFilterCount = [
    filters.category !== 'all' ? 1 : 0,
    filters.minCapacity ? 1 : 0,
    filters.maxPrice ? 1 : 0,
    filters.status !== 'all' ? 1 : 0,
    filters.sortBy && filters.sortBy !== 'name-asc' ? 1 : 0,
    filters.amenities?.length || 0
  ].reduce((a, b) => a + b, 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <Card className="mb-6">
      <Card.Body className="p-4">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-neutral-800">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="info" size="sm">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button 
                onClick={onClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all
              </button>
            )}
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-neutral-600 hover:text-neutral-800 font-medium flex items-center gap-1"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
              <svg 
                className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* basic filters - compact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* category */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Category</label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* min capacity */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Min Capacity</label>
            <input
              type="number"
              placeholder="e.g., 10"
              value={filters.minCapacity}
              onChange={(e) => onFilterChange('minCapacity', e.target.value)}
              min="1"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* status */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* sort by - NEW */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Sort By</label>
            <select
              value={filters.sortBy || 'name-asc'}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* advanced filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            {/* max price */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Max Price (per hour)</label>
              <input
                type="number"
                placeholder="e.g., 100"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                min="1"
                className="w-full md:w-1/3 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* amenities */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {commonAmenities.map(amenity => (
                  <label 
                    key={amenity}
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full cursor-pointer transition-all
                      ${filters.amenities?.includes(amenity) 
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-500' 
                        : 'bg-neutral-100 text-neutral-700 border-2 border-transparent hover:border-neutral-300'
                      }
                    `}
                  >
                    <input 
                      type="checkbox"
                      checked={filters.amenities?.includes(amenity) || false}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="sr-only"
                    />
                    {filters.amenities?.includes(amenity) && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

FilterSection.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired
};

export default FilterSection;