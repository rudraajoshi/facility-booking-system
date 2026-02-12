import { locationAPI } from './api';

const locationService = {
 
  getAllStates: async () => {
    try {
      const response = await locationAPI.getAllStates();
      const states = response.data.data;
      
      console.log('🔍 Raw states from API:', states);
      
      // Normalize the state objects to have consistent property names
      const normalizedStates = states.map(state => ({
        id: state.state_id || state.id,
        name: state.state_name || state.name,
        // Keep original properties in case they're needed
        ...state
      }));
      
      console.log('✅ Normalized states:', normalizedStates);
      
      return normalizedStates;
    } catch (error) {
      console.error('Error fetching states:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch states');
    }
  },

  getCitiesByState: async (stateId) => {
    try {
      const response = await locationAPI.getCitiesByState(stateId);
      const cities = response.data.data;
      
      console.log('🔍 Raw cities from API:', cities);
      
      // If cities are objects, normalize them
      if (cities.length > 0 && typeof cities[0] === 'object') {
        const normalizedCities = cities.map(city => 
          city.city_name || city.name || city
        );
        console.log('✅ Normalized cities:', normalizedCities);
        return normalizedCities;
      }
      
      // If cities are already strings, return as-is
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch cities');
    }
  },

  
  createState: async (stateData) => {
    try {
      const response = await locationAPI.createState(stateData);
      const state = response.data.data;
      
      // Normalize the returned state
      return {
        id: state.state_id || state.id,
        name: state.state_name || state.name,
        ...state
      };
    } catch (error) {
      console.error('Error creating state:', error);
      throw new Error(error.response?.data?.message || 'Failed to create state');
    }
  },

  updateState: async (stateId, stateData) => {
    try {
      const response = await locationAPI.updateState(stateId, stateData);
      const state = response.data.data;
      
      // Normalize the returned state
      return {
        id: state.state_id || state.id,
        name: state.state_name || state.name,
        ...state
      };
    } catch (error) {
      console.error('Error updating state:', error);
      throw new Error(error.response?.data?.message || 'Failed to update state');
    }
  },

  
  deleteState: async (stateId) => {
    try {
      const response = await locationAPI.deleteState(stateId);
      return response.data;
    } catch (error) {
      console.error('Error deleting state:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete state');
    }
  },

  
  addCity: async (stateId, cityName) => {
    try {
      const response = await locationAPI.createCity(stateId, { cityName });
      return response.data.data;
    } catch (error) {
      console.error('Error adding city:', error);
      throw new Error(error.response?.data?.message || 'Failed to add city');
    }
  },


  updateCity: async (stateId, oldCityName, newCityName) => {
    try {
      const response = await locationAPI.updateCity(stateId, oldCityName, { cityName: newCityName });
      return response.data.data;
    } catch (error) {
      console.error('Error updating city:', error);
      throw new Error(error.response?.data?.message || 'Failed to update city');
    }
  },

  deleteCity: async (stateId, cityName) => {
    try {
      const response = await locationAPI.deleteCity(stateId, cityName);
      return response.data;
    } catch (error) {
      console.error('Error deleting city:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete city');
    }
  },
};

export default locationService;