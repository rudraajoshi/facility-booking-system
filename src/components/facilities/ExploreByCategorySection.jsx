import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityCard from '@/components/facilities/FacilityCard';
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

    const handleBook = (facilityId) => {
        navigate(`/booking/${facilityId}`);
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

        {/* facilities display */}
        {currentFacilities.length > 0 ? (
          showSlider ? (
            <div className="relative">
              {/* left arrow */}
              <button 
                onClick={() => scroll('left')} 
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 -ml-4" 
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* scrollable container */}
              <div 
                ref={sliderRef} 
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {currentFacilities.map((facility) => (
                  <div key={facility.id} className="flex-shrink-0 w-[350px]">
                    <FacilityCard
                      facility={facility}
                      onBook={handleBook}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                ))}
              </div>

              {/* right arrow */}
              <button 
                onClick={() => scroll('right')} 
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 -mr-4" 
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentFacilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  onBook={handleBook}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )
        ) : (
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
      <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none;}`}</style>
    </section>
  );
};

ExploreByCategorySection.propTypes = {
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      category: PropTypes.string,
    })
  ).isRequired,
};

export default ExploreByCategorySection;