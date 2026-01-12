import PropTypes from 'prop-types';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-8">
      <div className="relative">
        {/* search icon */}
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
          <svg 
            className="w-6 h-6 text-neutral-500"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* search input */}
        <input
          type="text"
          placeholder="Search by name, location, or amenities..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-16 pr-14 py-5 text-lg border-2 border-neutral-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all shadow-sm hover:border-neutral-400 focus:shadow-md placeholder:text-neutral-500"
        />
        {/* clear button => shown for empty space */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default SearchBar;