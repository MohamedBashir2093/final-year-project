import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
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

// Import service provider pages
import ServiceProviderServices from './pages/ServiceProviderServices'
import ProviderBookings from './pages/ProviderBookings'
import ProviderReviews from './pages/ProviderReviews'

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
                
                {/* Service Provider Routes */}
                <Route path="/my-services" element={<PrivateRoute><ServiceProviderServices /></PrivateRoute>} />
                <Route path="/my-bookings" element={<PrivateRoute><ProviderBookings /></PrivateRoute>} />
                <Route path="/my-reviews" element={<PrivateRoute><ProviderReviews /></PrivateRoute>} />

                // Add this route
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