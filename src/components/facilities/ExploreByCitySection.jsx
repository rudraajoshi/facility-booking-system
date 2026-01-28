import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FacilityCard from '@/components/facilities/FacilityCard';

const ExploreByCitySection = ({ facilities }) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('all');
  const scrollContainerRef = useRef(null);

  const citiesWithState = facilities
    .filter(f => f.city && f.state)
    .map(f => ({ city: f.city, state: f.state, fullName: `${f.city}, ${f.state}` }))
    .reduce((acc, curr) => {
      const key = curr.fullName;
      if (!acc.find(item => item.fullName === key)) {
        acc.push(curr);
      }
      return acc;
    }, [])
    .sort((a, b) => a.city.localeCompare(b.city));

  const filteredFacilities = selectedCity === 'all' 
    ? facilities 
    : facilities.filter(f => f.city === selectedCity.split(',')[0].trim());

  const handleBook = (facilityId) => {
    navigate(`/booking/${facilityId}`);
  };

  const handleViewDetails = (facilityId) => {
    navigate(`/facilities/${facilityId}`);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (citiesWithState.length === 0) {
    return null;
  }

  const showSlider = filteredFacilities.length > 4;

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div className="container-custom">
        {/* header */}
        <div className="text-left mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Explore by City
            <span className="text-2xl text-neutral-500 dark:text-neutral-400 ml-3">
              {filteredFacilities.length}
            </span>
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Find facilities in your preferred location
          </p>
        </div>

        {/* state filter */}
        <div className="flex flex-wrap justify-start gap-3 mb-12">
          <button onClick={() => setSelectedCity('all')} className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCity === 'all' ? 'bg-primary-600 text-white shadow-lg' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
            All Cities
          </button>
          {citiesWithState.map((cityInfo) => {
            const count = facilities.filter(f => f.city === cityInfo.city).length;
            return (
              <button key={cityInfo.fullName} onClick={() => setSelectedCity(cityInfo.fullName)} className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCity === cityInfo.fullName ? 'bg-primary-600 text-white shadow-lg' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                <span className="flex items-center gap-2">
                  📍
                  <span>
                    {cityInfo.city}
                    <span className="text-xs opacity-75 ml-1">
                      {cityInfo.state.substring(0, 2).toUpperCase()}
                    </span>
                  </span>
                  <span className="text-sm opacity-75">({count})</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* facilities display */}
        {filteredFacilities.length > 0 ? (
          showSlider ? (
            <div className="relative">
              {/* left arrow */}
              <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 -ml-4" aria-label="Scroll left">
                <svg className="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* scrollable container */}
              <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filteredFacilities.map((facility) => (
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
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 -mr-4" aria-label="Scroll right">
                <svg className="w-6 h-6 text-neutral-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFacilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                //   onBook={handleBook}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              No facilities found in {selectedCity}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`.scrollbar-hide::-webkit-scrollbar {display: none;}`}</style>
    </section>
  );
};

ExploreByCitySection.propTypes = {
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      state: PropTypes.string,
      city: PropTypes.string,
    })
  ).isRequired,
};

export default ExploreByCitySection;