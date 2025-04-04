
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/hooks/use-theme';
import DarkModeProvider from '@/components/DarkModeProvider';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Appointments from '@/pages/Appointments';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import AppearanceSettings from '@/pages/settings/AppearanceSettings';
import NotificationsSettings from '@/pages/settings/NotificationsSettings';
import SecuritySettings from '@/pages/settings/SecuritySettings';
import BusinessHoursSettings from '@/pages/settings/BusinessHoursSettings';
import PaymentMethodsSettings from '@/pages/settings/PaymentMethodsSettings';
import IntegrationsSettings from '@/pages/settings/IntegrationsSettings';
import ProfileSettings from '@/pages/settings/ProfileSettings';
import ServicesPage from '@/pages/services/ServicesPage';
import EmployeesPage from '@/pages/employees/EmployeesPage';
import SalonsListPage from '@/pages/salons/SalonsListPage';
import SalonDetailPage from '@/pages/salons/SalonDetailPage';
import ServiceDetailPage from '@/pages/services/ServiceDetailPage';
import NotFound from '@/pages/NotFound';
import FinancesPage from '@/pages/finances/FinancesPage';
import ReviewsPage from '@/pages/reviews/ReviewsPage';
import StatisticsPage from '@/pages/statistics/StatisticsPage';
import MessagesPage from '@/pages/messages/MessagesPage';
import AppointmentsCalendarPage from '@/pages/appointments/AppointmentsCalendarPage';
import AppointmentsListPage from '@/pages/appointments/AppointmentsListPage';
import AppointmentsConfirmationsPage from '@/pages/appointments/AppointmentsConfirmationsPage';
import NewAppointmentPage from '@/pages/appointments/NewAppointmentPage';
import { getCurrentUser } from '@/lib/auth';
import './App.css';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Add glass-card effect class to body
    document.body.classList.add('bg-pattern');
    
    return () => {
      document.body.classList.remove('bg-pattern');
    };
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      <DarkModeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/salons" element={<SalonsListPage />} />
            <Route path="/salons/:id" element={<SalonDetailPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Appointments routes */}
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/calendar" 
              element={
                <ProtectedRoute>
                  <AppointmentsCalendarPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/list" 
              element={
                <ProtectedRoute>
                  <AppointmentsListPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/confirmations" 
              element={
                <ProtectedRoute>
                  <AppointmentsConfirmationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/new" 
              element={
                <ProtectedRoute>
                  <NewAppointmentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/new/salon/:id" 
              element={
                <ProtectedRoute>
                  <NewAppointmentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/new/service/:id" 
              element={
                <ProtectedRoute>
                  <NewAppointmentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/new/professional/:id" 
              element={
                <ProtectedRoute>
                  <NewAppointmentPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Finances routes */}
            <Route 
              path="/finances" 
              element={
                <ProtectedRoute>
                  <FinancesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finances/:section" 
              element={
                <ProtectedRoute>
                  <FinancesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Reviews routes */}
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute>
                  <ReviewsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Statistics routes */}
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute>
                  <StatisticsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Messages routes */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Settings routes */}
            <Route path="/settings">
              <Route 
                index
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="appearance" 
                element={
                  <ProtectedRoute>
                    <AppearanceSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="notifications" 
                element={
                  <ProtectedRoute>
                    <NotificationsSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="security" 
                element={
                  <ProtectedRoute>
                    <SecuritySettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="business-hours" 
                element={
                  <ProtectedRoute>
                    <BusinessHoursSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="payment-methods" 
                element={
                  <ProtectedRoute>
                    <PaymentMethodsSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="integrations" 
                element={
                  <ProtectedRoute>
                    <IntegrationsSettings />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* Service management */}
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Employee management */}
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
        </Router>
      </DarkModeProvider>
    </ThemeProvider>
  );
}

export default App;
