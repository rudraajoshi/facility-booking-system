import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const FacilityContext = createContext();

export const FacilityProvider = ({children}) => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch facilities from MSW API
    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/facilities');
            const result = await response.json();
            
            if (result.success) {
                setFacilities(result.data);
            }
        } catch (error) {
            setError('Failed to load facilities');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    /** 
     * refresh facilities from API
     * @returns {Promise}
     */
    const refreshFacilities = () => {
        return fetchFacilities();
    };

    /** 
     * get facility by ID
     * @param {string} id
     * @returns {Object|null}
     */
    const getFacilityById = (id) => {
        return facilities.find(facility => facility.id === id) || null;
    };

    /**
     * filter facilities by category, capacity and price
     * @param {Object} filters
     * @returns {Array}
     */
    const filterFacilities = (filters = {}) => {
        let filtered = [...facilities];
        
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(f => f.category === filters.category);
        }
        
        if (filters.minCapacity) {
            filtered = filtered.filter(f => f.capacity.max >= filters.minCapacity);
        }
        
        if (filters.maxPrice) {
            filtered = filtered.filter(f => f.pricing.hourly <= filters.maxPrice);
        }
        
        if (filters.amenities && filters.amenities.length > 0) {
            filtered = filtered.filter(f => 
                filters.amenities.every(amenity => f.amenities.includes(amenity))
            );
        }
        
        if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(f => f.status === filters.status);
        }
        
        return filtered;
    };

    /** 
     * search facilities
     * @param {string} query
     * @returns {Array}
     */
    const searchFacilities = (query) => {
        if (!query || query.trim() === '') {
            return facilities;
        }
        
        const lowercaseQuery = query.toLowerCase().trim();
        
        return facilities.filter(facility =>
            facility.name.toLowerCase().includes(lowercaseQuery) ||
            facility.description.toLowerCase().includes(lowercaseQuery) ||
            facility.location.toLowerCase().includes(lowercaseQuery) ||
            facility.amenities.some(amenity =>
                amenity.toLowerCase().includes(lowercaseQuery)
            )
        );
    };

    /** 
     * get category filters
     * @param {String} category
     * @returns {Array}
     */
    const getFacilitiesByCategory = (category) => {
        return facilities.filter(f => f.category === category);
    };

    /** 
     * get available features
     * @returns {Array}
     */
    const getAvailableFacilities = () => {
        return facilities.filter(f => f.status === 'Available');
    };

    const value = {
        facilities,
        setFacilities,
        loading,
        error,
        refreshFacilities,
        getFacilityById,
        filterFacilities,
        searchFacilities,
        getFacilitiesByCategory,
        getAvailableFacilities
    };

    return (
        <FacilityContext.Provider value={value}>
            {children}
        </FacilityContext.Provider>
    );
};

FacilityProvider.propTypes = {
    children: PropTypes.node.isRequired
};