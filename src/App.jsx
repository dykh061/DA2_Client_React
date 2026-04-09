import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import CourtsPage from "./pages/CourtsPage";
import BookingsPage from "./pages/BookingsPage";
import CustomerManagement from "./pages/CustomerManagement";
import HistoryPage from "./pages/HistoryPage";
import ReviewsPage from "./pages/ReviewsPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { restoreSession } from "./services/apiClient";
import { getToken } from "./utils/auth";

function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const ok = await restoreSession();

      if (!isMounted) return;
      setIsAuthenticated(ok && Boolean(getToken()));
      setIsBootstrapping(false);
    };

    const onLogin = () => setIsAuthenticated(true);
    const onLogout = () => setIsAuthenticated(false);

    window.addEventListener("auth:login", onLogin);
    window.addEventListener("auth:logout", onLogout);

    bootstrap();

    return () => {
      isMounted = false;
      window.removeEventListener("auth:login", onLogin);
      window.removeEventListener("auth:logout", onLogout);
    };
  }, []);

  if (isBootstrapping) {
    return (
      <div className="p-4 text-center">Dang khoi phuc phien dang nhap...</div>
    );
  }

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
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="courts" element={<CourtsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
