import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerDashboard from './pages/WorkerDashboard';
import VerifierDashboard from './pages/VerifierDashboard';
import AdvocateDashboard from './pages/AdvocateDashboard';
import GrievanceBoard from './pages/GrievanceBoard';
import LogEarnings from './pages/LogEarnings';
import Certificate from './pages/Certificate';
import Navbar from './components/Navbar';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            {user?.role === 'worker' ? <WorkerDashboard /> :
             user?.role === 'verifier' ? <VerifierDashboard /> :
             <AdvocateDashboard />}
          </ProtectedRoute>
        } />
        <Route path="/log-earnings" element={<ProtectedRoute roles={['worker']}><LogEarnings /></ProtectedRoute>} />
        <Route path="/grievances" element={<ProtectedRoute><GrievanceBoard /></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute roles={['worker']}><Certificate /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute roles={['verifier', 'advocate']}><VerifierDashboard /></ProtectedRoute>} />
        <Route path="/advocate" element={<ProtectedRoute roles={['advocate']}><AdvocateDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}