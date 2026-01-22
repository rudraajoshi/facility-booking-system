import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { FacilityProvider } from '@/context/FacilityContext';
import { BookingProvider } from '@/context/BookingContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';

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
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/admin" element={<AdminLogin />} />
                
                {/* admin dashboard */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

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
