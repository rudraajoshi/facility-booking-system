import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Facilities from './pages/Facilities';
import FacilityDetails from './pages/FacilityDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="facilities/:id" element={<FacilityDetails />} />
              <Route path="booking/:facilityId" element={<BookingPage />} />
              <Route path="my-bookings" element={<MyBookings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;