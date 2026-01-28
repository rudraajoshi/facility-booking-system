import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { FacilityProvider } from '@/context/FacilityContext';
import { BookingProvider } from '@/context/BookingContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';

import Home from '@/pages/Home';
import Facilities from '@/pages/Facilities';
import FacilityDetails from '@/pages/FacilityDetails';
import BookingPage from '@/pages/BookingPage'; 
import MyBookings from '@/pages/MyBookings';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminFacilities from '@/pages/AdminFacilities';
import AdminLocations from '@/pages/AdminLocations'; // ADD THIS IMPORT

import HelpCenter from '@/pages/HelpCenter';
import ContactUs from '@/pages/ContactUs';
import FAQs from '@/pages/FAQs';
import CancellationPolicy from '@/pages/Cancellationpolicy';

function App() {
  return (
      <AuthProvider>
        <FacilityProvider>
          <BookingProvider>
            <BrowserRouter>
              <Routes>
                {/* auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Admin login route (separate, not protected) */}
                <Route path="/admin" element={<AdminLogin />} />

                {/* Admin protected routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="facilities" element={<AdminFacilities />} />
                  <Route path="locations" element={<AdminLocations />} /> {/* ADD THIS ROUTE */}
                </Route>

                {/* Public and user routes */}
                <Route path="/" element={<Layout />}>
                  {/* public routes */}
                  <Route index element={<Home />} />
                  <Route path="facilities" element={<Facilities />} />
                  <Route path="facilities/:id" element={<FacilityDetails />} />
                  
                  {/* protected routes */}
                  <Route 
                    path="my-bookings" 
                    element={
                      <ProtectedRoute excludeAdmin>
                        <MyBookings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="booking/:facilityId" 
                    element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* support */}
                  <Route path="help-center" element={<HelpCenter />} />
                  <Route path="contact-us" element={<ContactUs />} />
                  <Route path="faqs" element={<FAQs />} />
                  <Route path="cancellation-policy" element={<CancellationPolicy />} />

                  {/* 404 error */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </BookingProvider>
        </FacilityProvider>
      </AuthProvider>
  );
}

export default App;
