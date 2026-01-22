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

  // get single facility
  getFacility: async (id) => {
    const response = await fetch(`${API_BASE}/facilities/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch facility');
    }
    
    return data.data;
  },

  // create new facility
  createFacility: async (facilityData) => {
    const response = await fetch(`${API_BASE}/facilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facilityData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create facility');
    }
    
    return data.data;
  },

  // update facility
  updateFacility: async (id, facilityData) => {
    const response = await fetch(`${API_BASE}/facilities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facilityData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update facility');
    }
    
    return data.data;
  },

  // delete facility
  deleteFacility: async (id) => {
    const response = await fetch(`${API_BASE}/facilities/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete facility');
    }
    
    return data;
  },

  // get facility availability
  getFacilityAvailability: async (id) => {
    const response = await fetch(`${API_BASE}/facilities/${id}/availability`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch availability');
    }
    
    return data.data;
  },
};