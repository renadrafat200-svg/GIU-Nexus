import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import HomePage from './pages/HomePage'
import JobListPage from './pages/JobListPage'
import JobDetailPage from './pages/JobDetailPage'
import CreateJobPage from './pages/CreateJobPage'
import EditJobPage from './pages/EditJobPage'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div style={loadingStyle}>Loading...</div>
  return isAuthenticated ? children : <Navigate to="/login" />
}

const RoleRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <div style={loadingStyle}>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  if (!roles.includes(user?.role)) return <Navigate to="/" />
  return children
}

const loadingStyle = {
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  minHeight: '80vh', fontSize: '1.1rem', color: '#9999BB'
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Private */}
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />

        {/* Recruiter */}
        <Route path="/jobs/create" element={<RoleRoute roles={['recruiter']}><CreateJobPage /></RoleRoute>} />
        <Route path="/jobs/:id/edit" element={<RoleRoute roles={['recruiter']}><EditJobPage /></RoleRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
