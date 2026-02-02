// States and Cities data structure
export const statesAndCitiesData = {
  states: [
    {
      id: '1',
      name: 'California',
      code: 'CA',
      cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento']
    },
    {
      id: '2',
      name: 'New York',
      code: 'NY',
      cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse']
    },
    {
      id: '3',
      name: 'Texas',
      code: 'TX',
      cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth']
    },
    {
      id: '4',
      name: 'Florida',
      code: 'FL',
      cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale']
    },
    {
      id: '5',
      name: 'Illinois',
      code: 'IL',
      cities: ['Chicago', 'Springfield', 'Naperville', 'Aurora', 'Rockford']
    }
  ]
};

// Helper function to get all states
export const getStates = () => {
  return statesAndCitiesData.states;
};

// Helper function to get cities by state ID
export const getCitiesByStateId = (stateId) => {
  const state = statesAndCitiesData.states.find(s => s.id === stateId);
  return state ? state.cities : [];
};

// Helper function to get cities by state name
export const getCitiesByStateName = (stateName) => {
  const state = statesAndCitiesData.states.find(s => s.name === stateName);
  return state ? state.cities : [];
};

// Helper function to get state by ID
export const getStateById = (stateId) => {
  return statesAndCitiesData.states.find(s => s.id === stateId);
};

// Helper function to add a new state
export const addState = (stateName, stateCode) => {
  const newId = (parseInt(statesAndCitiesData.states[statesAndCitiesData.states.length - 1]?.id || '0') + 1).toString();
  const newState = {
    id: newId,
    name: stateName,
    code: stateCode,
    cities: []
  };
  statesAndCitiesData.states.push(newState);
  return newState;
};

// Helper function to update a state
export const updateState = (stateId, stateName, stateCode) => {
  const stateIndex = statesAndCitiesData.states.findIndex(s => s.id === stateId);
  if (stateIndex !== -1) {
    statesAndCitiesData.states[stateIndex] = {
      ...statesAndCitiesData.states[stateIndex],
      name: stateName,
      code: stateCode
    };
    return statesAndCitiesData.states[stateIndex];
  }
  return null;
};

// Helper function to delete a state
export const deleteState = (stateId) => {
  const stateIndex = statesAndCitiesData.states.findIndex(s => s.id === stateId);
  if (stateIndex !== -1) {
    statesAndCitiesData.states.splice(stateIndex, 1);
    return true;
  }
  return false;
};

// Helper function to add a city to a state
export const addCityToState = (stateId, cityName) => {
  const state = statesAndCitiesData.states.find(s => s.id === stateId);
  if (state && !state.cities.includes(cityName)) {
    state.cities.push(cityName);
    return true;
  }
  return false;
};

// Helper function to remove a city from a state
export const removeCityFromState = (stateId, cityName) => {
  const state = statesAndCitiesData.states.find(s => s.id === stateId);
  if (state) {
    const cityIndex = state.cities.indexOf(cityName);
    if (cityIndex !== -1) {
      state.cities.splice(cityIndex, 1);
      return true;
    }
  }
  return false;
};

// Helper function to update a city name
export const updateCityName = (stateId, oldCityName, newCityName) => {
  const state = statesAndCitiesData.states.find(s => s.id === stateId);
  if (state) {
    const cityIndex = state.cities.indexOf(oldCityName);
    if (cityIndex !== -1) {
      state.cities[cityIndex] = newCityName;
      return true;
    }
  }
  return false;
};

export default statesAndCitiesData;