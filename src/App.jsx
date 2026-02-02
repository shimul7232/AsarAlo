import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './Pages/Login/login';
import Register from './Pages/Login/register';
import AdminDashboard from './Pages/AdminDashboard';
import UserDashboard from './Pages/UserDashboard';
import Home from './Pages/Home/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} />} />
      <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/user/dashboard" element={user && user.role === 'user' ? <UserDashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
