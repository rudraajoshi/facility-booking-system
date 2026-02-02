import { http, HttpResponse } from 'msw';
import { facilitiesData as initialFacilities } from '@/data/facilities';
import { statesAndCitiesData as initialStatesAndCities, addState, updateState, deleteState, addCityToState, removeCityFromState, updateCityName } from '@/data/statesAndCities';

// persistence keys
const STORAGE_KEYS = {
  USERS: 'msw_users',
  BOOKINGS: 'msw_bookings',
  FACILITIES: 'msw_facilities',
  CURRENT_USER: 'msw_current_user',
  STATES_AND_CITIES: 'msw_states_and_cities'
};

// load data
const loadFromStorage = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// save data
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// default users
const DEFAULT_USERS = [
  {
    id: 'default-1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
    role: 'user'
  },
  {
    id: 'default-2',
    name: 'Guest User',
    email: 'guest@example.com',
    password: 'guest123',
    role: 'user'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@facility.com',
    password: 'admin123',
    role: 'admin'
  }
];

const initializeUsers = () => {
  let users = loadFromStorage(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    users = [...DEFAULT_USERS];
  } else {
    const adminExists = users.some(u => u.email === 'admin@facility.com');
    if (!adminExists) {
      const adminUser = DEFAULT_USERS.find(u => u.role === 'admin');
      users.push(adminUser);
      console.log('✅ Added missing admin user to storage');
    }
  }
  
  saveToStorage(STORAGE_KEYS.USERS, users);
  return users;
};

const initializeFacilities = () => {
  let facilities = loadFromStorage(STORAGE_KEYS.FACILITIES, []);
  if (facilities.length === 0) {
    facilities = [...initialFacilities];
    saveToStorage(STORAGE_KEYS.FACILITIES, facilities);
    console.log('✅ Initialized facilities in storage');
  }
  return facilities;
};

const initializeStatesAndCities = () => {
  let statesAndCities = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, null);
  if (!statesAndCities) {
    statesAndCities = initialStatesAndCities;
    saveToStorage(STORAGE_KEYS.STATES_AND_CITIES, statesAndCities);
    console.log('✅ Initialized states and cities in storage');
  }
  return statesAndCities;
};

// in memory db for persistence
let facilitiesData = initializeFacilities();
let bookingsData = loadFromStorage(STORAGE_KEYS.BOOKINGS, []);
let usersData = initializeUsers(); 
let currentUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
let statesAndCitiesData = initializeStatesAndCities();

const adminUser = usersData.find(u => u.role === 'admin');
console.log('🔑 Admin user in database:', adminUser ? 
  `${adminUser.email} (password: ${adminUser.password})` : 
  'NOT FOUND');

