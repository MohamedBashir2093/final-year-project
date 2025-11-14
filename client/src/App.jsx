import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProviderDashboard from './pages/provider/ProviderDashboard'
import MyServices from './pages/provider/MyServices'
import ProviderBookings from './pages/provider/ProviderBookings'
import ProviderProfile from './pages/provider/ProviderProfile'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Services from './pages/Services'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'
import Feed from './pages/Feed'
import PrivateRoute from './components/auth/PrivateRoute'
import ServiceDetails from './pages/ServiceDetails'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true }}>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Resident Routes */}
                <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
                <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
                <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />

                {/* Service Provider Dashboard */}
                <Route path="/provider-dashboard" element={<PrivateRoute><ProviderDashboard /></PrivateRoute>}>
                  <Route index element={<Navigate to="services" />} />
                  <Route path="services" element={<MyServices />} />
                  <Route path="bookings" element={<ProviderBookings />} />
                  <Route path="profile" element={<ProviderProfile />} />
                </Route>

                <Route path="/services/:id" element={
                  <PrivateRoute>
                    <ServiceDetails />
                  </PrivateRoute>
                } />
                
                {/* Shared Route */}
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App