import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { FacilityContext } from '@/context/FacilityContext';
import { facilityService } from '@/services/facilityService';
import  locationService  from '@/services/locationService';

const AdminFacilities = () => {
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const { facilities, setFacilities } = useContext(FacilityContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  
  const [isAddStateModalOpen, setIsAddStateModalOpen] = useState(false);
  const [newStateName, setNewStateName] = useState('');
  const [newStateCities, setNewStateCities] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const statesData = await locationService.getAllStates();
      console.log('📍 Loaded states:', statesData);
      setStates(statesData);
    } catch (err) {
      console.error('Error loading states:', err);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    category: 'conference-room',
    description: '',
    location: '',
    floor: '',
    stateId: '',
    city: '',
    capacityMin: '',
    capacityMax: '',
    pricingHourly: '',
    pricingHalfDay: '',
    pricingFullDay: '',
    status: 'Available',
    amenities: '',
    operatingHoursStart: '08:00 AM',
    operatingHoursEnd: '08:00 PM',
    rules: '',
    imageUrl: '',
  });

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: 'conference-room',
      description: '',
      location: '',
      floor: '',
      stateId: '',
      city: '',
      capacityMin: '',
      capacityMax: '',
      pricingHourly: '',
      pricingHalfDay: '',
      pricingFullDay: '',
      status: 'Available',
      amenities: '',
      operatingHoursStart: '08:00 AM',
      operatingHoursEnd: '08:00 PM',
      rules: '',
      imageUrl: '',
    });
    setSelectedStateId('');
    setCities([]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (facility) => {
    setModalMode('edit');
    setSelectedFacility(facility);
    
    const categoryValue = typeof facility.category === 'string' 
      ? facility.category 
      : facility.category?.category_name || 'conference-room';
    
    const facilityStateId = typeof facility.state === 'object' 
      ? Number(facility.state?.state_id)
      : Number(facility.stateId) || '';
    
    const facilityCityName = typeof facility.city === 'object' 
      ? facility.city?.city_name 
      : facility.city || '';
    
    setFormData({
      name: facility.name,
      category: categoryValue,
      description: facility.description,
      location: facility.location,
      floor: facility.floor || '',
      stateId: facilityStateId,
      city: facilityCityName,
      capacityMin: facility.capacity?.min || 0,
      capacityMax: facility.capacity?.max || 0,
      pricingHourly: facility.pricing?.hourly || 0,
      pricingHalfDay: facility.pricing?.halfDay || 0,
      pricingFullDay: facility.pricing?.fullDay || 0,
      status: facility.status,
      amenities: Array.isArray(facility.amenities) ? facility.amenities.join(', ') : '',
      operatingHoursStart: facility.operating_hours?.start || facility.operatingHours?.start || '08:00 AM',
      operatingHoursEnd: facility.operating_hours?.end || facility.operatingHours?.end || '08:00 PM',
      rules: Array.isArray(facility.rules) ? facility.rules.join('\n') : '',
      imageUrl: facility.image_url || facility.imageUrl || (facility.images && facility.images.length > 0 ? facility.images[0] : ''),
    });
    
    if (facilityStateId) {
      setSelectedStateId(facilityStateId);
      try {
        const citiesData = await locationService.getCitiesByState(facilityStateId);
        setCities(citiesData);
      } catch (err) {
        console.error('Error loading cities:', err);
      }
    }
    
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFacility(null);
    setSelectedStateId('');
    setCities([]);
    setError(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value ? Number(e.target.value) : '';
    setSelectedStateId(stateId);
    setFormData({
      ...formData,
      stateId: stateId,
      city: ''
    });

    if (stateId) {
      try {
        const citiesData = await locationService.getCitiesByState(stateId);
        setCities(citiesData);
      } catch (err) {
        console.error('Error loading cities:', err);
        setCities([]);
      }
    } else {
      setCities([]);
    }
  };

  const handleAddNewState = async () => {
    if (!newStateName.trim()) {
      alert('Please enter a state name');
      return;
    }

    const citiesArray = newStateCities
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    if (citiesArray.length === 0) {
      alert('Please enter at least one city');
      return;
    }

    try {
      const newState = await locationService.createState({
        name: newStateName.trim(),
        cities: citiesArray
      });

      setStates([...states, newState]);
      setNewStateName('');
      setNewStateCities('');
      setIsAddStateModalOpen(false);
      alert('✅ State added successfully!');
    } catch (err) {
      console.error('Error adding state:', err);
      alert('❌ Failed to add state. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.stateId) {
      setError('Please select a state');
      setIsLoading(false);
      return;
    }

    if (!formData.city) {
      setError('Please select a city');
      setIsLoading(false);
      return;
    }

    const facilityData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      location: formData.location,
      floor: formData.floor,
      stateId: Number(formData.stateId),
      cityName: formData.city.trim(),
      capacity: {
        min: parseInt(formData.capacityMin),
        max: parseInt(formData.capacityMax)
      },
      pricing: {
        hourly: parseFloat(formData.pricingHourly),
        halfDay: parseFloat(formData.pricingHalfDay),
        fullDay: parseFloat(formData.pricingFullDay)
      },
      status: formData.status,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      operatingHours: {
        start: formData.operatingHoursStart,
        end: formData.operatingHoursEnd
      },
      rules: formData.rules.split('\n').map(r => r.trim()).filter(Boolean),
      imageUrl: formData.imageUrl,
      rating: modalMode === 'edit' ? selectedFacility.rating : 0,
      reviewCount: modalMode === 'edit' ? selectedFacility.reviewCount : 0,
      images: formData.imageUrl ? [formData.imageUrl] : []
    };

    console.log('📤 Final facility data being sent to API:', JSON.stringify(facilityData, null, 2));

    try {
      if (modalMode === 'add') {
        const newFacility = await facilityService.createFacility(facilityData);
        setFacilities([...facilities, newFacility]);
        alert('✅ Facility added successfully!');
      } else {
        const updatedFacility = await facilityService.updateFacility(
          selectedFacility.id, 
          facilityData
        );
        setFacilities(facilities.map(f => 
          f.id === selectedFacility.id ? updatedFacility : f
        ));
        alert('✅ Facility updated successfully!');
      }
      handleCloseModal();
    } catch (err) {
      console.error('❌ Error saving facility:', err);
      setError(err.message || 'Failed to save facility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (facilityId, facilityName) => {
    if (!window.confirm(`Are you sure you want to delete "${facilityName}"?`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await facilityService.deleteFacility(facilityId);
      setFacilities(facilities.filter(f => f.id !== facilityId));
      alert('✅ Facility deleted successfully!');
    } catch (err) {
      console.error('Error deleting facility:', err);
      alert('❌ Failed to delete facility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredFacilities = () => {
    if (!searchTerm) return facilities;
    
    const search = searchTerm.toLowerCase();
    return facilities.filter(f => {
      const category = typeof f.category === 'string' 
        ? f.category 
        : f.category?.category_name || '';
      
      const city = typeof f.city === 'object' 
        ? f.city?.city_name 
        : f.city || '';
      
      const state = typeof f.state === 'object' 
        ? f.state?.state_name 
        : f.state || '';
      
      return (
        f.name.toLowerCase().includes(search) ||
        category.toLowerCase().includes(search) ||
        f.location.toLowerCase().includes(search) ||
        city.toLowerCase().includes(search) ||
        state.toLowerCase().includes(search)
      );
    });
  };

  const filteredFacilities = getFilteredFacilities();

  const stats = {
    total: facilities.length,
    available: facilities.filter(f => f.status === 'Available').length,
    limited: facilities.filter(f => f.status === 'Limited').length,
    booked: facilities.filter(f => f.status === 'Booked').length
  };

  const getBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-success-100 text-success-800';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getCategoryDisplay = (category) => {
    if (typeof category === 'string') {
      return category.replace(/-/g, ' ');
    }
    if (typeof category === 'object' && category?.category_name) {
      return category.category_name.replace(/-/g, ' ');
    }
    return 'N/A';
  };

  const getCityDisplay = (city) => {
    if (typeof city === 'string') return city;
    if (typeof city === 'object' && city?.city_name) return city.city_name;
    return 'N/A';
  };

  const getStateDisplay = (state) => {
    if (typeof state === 'string') return state;
    if (typeof state === 'object' && state?.state_name) return state.state_name;
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Manage Facilities</h1>
            <p className="text-sm text-neutral-600 mt-1">Add, edit, or remove facilities from the system</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/locations')}
              className="px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 transition-colors font-medium"
            >
              📍 Manage Locations
            </button>
            <button
              onClick={handleOpenAddModal}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add New Facility
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Facilities" value={stats.total} color="bg-primary-50 text-primary-900" />
          <StatCard title="Available" value={stats.available} color="bg-success-50 text-success-900" />
          <StatCard title="Limited" value={stats.limited} color="bg-yellow-50 text-yellow-900" />
          <StatCard title="Booked" value={stats.booked} color="bg-error-50 text-error-900" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="Search facilities by name, category, location, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">
              All Facilities
              <span className="text-sm text-neutral-500 ml-2">({filteredFacilities.length})</span>
            </h2>
          </div>
          
          {filteredFacilities.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-lg mb-4">No facilities found</p>
              {searchTerm ? (
                <p className="text-sm">Try adjusting your search term</p>
              ) : (
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Add First Facility
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">City, State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price/Hour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-900">{facility.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600 capitalize">
                          {getCategoryDisplay(facility.category)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600">
                          {getCityDisplay(facility.city)}, {getStateDisplay(facility.state)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600">{facility.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600">
                          {facility.capacity?.min || 0}-{facility.capacity?.max || 0} people
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-neutral-900">
                          ${facility.pricing?.hourly || 0}/hour
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeClass(facility.status)}`}>
                          {facility.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal(facility)}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(facility.id, facility.name)}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm bg-error-600 text-white rounded hover:bg-error-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8">
            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {modalMode === 'add' ? 'Add New Facility' : 'Edit Facility'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error-100 border border-error-300 text-error-800 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Facility Name <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Conference Room A"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Category <span className="text-error-600">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  >
                    <option value="conference-room">Conference Room</option>
                    <option value="meeting-room">Meeting Room</option>
                    <option value="training-hall">Training Hall</option>
                    <option value="auditorium">Auditorium</option>
                    <option value="boardroom">Boardroom</option>
                    <option value="innovation-lab">Innovation Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Description <span className="text-error-600">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe the facility and its features..."
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      State <span className="text-error-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="stateId"
                        value={formData.stateId}
                        onChange={handleStateChange}
                        required
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsAddStateModalOpen(true)}
                        className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors text-sm"
                        title="Add New State"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      City <span className="text-error-600">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading || !formData.stateId}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Building Location <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Building 1"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Floor <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      placeholder="e.g., Floor 3 or Ground Floor"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Min Capacity <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacityMin"
                      value={formData.capacityMin}
                      onChange={handleInputChange}
                      placeholder="10"
                      required
                      min="1"
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Max Capacity <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacityMax"
                      value={formData.capacityMax}
                      onChange={handleInputChange}
                      placeholder="20"
                      required
                      min="1"
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Hourly ($) <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="pricingHourly"
                      value={formData.pricingHourly}
                      onChange={handleInputChange}
                      placeholder="50"
                      required
                      min="0"
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Half Day ($) <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="pricingHalfDay"
                      value={formData.pricingHalfDay}
                      onChange={handleInputChange}
                      placeholder="200"
                      required
                      min="0"
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Day ($) <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="pricingFullDay"
                      value={formData.pricingFullDay}
                      onChange={handleInputChange}
                      placeholder="350"
                      required
                      min="0"
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Operating Hours Start <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="operatingHoursStart"
                      value={formData.operatingHoursStart}
                      onChange={handleInputChange}
                      placeholder="08:00 AM"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Operating Hours End <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="operatingHoursEnd"
                      value={formData.operatingHoursEnd}
                      onChange={handleInputChange}
                      placeholder="08:00 PM"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Status <span className="text-error-600">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Amenities (comma-separated) <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="High-Speed WiFi, 4K Projector, Whiteboard, Video Conferencing"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Separate each amenity with a comma</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Facility Rules (one per line)
                  </label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="No food allowed (beverages permitted)&#10;Please maintain professional noise levels&#10;Clean up after use"
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Enter each rule on a new line</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Enter a URL to an image of the facility</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading 
                      ? 'Saving...' 
                      : modalMode === 'add' ? 'Add Facility' : 'Update Facility'
                    }
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isLoading}
                    className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isAddStateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Add New State</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  State Name <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  value={newStateName}
                  onChange={(e) => setNewStateName(e.target.value)}
                  placeholder="e.g., California"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Cities (comma-separated) <span className="text-error-600">*</span>
                </label>
                <textarea
                  value={newStateCities}
                  onChange={(e) => setNewStateCities(e.target.value)}
                  placeholder="e.g., San Francisco, Los Angeles, San Diego"
                  rows="3"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddNewState}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Add State
                </button>
                <button
                  onClick={() => {
                    setIsAddStateModalOpen(false);
                    setNewStateName('');
                    setNewStateCities('');
                  }}
                  className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`${color} p-6 rounded-lg shadow`}>
    <h3 className="text-sm font-medium opacity-75">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminFacilities;