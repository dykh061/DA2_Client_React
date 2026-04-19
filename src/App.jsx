import { Navigate, Route, Routes } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from "./components/AdminLayout";
import Dashboard from './pages/Dashboard';
import CourtsPage from "./pages/CourtsPage";
import BookingsPage from "./pages/BookingsPage";
import CustomerManagement from "./pages/CustomerManagement";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PricingPage from "./pages/PricingPage";
import PromotionsPage from "./pages/PromotionsPage";
import { FaTachometerAlt } from "react-icons/fa";
import { restoreSession } from "./services/apiClient";
import { getToken } from "./utils/auth";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-user"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={<Navigate to="/profile-user" replace />}
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/my-bookings" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/my-bookings" replace />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route
        path="/admin"
        element={
          // <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          // </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courts" element={<CourtsPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="customers" element={<CustomerManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
