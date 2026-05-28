import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ReservationProvider } from './contexts/ReservationContext';
import { EventLogProvider } from './contexts/EventLogContext';
import { initializeData } from './services/dataService';
import { useEffect } from 'react';

// Customer Pages
import TopPage from './pages/customer/TopPage';
import PlanSelect from './pages/customer/PlanSelect';
import MeetingMethodSelect from './pages/customer/MeetingMethodSelect';
import MeetingDateSelect from './pages/customer/MeetingDateSelect';
import CustomerInfoForm from './pages/customer/CustomerInfoForm';
import ChildInfoForm from './pages/customer/ChildInfoForm';
import PaymentPage from './pages/customer/PaymentPage';
import ReservationComplete from './pages/customer/ReservationComplete';
import PreSurvey from './pages/customer/PreSurvey';
import ReservationConfirm from './pages/customer/ReservationConfirm';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ReservationList from './pages/admin/ReservationList';
import ReservationDetail from './pages/admin/ReservationDetail';
import Calendar from './pages/admin/Calendar';
import DataDashboard from './pages/admin/DataDashboard';
import FunnelAnalysis from './pages/admin/FunnelAnalysis';
import TrafficAnalysis from './pages/admin/TrafficAnalysis';
import FormDropoffAnalysis from './pages/admin/FormDropoffAnalysis';
import PlanAnalysis from './pages/admin/PlanAnalysis';
import MeetingAnalysis from './pages/admin/MeetingAnalysis';
import PaymentAnalysis from './pages/admin/PaymentAnalysis';
import SalesAnalysis from './pages/admin/SalesAnalysis';
import SiteEditor from './pages/admin/SiteEditor';
import PlanEditor from './pages/admin/PlanEditor';
import FormFieldEditor from './pages/admin/FormFieldEditor';
import FAQEditor from './pages/admin/FAQEditor';
import ImageEditor from './pages/admin/ImageEditor';
import MeetingSlotSettings from './pages/admin/MeetingSlotSettings';
import ABTestManager from './pages/admin/ABTestManager';
import NotificationSettings from './pages/admin/NotificationSettings';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <EventLogProvider>
          <ReservationProvider>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<TopPage />} />
              <Route path="/plan-select" element={<PlanSelect />} />
              <Route path="/meeting-method" element={<MeetingMethodSelect />} />
              <Route path="/meeting-date" element={<MeetingDateSelect />} />
              <Route path="/customer-info" element={<CustomerInfoForm />} />
              <Route path="/child-info" element={<ChildInfoForm />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/complete" element={<ReservationComplete />} />
              <Route path="/survey/:reservationId" element={<PreSurvey />} />
              <Route path="/confirm/:reservationId" element={<ReservationConfirm />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/reservations" element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
              <Route path="/admin/reservations/:id" element={<ProtectedRoute><ReservationDetail /></ProtectedRoute>} />
              <Route path="/admin/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/admin/data" element={<ProtectedRoute><DataDashboard /></ProtectedRoute>} />
              <Route path="/admin/data/funnel" element={<ProtectedRoute><FunnelAnalysis /></ProtectedRoute>} />
              <Route path="/admin/data/traffic" element={<ProtectedRoute><TrafficAnalysis /></ProtectedRoute>} />
              <Route path="/admin/data/form-dropoff" element={<ProtectedRoute><FormDropoffAnalysis /></ProtectedRoute>} />
              <Route path="/admin/data/plans" element={<ProtectedRoute><PlanAnalysis /></ProtectedRoute>} />
              <Route path="/admin/data/meetings" element={<ProtectedRoute><MeetingAnalysis /></ProtectedRoute>} />
              <Route path="/admin/data/payments" element={<ProtectedRoute><PaymentAnalysis /></ProtectedRoute>} />
              <Route path="/admin/data/sales" element={<ProtectedRoute><SalesAnalysis /></ProtectedRoute>} />
              <Route path="/admin/site-editor" element={<ProtectedRoute><SiteEditor /></ProtectedRoute>} />
              <Route path="/admin/plans" element={<ProtectedRoute><PlanEditor /></ProtectedRoute>} />
              <Route path="/admin/form-fields" element={<ProtectedRoute><FormFieldEditor /></ProtectedRoute>} />
              <Route path="/admin/faq" element={<ProtectedRoute><FAQEditor /></ProtectedRoute>} />
              <Route path="/admin/images" element={<ProtectedRoute><ImageEditor /></ProtectedRoute>} />
              <Route path="/admin/meeting-slots" element={<ProtectedRoute><MeetingSlotSettings /></ProtectedRoute>} />
              <Route path="/admin/ab-tests" element={<ProtectedRoute><ABTestManager /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
            </Routes>
          </ReservationProvider>
        </EventLogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
