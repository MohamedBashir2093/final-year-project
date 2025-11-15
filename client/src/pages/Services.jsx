import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // ✅ Added import
import { servicesAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Search, Filter, Star, MapPin, Clock, Plus } from 'lucide-react'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMoreCategories, setShowMoreCategories] = useState(false)
  const { user } = useAuth()

  const mainCategories = [
    { value: 'all', label: 'All Services' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'gardening', label: 'Gardening' }
  ]

  const moreCategories = [
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'painting', label: 'Painting' },
    { value: 'moving', label: 'Moving' },
    { value: 'pet_care', label: 'Pet Care' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const filters = {}
      if (selectedCategory !== 'all') filters.category = selectedCategory
      if (searchTerm) filters.search = searchTerm
      
      // For residents, show all active services
      // For providers, show all services (they can see what others offer too)
      
      const response = await servicesAPI.getAll(filters)
      console.log('Services for current user:', response.data)
      setServices(response.data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [selectedCategory, searchTerm])

  // ✅ Updated ServiceCard component with <Link>
  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0 sm:flex-shrink-0">
          <img
            src={
              service.provider?.avatar ? `http://localhost:5000${service.provider.avatar}` : `https://ui-avatars.com/api/?name=${service.provider?.name}&background=3B82F6&color=fff`
            }
            alt={service.provider?.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="sm:hidden">
            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize mt-1 inline-block">
              {service.category}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hidden sm:block">{service.title}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize hidden sm:block">
              {service.category}
            </span>
          </div>
          <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>

          <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{service.rating || 'New'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Nearby</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{service.availability}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 pt-3 border-t border-gray-100 sm:border-t-0 sm:pt-0">
            <div className="text-lg font-bold text-gray-900">
              ${service.price}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {service.priceType === 'hourly' ? '/hour' : ' fixed'}
              </span>
            </div>
            <Link
              to={`/services/${service._id}`}
              className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details & Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Local Services</h1>
          <p className="text-gray-600 mt-2">
            Find trusted service providers in your neighborhood
          </p>
        </div>
        {user?.role === 'service_provider' && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors self-start sm:self-auto">
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
              {mainCategories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
              <button
                onClick={() => setShowMoreCategories(!showMoreCategories)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors relative ${
                  showMoreCategories
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                More Services
                <span className="ml-1">{showMoreCategories ? '▲' : '▼'}</span>
              </button>
            </div>

            {/* Expanded More Categories */}
            {showMoreCategories && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 md:border-t-0 md:pt-0">
                {moreCategories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setSelectedCategory(category.value);
                      setShowMoreCategories(false);
                    }}
                    className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6">
        {services.map(service => (
          <ServiceCard key={service._id} service={service} />
        ))}

        {services.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search filters'
                : 'No services available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services
