import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { postsAPI, servicesAPI, marketplaceAPI } from '../lib/api'
import { Edit3, MapPin, Phone, Mail, Calendar, Star, Settings, LogOut } from 'lucide-react'

const Profile = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [posts, setPosts] = useState([])
  const [services, setServices] = useState([])
  const [listings, setListings] = useState([])
  const [stats, setStats] = useState({ posts: 0, services: 0, itemsSold: 0, rating: 0 })

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        }
      })
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [postsRes, servicesRes, listingsRes] = await Promise.all([
        postsAPI.getAll({ author: user._id }),
        servicesAPI.getMyServices(),
        marketplaceAPI.getMyItems(),
      ]);
      setPosts(postsRes.data);
      setServices(servicesRes.data);
      setListings(listingsRes.data);
      setStats({
        posts: postsRes.count,
        services: servicesRes.count,
        itemsSold: listingsRes.data.filter(i => i.status === 'sold').length,
        rating: user.rating || 0
      })
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API
      console.log('Saving profile:', editForm)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&size=128&background=3B82F6&color=fff`}
              alt={user.name}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{user.address?.city || 'Add location'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit Profile
                </button>
                <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {user.bio || 'No bio added yet. Share something about yourself!'}
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              {user.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'service_provider' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role === 'service_provider' ? 'Service Provider' : 'Community Resident'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Posts"
          value={stats.posts}
          icon={Edit3}
          color="bg-blue-500"
        />
        <StatsCard
          title="Services"
          value={stats.services}
          icon={Star}
          color="bg-green-500"
        />
        <StatsCard
          title="Items Sold"
          value={stats.itemsSold}
          icon={MapPin}
          color="bg-purple-500"
        />
        <StatsCard
          title="Rating"
          value={stats.rating}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['posts', 'services', 'listings', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div>
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post._id} className="border p-4 rounded">
                      <h4 className="font-bold">{post.title}</h4>
                      <p>{post.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600">Posts you create will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {user.role === 'service_provider' ? 'No services listed' : 'No services booked'}
              </h3>
              <p className="text-gray-600">
                {user.role === 'service_provider' 
                  ? 'List your first service to help your neighbors.' 
                  : 'Book services from local providers.'
                }
              </p>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No marketplace listings</h3>
              <p className="text-gray-600">Items you list for sale will appear here.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Reviews from your community will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell your neighbors about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.address?.city}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={editForm.address?.state}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile