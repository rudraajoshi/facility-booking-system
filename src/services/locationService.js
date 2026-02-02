const API_BASE = '/api';

export const locationService = {
  // Get all states
  getAllStates: async () => {
    const response = await fetch(`${API_BASE}/locations/states`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch states');
    }
    
    return data.data;
  },

  // Get cities by state ID
  getCitiesByState: async (stateId) => {
    const response = await fetch(`${API_BASE}/locations/states/${stateId}/cities`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch cities');
    }
    
    return data.data;
  },

  // Create new state
  createState: async (stateData) => {
    const response = await fetch(`${API_BASE}/locations/states`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stateData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create state');
    }
    
    return data.data;
  },

  // Update state
  updateState: async (stateId, stateData) => {
    const response = await fetch(`${API_BASE}/locations/states/${stateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stateData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update state');
    }
    
    return data.data;
  },

  // Delete state
  deleteState: async (stateId) => {
    const response = await fetch(`${API_BASE}/locations/states/${stateId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete state');
    }
    
    return data;
  },

  // Add city to state
  addCity: async (stateId, cityName) => {
    const response = await fetch(`${API_BASE}/locations/states/${stateId}/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cityName }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add city');
    }
    
    return data.data;
  },

  // Update city name
  updateCity: async (stateId, oldCityName, newCityName) => {
    const response = await fetch(`${API_BASE}/locations/states/${stateId}/cities`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldCityName, newCityName }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update city');
    }
    
    return data.data;
  },

  // Delete city
  deleteCity: async (stateId, cityName) => {
    const response = await fetch(`${API_BASE}/locations/states/${stateId}/cities/${encodeURIComponent(cityName)}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete city');
    }
    
    return data;
  },
};

export default locationService;