import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Users, Shield, HeartHandshake, Store, ArrowRight } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: Users,
      title: 'Community Feed',
      description: 'Stay connected with your neighbors through shared updates and events.',
      color: 'from-blue-700 to-cyan-700',
      path: '/feed'
    },
    {
      icon: HeartHandshake,
      title: 'Local Services',
      description: 'Find trusted service providers in your neighborhood for all your needs.',
      color: 'from-green-700 to-emerald-700',
      path: '/services'
    },
    {
      icon: Store,
      title: 'Marketplace',
      description: 'Buy and sell items locally with people you can trust.',
      color: 'from-purple-700 to-pink-700',
      path: '/marketplace'
    },
    {
      icon: Shield,
      title: 'Safe & Verified',
      description: 'All users and services are verified for your peace of mind.',
      color: 'from-orange-700 to-red-700',
      path: user ? '/dashboard' : '/login'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-300">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Your Neighborhood
            </span>
            <br />
            <span className="text-gray-900">Connected</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with your community, discover local services, and build meaningful relationships right in your neighborhood.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold"
              >
                Join Your Community
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-gray-400 text-gray-800 rounded-xl hover:border-blue-700 hover:text-blue-700 transition-all duration-200 text-lg font-semibold"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to="/feed"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg font-semibold mb-16"
            >
              <span>Go to Community Feed</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {['10K+', '500+', '95%', '24/7'].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat}</div>
                <div className="text-sm text-gray-700">
                  {['Active Users', 'Local Services', 'Satisfaction Rate', 'Community Support'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything Your Community Needs
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Designed to bring neighbors closer and make community living better than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={index}
                  to={user ? feature.path : '/login'}
                  className="group p-6 bg-gray-100 rounded-2xl border border-gray-300 hover:border-transparent hover:shadow-2xl transition-all duration-300 block"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
