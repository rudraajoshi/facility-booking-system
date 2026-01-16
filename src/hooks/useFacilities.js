import { useState, useEffect, useContext } from 'react';
import { FacilityContext } from '../context/FacilityContext';

export const useFacilities = () => {
  const context = useContext(FacilityContext);
  
  if (!context) {
    throw new Error('useFacilities must be used within a FacilityProvider');
  }
  
  return context;
};

export const useFacilitiesAPI = (filters = {}) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);


        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.capacity) params.append('capacity', filters.capacity);
        if (filters.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = `/api/facilities${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch facilities');
        }

        setFacilities(result.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching facilities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [filters.type, filters.capacity, filters.search]);

  return { facilities, loading, error };
};

export const useFacility = (id) => {
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchFacility = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/facilities/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch facility');
        }

        setFacility(result.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching facility:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  return { facility, loading, error };
};

export const useFacilityAvailability = (facilityId, date) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facilityId) {
      setLoading(false);
      return;
    }

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (date) params.append('date', date);

        const url = `/api/facilities/${facilityId}/availability${
          params.toString() ? `?${params.toString()}` : ''
        }`;

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch availability');
        }

        setAvailability(result.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching availability:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [facilityId, date]);

  return { availability, loading, error };
};