const API_BASE = '/api';

export const facilityService = {
  getAllFacilities: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.capacity) params.append('capacity', filters.capacity);
    if (filters.search) params.append('search', filters.search);

    const url = `${API_BASE}/facilities${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch facilities');
    }
    
    return data.data;
  },

  getFacility: async (id) => {
    const response = await fetch(`${API_BASE}/facilities/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch facility');
    }
    
    return data.data;
  },

  createFacility: async (facilityData) => {
    console.log('📥 Received facilityData:', facilityData);
    
    const category_id = await facilityService.getCategoryIdByName(facilityData.category);
    
    let state_id;
    if (facilityData.stateId) {
      state_id = Number(facilityData.stateId);
      console.log('✅ Using provided stateId:', state_id);
    } else if (facilityData.state) {
      state_id = await facilityService.getStateIdByName(facilityData.state);
    } else {
      throw new Error('State ID or State name is required');
    }
    
    const cityName = facilityData.cityName || facilityData.city;
    if (!cityName) {
      throw new Error('City name is required');
    }
    const city_id = await facilityService.getCityIdByName(cityName, state_id);

    const backendData = {
      facility_name: facilityData.name,
      category_id: category_id,
      state_id: state_id,
      city_id: city_id,
      building_name: facilityData.location,
      floor: facilityData.floor || 'Ground Floor',
      capacity_min: parseInt(facilityData.capacity.min),
      capacity_max: parseInt(facilityData.capacity.max),
      price_per_hour: parseFloat(facilityData.pricing.hourly),
      price_half_day: parseFloat(facilityData.pricing.halfDay),
      price_full_day: parseFloat(facilityData.pricing.fullDay),
      availability_status: facilityData.status.toLowerCase(),
      description: facilityData.description,
      amenities: facilityData.amenities,
      operating_hours: facilityData.operatingHours || { start: '08:00 AM', end: '08:00 PM' },
      rules: facilityData.rules || [],
      image_url: facilityData.imageUrl || (facilityData.images && facilityData.images.length > 0 ? facilityData.images[0] : null),
    };

    console.log('🔄 Transformed data for backend:', backendData);

    const response = await fetch(`${API_BASE}/facilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(backendData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Backend error response:', data);
      throw new Error(data.error || data.message || 'Failed to create facility');
    }
    
    return data.data;
  },

  updateFacility: async (id, facilityData) => {
    console.log('📥 Received facilityData for update:', facilityData);
    
    const category_id = await facilityService.getCategoryIdByName(facilityData.category);
    
    let state_id;
    if (facilityData.stateId) {
      state_id = Number(facilityData.stateId);
      console.log('✅ Using provided stateId:', state_id);
    } else if (facilityData.state) {
      state_id = await facilityService.getStateIdByName(facilityData.state);
    } else {
      throw new Error('State ID or State name is required');
    }
    
    const cityName = facilityData.cityName || facilityData.city;
    if (!cityName) {
      throw new Error('City name is required');
    }
    const city_id = await facilityService.getCityIdByName(cityName, state_id);

    const backendData = {
      facility_name: facilityData.name,
      category_id: category_id,
      state_id: state_id,
      city_id: city_id,
      building_name: facilityData.location,
      floor: facilityData.floor || 'Ground Floor',
      capacity_min: parseInt(facilityData.capacity.min),
      capacity_max: parseInt(facilityData.capacity.max),
      price_per_hour: parseFloat(facilityData.pricing.hourly),
      price_half_day: parseFloat(facilityData.pricing.halfDay),
      price_full_day: parseFloat(facilityData.pricing.fullDay),
      availability_status: facilityData.status.toLowerCase(),
      description: facilityData.description,
      amenities: facilityData.amenities,
      operating_hours: facilityData.operatingHours || { start: '08:00 AM', end: '08:00 PM' },
      rules: facilityData.rules || [],
      image_url: facilityData.imageUrl || (facilityData.images && facilityData.images.length > 0 ? facilityData.images[0] : null),
    };

    console.log('🔄 Transformed data for backend:', backendData);

    const response = await fetch(`${API_BASE}/facilities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(backendData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Backend error response:', data);
      throw new Error(data.error || data.message || 'Failed to update facility');
    }
    
    return data.data;
  },

  deleteFacility: async (id) => {
    const response = await fetch(`${API_BASE}/facilities/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete facility');
    }
    
    return data;
  },

  getFacilityAvailability: async (id) => {
    const response = await fetch(`${API_BASE}/facilities/${id}/availability`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch availability');
    }
    
    return data.data;
  },

  getCategoryIdByName: async (categoryName) => {
    try {
      console.log('🔍 Looking for category:', categoryName);
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      
      console.log('📦 Categories from API:', data);
      
      if (response.ok && data.data) {
        const normalizedSearch = categoryName.trim().toLowerCase().replace(/-/g, ' ');
        
        const category = data.data.find(c => {
          const normalizedCategory = c.category_name.toLowerCase().replace(/\s+/g, ' ').trim();
          return normalizedCategory === normalizedSearch;
        });
        
        console.log('✅ Found category:', category);
        
        if (!category) {
          console.error('❌ Category not found. Available categories:', data.data.map(c => c.category_name));
          throw new Error(`Category "${categoryName}" not found. Please ensure it exists in the database.`);
        }
        
        return category.category_id;
      }
      
      throw new Error('Failed to fetch categories from server');
    } catch (error) {
      console.error('❌ Error fetching category ID:', error);
      throw error;
    }
  },

  getStateIdByName: async (stateName) => {
    try {
      const trimmedStateName = stateName ? stateName.trim() : '';
      console.log('🔍 Looking for state:', trimmedStateName);
      const response = await fetch(`${API_BASE}/states`);
      const data = await response.json();
      
      console.log('📦 States from API (full response):', JSON.stringify(data, null, 2));
      
      if (response.ok && data.data) {
        if (data.data.length > 0) {
          console.log('📋 First state object structure:', data.data[0]);
        }
        
        const state = data.data.find(s => {
          const stateName = s.state_name || s.name || s.stateName;
          return stateName && stateName.trim() === trimmedStateName;
        });
        
        console.log('✅ Found state:', state);
        
        if (!state) {
          const availableStates = data.data.map(s => s.state_name || s.name || s.stateName || 'UNKNOWN');
          console.error('❌ State not found. Available states:', availableStates);
          throw new Error(`State "${trimmedStateName}" not found. Please ensure it exists in the database.`);
        }
        
        return state.state_id || state.id;
      }
      
      throw new Error('Failed to fetch states from server');
    } catch (error) {
      console.error('❌ Error fetching state ID:', error);
      throw error;
    }
  },
 
  getCityIdByName: async (cityName, stateId) => {
    try {
      const trimmedCityName = cityName ? cityName.trim() : '';
      console.log('🔍 Looking for city:', trimmedCityName, 'in state:', stateId);
      const response = await fetch(`${API_BASE}/cities?state_id=${stateId}`);
      const data = await response.json();
      
      console.log('📦 Cities from API (full response):', JSON.stringify(data, null, 2));
      
      if (response.ok && data.data) {
        if (data.data.length > 0) {
          console.log('📋 First city object structure:', data.data[0]);
        }
        
        const city = data.data.find(c => {
          const cityName = c.city_name || c.name || c.cityName;
          return cityName && cityName.trim() === trimmedCityName;
        });
        
        console.log('✅ Found city:', city);
        
        if (!city) {
          const availableCities = data.data.map(c => c.city_name || c.name || c.cityName || 'UNKNOWN');
          console.error('❌ City not found. Available cities:', availableCities);
          throw new Error(`City "${trimmedCityName}" not found. Please ensure it exists in the database.`);
        }
        
        return city.city_id || city.id;
      }
      
      throw new Error('Failed to fetch cities from server');
    } catch (error) {
      console.error('❌ Error fetching city ID:', error);
      throw error;
    }
  },
};