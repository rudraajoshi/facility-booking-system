import { http, HttpResponse } from 'msw';
import { facilitiesData as facilities } from '@/data/facilities';

// persistence
const STORAGE_KEYS = {
  USERS: 'msw_users',
  BOOKINGS: 'msw_bookings',
  CURRENT_USER: 'msw_current_user'
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

// in memory db for persistence
let facilitiesData = [...facilities];
let bookingsData = loadFromStorage(STORAGE_KEYS.BOOKINGS, []);
let usersData = loadFromStorage(STORAGE_KEYS.USERS, [
  // default test users to test persistence
  {
    id: 'default-1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
  },
  {
    id: 'default-2',
    name: 'Guest User',
    email: 'guest@example.com',
    password: 'guest123'
  }
]);
let currentUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);

if (usersData.length > 0) {
  saveToStorage(STORAGE_KEYS.USERS, usersData);
}

// api handlers
export const handlers = [

  http.get('/api/facilities', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const capacity = url.searchParams.get('capacity');
    const search = url.searchParams.get('search');

    let result = [...facilitiesData];

    if (type && type !== 'all') {
      result = result.filter(f => f.type.toLowerCase() === type.toLowerCase());
    }

    if (capacity) {
      result = result.filter(f => f.capacity >= parseInt(capacity));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q)
      );
    }

    return HttpResponse.json({ success: true, data: result });
  }),

  http.get('/api/facilities/:id', ({ params }) => {
    const facility = facilitiesData.find(f => f.id === params.id);
    if (!facility) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: facility });
  }),

  http.post('/api/facilities', async ({ request }) => {
    const data = await request.json();
    const newFacility = { id: crypto.randomUUID(), ...data };
    facilitiesData.push(newFacility);
    return HttpResponse.json({ success: true, data: newFacility }, { status: 201 });
  }),

  http.put('/api/facilities/:id', async ({ params, request }) => {
    const index = facilitiesData.findIndex(f => f.id === params.id);
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });

    facilitiesData[index] = { ...facilitiesData[index], ...(await request.json()) };
    return HttpResponse.json({ success: true, data: facilitiesData[index] });
  }),

  http.delete('/api/facilities/:id', ({ params }) => {
    facilitiesData = facilitiesData.filter(f => f.id !== params.id);
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

  http.get('/api/bookings', () => {
    // Reload from storage to get latest data
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
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookingsData); // ✅ Save to localStorage
    
    return HttpResponse.json({ success: true, data: booking }, { status: 201 });
  }),

  http.put('/api/bookings/:id', async ({ params, request }) => {
    const index = bookingsData.findIndex(b => b.id === params.id);
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });

    bookingsData[index] = { ...bookingsData[index], ...(await request.json()) };
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookingsData); // ✅ Save to localStorage
    
    return HttpResponse.json({ success: true, data: bookingsData[index] });
  }),

  http.delete('/api/bookings/:id', ({ params }) => {
    bookingsData = bookingsData.map(b =>
      b.id === params.id ? { ...b, status: 'cancelled' } : b
    );
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookingsData); // ✅ Save to localStorage
    
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const data = await request.json();
    usersData = loadFromStorage(STORAGE_KEYS.USERS, []);

    if (usersData.find(u => u.email === data.email)) {
      return HttpResponse.json({ error: 'User exists' }, { status: 400 });
    }

    const user = { id: crypto.randomUUID(), ...data };
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
    const user = usersData.find(u => u.email === email && u.password === password);
    if (!user) return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    currentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser); 
    const { password: _, ...safeUser } = user;
    return HttpResponse.json({ success: true, data: safeUser });
  }),
  http.post('/api/auth/logout', () => {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); 
    return HttpResponse.json({ success: true });
  }),
  http.get('/api/auth/me', () => {
    currentUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    
    if (!currentUser) {
      return HttpResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const { password, ...safeUser } = currentUser;
    return HttpResponse.json({ success: true, data: safeUser });
  })
];