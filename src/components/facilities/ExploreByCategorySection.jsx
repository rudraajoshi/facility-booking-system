import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import PropTypes from 'prop-types';

const ExploreByCategorySection = ({ facilities = [] }) => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    const sliderRef = useRef(null);

    const categories = ['All', ...new Set(facilities.map(f => f.type || f.category).filter(Boolean))];

    const facilitiesByCategory = facilities.reduce((acc, facility) => {
        const category = facility.type || facility.category || 'Other';
        if(!acc[category]){
            acc[category] = [];
        }
        acc[category].push(facility);
        return acc;
    }, {});

    const currentFacilities = activeCategory === 'All' ? facilities : facilitiesByCategory[activeCategory] || [];

    const showSlider = currentFacilities.length >= 4;

    const scroll = (direction) =>{
        if(sliderRef.current){
            const scrollAmount = 350;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    const handleViewDetails = (facilityId) => {
        navigate(`/facilities/${facilityId}`);
    };

    if(facilities.length === 0){
        return null;
    }

    return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <div className="container-custom">
        {/* section header */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Explore by Category{' '}
            <span className="text-neutral-400 dark:text-neutral-600 text-3xl">
              {currentFacilities.length}
            </span>
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mt-2">
            Browse facilities organized by type
          </p>
        </div>

        {/* category tabs */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-minimal">
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white shadow-lg hover:bg-primary-700'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* facilities */}
        <div className="relative">
          {showSlider && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-neutral-800 rounded-full p-3 shadow-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-neutral-800 rounded-full p-3 shadow-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            ref={sliderRef}
            className={`flex gap-6 ${
              showSlider ? 'overflow-x-auto scrollbar-minimal' : 'flex-wrap'
            }`}
          >
            {currentFacilities.map((facility) => (
              <div
                key={facility.id}
                className={`bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all group border border-neutral-200 dark:border-neutral-700 ${
                  showSlider ? 'flex-shrink-0 w-80' : 'flex-1 min-w-[300px] max-w-sm'
                }`}
              >
                {/* facility image */}
                <div className="relative overflow-hidden h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  
                  {/* status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      facility.status?.toLowerCase() === 'available' 
                        ? 'bg-success-500 text-white' 
                        : facility.status?.toLowerCase() === 'limited'
                        ? 'bg-warning-500 text-white'
                        : 'bg-error-500 text-white'
                    }`}>
                      {facility.status || 'Available'}
                    </span>
                  </div>
                </div>

                {/* facility details */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {facility.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {facility.description}
                      </p>
                    </div>
                  </div>

                  {/* facility info */}
                  <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {facility.capacity?.min}-{facility.capacity?.max} people
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {facility.location}
                    </span>
                  </div>

                  {/* price and action */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${facility.pricing?.hourly}
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentFacilities.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
              No facilities available in this category
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

ExploreByCategorySection.propTypes = {
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      type: PropTypes.string,
      category: PropTypes.string,
      status: PropTypes.string,
      location: PropTypes.string,
      capacity: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number
      }),
      pricing: PropTypes.shape({
        hourly: PropTypes.number
      })
    })
  )
};

export default ExploreByCategorySection;