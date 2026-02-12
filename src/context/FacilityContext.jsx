import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const FacilityContext = createContext();

export const FacilityProvider = ({children}) => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/facilities');
            const result = await response.json();
            
            console.log('🔄 Fetched facilities from API:', result);
            
            if (result.success) {
                console.log('✅ Loaded facilities:', result.data.length);
                console.log('📋 First facility:', result.data[0]);
                setFacilities(result.data);
            }
        } catch (error) {
            setError('Failed to load facilities');
            console.error('❌ Error fetching facilities:', error);
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
        console.log('🔍 getFacilityById called with:', id);
        console.log('📊 Total facilities in context:', facilities.length);
        console.log('📋 Available facility IDs:', facilities.map(f => f.id || f._id));
   
        let facility = facilities.find(f => f.id === id);
        

        if (!facility) {
            facility = facilities.find(f => f._id === id);
        }
        

        if (!facility) {
            facility = facilities.find(f => String(f.id) === String(id) || String(f._id) === String(id));
        }
        
        console.log('🎯 Found facility:', facility ? facility.name : 'NOT FOUND');
        
        return facility || null;
    };

    /**
     * filter facilities by category, capacity and price
     * @param {Object} filters
     * @returns {Array}
     */
    const filterFacilities = (filters = {}) => {
        let filtered = [...facilities];
        
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(f => {
                const category = typeof f.category === 'object' ? f.category?.category_name : f.category;
                return category === filters.category;
            });
        }
        
        if (filters.minCapacity) {
            filtered = filtered.filter(f => f.capacity?.max >= filters.minCapacity);
        }
        
        if (filters.maxPrice) {
            filtered = filtered.filter(f => f.pricing?.hourly <= filters.maxPrice);
        }
        
        if (filters.amenities && filters.amenities.length > 0) {
            filtered = filtered.filter(f => 
                f.amenities && filters.amenities.every(amenity => f.amenities.includes(amenity))
            );
        }
        
        if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(f => {
                const status = typeof f.status === 'object' ? f.status?.status_name : f.status;
                return status === filters.status;
            });
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
        
        return facilities.filter(facility => {
            // Handle city/state as objects
            const city = typeof facility.city === 'object' ? facility.city?.city_name : facility.city;
            const state = typeof facility.state === 'object' ? facility.state?.state_name : facility.state;
            
            return (
                facility.name?.toLowerCase().includes(lowercaseQuery) ||
                facility.description?.toLowerCase().includes(lowercaseQuery) ||
                facility.location?.toLowerCase().includes(lowercaseQuery) ||
                city?.toLowerCase().includes(lowercaseQuery) ||
                state?.toLowerCase().includes(lowercaseQuery) ||
                (facility.amenities && facility.amenities.some(amenity =>
                    amenity.toLowerCase().includes(lowercaseQuery)
                ))
            );
        });
    };

    /** 
     * get category filters
     * @param {String} category
     * @returns {Array}
     */
    const getFacilitiesByCategory = (category) => {
        return facilities.filter(f => {
            const facilityCategory = typeof f.category === 'object' ? f.category?.category_name : f.category;
            return facilityCategory === category;
        });
    };

    /** 
     * get available features
     * @returns {Array}
     */
    const getAvailableFacilities = () => {
        return facilities.filter(f => {
            const status = typeof f.status === 'object' ? f.status?.status_name : f.status;
            return status === 'Available';
        });
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