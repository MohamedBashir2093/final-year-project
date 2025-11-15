import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProviderDashboard from './pages/provider/ProviderDashboard'
import MyServices from './pages/provider/MyServices'
import ProviderBookings from './pages/provider/ProviderBookings'
import ProviderProfile from './pages/provider/ProviderProfile'
import ResidentDashboard from './pages/ResidentDashboard'
import ResidentBookings from './pages/ResidentBookings'
import Navbar from './components/layout/Navbar'
import Footer from './components/Footer' // Import Footer
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Services from './pages/Services'
import Marketplace from './pages/Marketplace'
import MarketplaceItemDetails from './pages/MarketplaceItemDetails'
import Profile from './pages/Profile'
import Feed from './pages/Feed'
import PrivateRoute from './components/auth/PrivateRoute'
import ServiceDetails from './pages/ServiceDetails'
import EditMarketplaceItem from './pages/EditMarketplaceItem'
import About from './pages/About' // Import About
import Contact from './pages/Contact' // Import Contact

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true }}>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} /> {/* New Route */}
                <Route path="/contact" element={<Contact />} /> {/* New Route */}
                
                {/* Resident Routes */}
                <Route path="/dashboard" element={<PrivateRoute><ResidentDashboard /></PrivateRoute>} />
                <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
                <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
                <Route path="/bookings" element={<PrivateRoute><ResidentBookings /></PrivateRoute>} />
                <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
                <Route path="/marketplace/:id" element={<PrivateRoute><MarketplaceItemDetails /></PrivateRoute>} />
                <Route path="/marketplace/edit/:id" element={<PrivateRoute><EditMarketplaceItem /></PrivateRoute>} />

                {/* Service Provider Dashboard */}
                <Route path="/provider-dashboard" element={<PrivateRoute><ProviderDashboard /></PrivateRoute>}>
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
            <Footer /> {/* Add Footer */}
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App