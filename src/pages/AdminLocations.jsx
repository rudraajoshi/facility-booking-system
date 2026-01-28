import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { locationService } from '@/services/locationService';

const AdminLocations = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State modal
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [stateModalMode, setStateModalMode] = useState('add');
  const [selectedState, setSelectedState] = useState(null);
  const [stateFormData, setStateFormData] = useState({ name: '', code: '' });
  
  // City modal
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [cityModalMode, setCityModalMode] = useState('add');
  const [selectedStateForCity, setSelectedStateForCity] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityFormData, setCityFormData] = useState({ cityName: '' });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  // Load states
  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await locationService.getAllStates();
      setStates(data);
    } catch (err) {
      console.error('Error loading states:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // State handlers
  const handleOpenAddStateModal = () => {
    setStateModalMode('add');
    setStateFormData({ name: '', code: '' });
    setSelectedState(null);
    setIsStateModalOpen(true);
  };

  const handleOpenEditStateModal = (state) => {
    setStateModalMode('edit');
    setSelectedState(state);
    setStateFormData({ name: state.name, code: state.code });
    setIsStateModalOpen(true);
  };

  const handleCloseStateModal = () => {
    setIsStateModalOpen(false);
    setSelectedState(null);
    setStateFormData({ name: '', code: '' });
  };

  const handleStateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (stateModalMode === 'add') {
        const newState = await locationService.createState(stateFormData);
        setStates([...states, newState]);
        alert('✅ State added successfully!');
      } else {
        const updatedState = await locationService.updateState(selectedState.id, stateFormData);
        setStates(states.map(s => s.id === selectedState.id ? updatedState : s));
        alert('✅ State updated successfully!');
      }
      handleCloseStateModal();
    } catch (err) {
      console.error('Error saving state:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteState = async (stateId, stateName) => {
    if (!window.confirm(`Are you sure you want to delete "${stateName}"? This will also delete all cities in this state.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await locationService.deleteState(stateId);
      setStates(states.filter(s => s.id !== stateId));
      alert('✅ State deleted successfully!');
    } catch (err) {
      console.error('Error deleting state:', err);
      alert('❌ Failed to delete state. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // City handlers
  const handleOpenAddCityModal = (state) => {
    setCityModalMode('add');
    setSelectedStateForCity(state);
    setSelectedCity('');
    setCityFormData({ cityName: '' });
    setIsCityModalOpen(true);
  };

  const handleOpenEditCityModal = (state, cityName) => {
    setCityModalMode('edit');
    setSelectedStateForCity(state);
    setSelectedCity(cityName);
    setCityFormData({ cityName });
    setIsCityModalOpen(true);
  };

  const handleCloseCityModal = () => {
    setIsCityModalOpen(false);
    setSelectedStateForCity(null);
    setSelectedCity('');
    setCityFormData({ cityName: '' });
  };

  const handleCitySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (cityModalMode === 'add') {
        await locationService.addCity(selectedStateForCity.id, cityFormData.cityName);
        const updatedStates = await locationService.getAllStates();
        setStates(updatedStates);
        alert('✅ City added successfully!');
      } else {
        await locationService.updateCity(selectedStateForCity.id, selectedCity, cityFormData.cityName);
        const updatedStates = await locationService.getAllStates();
        setStates(updatedStates);
        alert('✅ City updated successfully!');
      }
      handleCloseCityModal();
    } catch (err) {
      console.error('Error saving city:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCity = async (stateId, cityName) => {
    if (!window.confirm(`Are you sure you want to delete "${cityName}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await locationService.deleteCity(stateId, cityName);
      const updatedStates = await locationService.getAllStates();
      setStates(updatedStates);
      alert('✅ City deleted successfully!');
    } catch (err) {
      console.error('Error deleting city:', err);
      alert('❌ Failed to delete city. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Manage Locations</h1>
            <p className="text-sm text-neutral-600 mt-1">Manage states and cities for facility locations</p>
          </div>
          <button
            onClick={handleOpenAddStateModal}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add New State
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-100 border border-error-300 text-error-800 rounded-md">
            {error}
          </div>
        )}

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => (
            <div key={state.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* State Header */}
              <div className="bg-primary-600 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{state.name}</h3>
                    <p className="text-sm text-primary-100 mt-1">{state.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditStateModal(state)}
                      disabled={isLoading}
                      className="p-1 hover:bg-primary-700 rounded transition-colors disabled:opacity-50"
                      title="Edit State"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteState(state.id, state.name)}
                      disabled={isLoading}
                      className="p-1 hover:bg-error-600 rounded transition-colors disabled:opacity-50"
                      title="Delete State"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cities List */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-neutral-700">Cities ({state.cities?.length || 0})</h4>
                  <button
                    onClick={() => handleOpenAddCityModal(state)}
                    disabled={isLoading}
                    className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors font-medium disabled:opacity-50"
                  >
                    + Add City
                  </button>
                </div>

                {state.cities && state.cities.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {state.cities.map((city, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors">
                        <span className="text-sm text-neutral-700">{city}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleOpenEditCityModal(state, city)}
                            disabled={isLoading}
                            className="p-1 text-primary-600 hover:bg-primary-100 rounded transition-colors disabled:opacity-50"
                            title="Edit City"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCity(state.id, city)}
                            disabled={isLoading}
                            className="p-1 text-error-600 hover:bg-error-100 rounded transition-colors disabled:opacity-50"
                            title="Delete City"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4">No cities added yet</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {states.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-lg text-neutral-600 mb-4">No states found</p>
            <button
              onClick={handleOpenAddStateModal}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Add First State
            </button>
          </div>
        )}
      </div>

      {/* State Modal */}
      {isStateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {stateModalMode === 'add' ? 'Add New State' : 'Edit State'}
                </h2>
                <button
                  onClick={handleCloseStateModal}
                  disabled={isLoading}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleStateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    State Name <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={stateFormData.name}
                    onChange={(e) => setStateFormData({ ...stateFormData, name: e.target.value })}
                    placeholder="e.g., California"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    State Code <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={stateFormData.code}
                    onChange={(e) => setStateFormData({ ...stateFormData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CA"
                    maxLength={2}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 uppercase"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : stateModalMode === 'add' ? 'Add State' : 'Update State'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseStateModal}
                    disabled={isLoading}
                    className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* City Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {cityModalMode === 'add' ? 'Add New City' : 'Edit City'}
                </h2>
                <button
                  onClick={handleCloseCityModal}
                  disabled={isLoading}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCitySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={selectedStateForCity?.name || ''}
                    disabled
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    City Name <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={cityFormData.cityName}
                    onChange={(e) => setCityFormData({ cityName: e.target.value })}
                    placeholder="e.g., Los Angeles"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : cityModalMode === 'add' ? 'Add City' : 'Update City'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseCityModal}
                    disabled={isLoading}
                    className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLocations;