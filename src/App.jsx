import { Navigate, Route, Routes } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from "./components/AdminLayout";
import Dashboard from './pages/Dashboard';
import CourtsPage from "./pages/CourtsPage";
import BookingsPage from './pages/BookingsPage';
import CustomerManagement from './pages/CustomerManagement';
import HistoryPage from './pages/HistoryPage';
import ReviewsPage from './pages/ReviewsPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<UsersPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="courts" element={<CourtsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="history" element={<HistoryPage/>} />
        <Route path="reviews" element={<ReviewsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