// api handlers
export const handlers = [

  // Facilities endpoints
  http.get('/api/facilities', ({ request }) => {
    facilitiesData = loadFromStorage(STORAGE_KEYS.FACILITIES, initialFacilities);
    
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const capacity = url.searchParams.get('capacity');
    const search = url.searchParams.get('search');

    let result = [...facilitiesData];

    if (type && type !== 'all') {
      result = result.filter(f => f.type?.toLowerCase() === type.toLowerCase() || f.category?.toLowerCase() === type.toLowerCase());
    }

    if (capacity) {
      result = result.filter(f => (f.capacity?.max || f.capacity) >= parseInt(capacity));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.city?.toLowerCase().includes(q) ||
        f.state?.toLowerCase().includes(q)
      );
    }

    return HttpResponse.json({ success: true, data: result });
  }),

  http.get('/api/facilities/:id', ({ params }) => {
    facilitiesData = loadFromStorage(STORAGE_KEYS.FACILITIES, initialFacilities);
    const facility = facilitiesData.find(f => f.id === params.id);
    if (!facility) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: facility });
  }),

  http.post('/api/facilities', async ({ request }) => {
    facilitiesData = loadFromStorage(STORAGE_KEYS.FACILITIES, initialFacilities);
    const data = await request.json();
    const newFacility = { 
      id: crypto.randomUUID(), 
      ...data,
      createdAt: new Date().toISOString()
    };
    facilitiesData.push(newFacility);
    saveToStorage(STORAGE_KEYS.FACILITIES, facilitiesData);
    console.log('✅ Facility added:', newFacility.name);
    return HttpResponse.json({ success: true, data: newFacility }, { status: 201 });
  }),

  http.put('/api/facilities/:id', async ({ params, request }) => {
    facilitiesData = loadFromStorage(STORAGE_KEYS.FACILITIES, initialFacilities);
    const index = facilitiesData.findIndex(f => f.id === params.id);
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });

    const updateData = await request.json();
    facilitiesData[index] = { 
      ...facilitiesData[index], 
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.FACILITIES, facilitiesData);
    console.log('✅ Facility updated:', facilitiesData[index].name);
    return HttpResponse.json({ success: true, data: facilitiesData[index] });
  }),

  http.delete('/api/facilities/:id', ({ params }) => {
    facilitiesData = loadFromStorage(STORAGE_KEYS.FACILITIES, initialFacilities);
    const facility = facilitiesData.find(f => f.id === params.id);
    facilitiesData = facilitiesData.filter(f => f.id !== params.id);
    saveToStorage(STORAGE_KEYS.FACILITIES, facilitiesData);
    console.log('✅ Facility deleted:', facility?.name || params.id);
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/facilities/:id/availability', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        facilityId: params.id,
        timeSlots: [
          { time: '09:00', available: true },
          { time: '10:00', available: false },
          { time: '11:00', available: true },
          { time: '12:00', available: true },
          { time: '14:00', available: false },
          { time: '15:00', available: true }
        ]
      }
    });
  }),

  // Location endpoints - States
  http.get('/api/locations/states', () => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    console.log('📍 Fetching states:', statesAndCitiesData.states);
    return HttpResponse.json({ success: true, data: statesAndCitiesData.states });
  }),

  http.get('/api/locations/states/:id/cities', ({ params }) => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    const state = statesAndCitiesData.states.find(s => s.id === params.id);
    if (!state) return HttpResponse.json({ error: 'State not found' }, { status: 404 });
    console.log('🏙️ Fetching cities for state:', state.name, state.cities);
    return HttpResponse.json({ success: true, data: state.cities });
  }),

  http.post('/api/locations/states', async ({ request }) => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    const { name, code } = await request.json();
    
    const newState = {
      id: (parseInt(statesAndCitiesData.states[statesAndCitiesData.states.length - 1]?.id || '0') + 1).toString(),
      name,
      code,
      cities: []
    };
    
    statesAndCitiesData.states.push(newState);
    saveToStorage(STORAGE_KEYS.STATES_AND_CITIES, statesAndCitiesData);
    console.log('✅ State added:', newState.name);
    return HttpResponse.json({ success: true, data: newState }, { status: 201 });
  }),

  http.put('/api/locations/states/:id', async ({ params, request }) => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    const { name, code } = await request.json();
    const stateIndex = statesAndCitiesData.states.findIndex(s => s.id === params.id);
    
    if (stateIndex === -1) return HttpResponse.json({ error: 'State not found' }, { status: 404 });
    
    statesAndCitiesData.states[stateIndex] = {
      ...statesAndCitiesData.states[stateIndex],
      name,
      code
    };
    
    saveToStorage(STORAGE_KEYS.STATES_AND_CITIES, statesAndCitiesData);
    console.log('✅ State updated:', name);
    return HttpResponse.json({ success: true, data: statesAndCitiesData.states[stateIndex] });
  }),

  http.delete('/api/locations/states/:id', ({ params }) => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    const state = statesAndCitiesData.states.find(s => s.id === params.id);
    statesAndCitiesData.states = statesAndCitiesData.states.filter(s => s.id !== params.id);
    saveToStorage(STORAGE_KEYS.STATES_AND_CITIES, statesAndCitiesData);
    console.log('✅ State deleted:', state?.name || params.id);
    return HttpResponse.json({ success: true });
  }),

  // Location endpoints - Cities
  http.post('/api/locations/states/:id/cities', async ({ params, request }) => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    const { cityName } = await request.json();
    const state = statesAndCitiesData.states.find(s => s.id === params.id);
    
    if (!state) return HttpResponse.json({ error: 'State not found' }, { status: 404 });
    
    if (state.cities.includes(cityName)) {
      return HttpResponse.json({ error: 'City already exists' }, { status: 400 });
    }
    
    state.cities.push(cityName);
    saveToStorage(STORAGE_KEYS.STATES_AND_CITIES, statesAndCitiesData);
    console.log('✅ City added:', cityName, 'to', state.name);
    return HttpResponse.json({ success: true, data: state.cities }, { status: 201 });
  }),

  http.put('/api/locations/states/:id/cities', async ({ params, request }) => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    const { oldCityName, newCityName } = await request.json();
    const state = statesAndCitiesData.states.find(s => s.id === params.id);
    
    if (!state) return HttpResponse.json({ error: 'State not found' }, { status: 404 });
    
    const cityIndex = state.cities.indexOf(oldCityName);
    if (cityIndex === -1) return HttpResponse.json({ error: 'City not found' }, { status: 404 });
    
    state.cities[cityIndex] = newCityName;
    saveToStorage(STORAGE_KEYS.STATES_AND_CITIES, statesAndCitiesData);
    console.log('✅ City updated:', oldCityName, '→', newCityName);
    return HttpResponse.json({ success: true, data: state.cities });
  }),

  http.delete('/api/locations/states/:stateId/cities/:cityName', ({ params }) => {
    statesAndCitiesData = loadFromStorage(STORAGE_KEYS.STATES_AND_CITIES, initialStatesAndCities);
    const state = statesAndCitiesData.states.find(s => s.id === params.stateId);
    
    if (!state) return HttpResponse.json({ error: 'State not found' }, { status: 404 });
    
    const cityName = decodeURIComponent(params.cityName);
    state.cities = state.cities.filter(c => c !== cityName);
    saveToStorage(STORAGE_KEYS.STATES_AND_CITIES, statesAndCitiesData);
    console.log('✅ City deleted:', cityName, 'from', state.name);
    return HttpResponse.json({ success: true });
  }),

  // Bookings endpoints
  http.get('/api/bookings', () => {
    bookingsData = loadFromStorage(STORAGE_KEYS.BOOKINGS, []);
    return HttpResponse.json({ success: true, data: bookingsData });
  }),

  http.post('/api/bookings', async ({ request }) => {
    const data = await request.json();
    const booking = {
      id: crypto.randomUUID(),
      status: 'confirmed',
      ...data,
      createdAt: new Date().toISOString()
    };
    
    bookingsData.push(booking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookingsData);
    
    return HttpResponse.json({ success: true, data: booking }, { status: 201 });
  }),

  http.put('/api/bookings/:id', async ({ params, request }) => {
    const index = bookingsData.findIndex(b => b.id === params.id);
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });

    bookingsData[index] = { ...bookingsData[index], ...(await request.json()) };
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookingsData);
    
    return HttpResponse.json({ success: true, data: bookingsData[index] });
  }),

  http.delete('/api/bookings/:id', ({ params }) => {
    bookingsData = bookingsData.map(b =>
      b.id === params.id ? { ...b, status: 'cancelled' } : b
    );
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookingsData);
    
    return HttpResponse.json({ success: true });
  }),

  // Auth endpoints
  http.post('/api/auth/signup', async ({ request }) => {
    const data = await request.json();
    usersData = loadFromStorage(STORAGE_KEYS.USERS, []);

    if (usersData.find(u => u.email === data.email)) {
      return HttpResponse.json({ error: 'User exists' }, { status: 400 });
    }

    const user = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      ...data 
    };
    usersData.push(user);
    saveToStorage(STORAGE_KEYS.USERS, usersData);

    currentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);

    const { password, ...safeUser } = user;
    return HttpResponse.json({ success: true, data: safeUser });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    usersData = loadFromStorage(STORAGE_KEYS.USERS, []);
    
    const user = usersData.find(u => 
      u.email === email && 
      u.password === password && 
      u.role !== 'admin' 
    );
    
    if (!user) {
      return HttpResponse.json({ 
        success: false,
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    currentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    
    const { password: _, ...safeUser } = user;
    return HttpResponse.json({ success: true, data: safeUser });
  }),

  http.post('/api/auth/admin/login', async ({ request }) => {
    const { email, password } = await request.json();
    usersData = loadFromStorage(STORAGE_KEYS.USERS, []);
    
    console.log('🔍 Admin login attempt:', { email, password });
    console.log('👥 Available users:', usersData.map(u => ({ 
      email: u.email, 
      role: u.role,
      password: u.password 
    })));
    
    const admin = usersData.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === 'admin'
    );
    
    console.log('🔐 Admin found:', admin ? 'YES' : 'NO');
    
    if (!admin) {
      return HttpResponse.json({ 
        success: false,
        error: 'Invalid admin credentials' 
      }, { status: 401 });
    }
    
    currentUser = admin;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    
    const { password: _, ...safeAdmin } = admin;
    return HttpResponse.json({ success: true, data: safeAdmin });
  }),

  http.post('/api/auth/logout', () => {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', () => {
    currentUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    
    if (!currentUser) {
      return HttpResponse.json({ 
        success: false,
        error: 'Not authenticated' 
      }, { status: 401 });
    }
    
    const { password, ...safeUser } = currentUser;
    return HttpResponse.json({ success: true, data: safeUser });
  })
];