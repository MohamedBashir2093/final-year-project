import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../lib/api'
import { Edit3, MapPin, Phone, Mail, Calendar, Settings } from 'lucide-react'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

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
    }
  }, [user])

  const handleSave = async () => {
    try {
      const response = await authAPI.updateDetails(editForm)
      // Update the user in context
      setUser(prev => ({ ...prev, ...editForm }))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      // You could add error handling here (show error message to user)
    }
  }


  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md"
        >
          <span>✏️</span>
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0 relative">
            <img
              src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff&size=150`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg"
            />
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition">
              ✏️
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const response = await authAPI.updateAvatar(file);
                      setUser(response.data);
                    } catch (err) {
                      console.error('Error uploading avatar:', err);
                    }
                  }
                }}
              />
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-500 text-lg">📝</span>
                <span className="font-semibold text-gray-900">Bio</span>
              </div>
              <p className="text-gray-700">{user?.bio || 'No bio added yet. Share something about yourself!'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="font-semibold text-gray-900">Rating</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{user?.rating || 'New'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-purple-500 text-lg">👤</span>
                  <span className="font-semibold text-gray-900">Role</span>
                </div>
                <p className="text-gray-900 capitalize">{user?.role?.replace('_', ' ') || 'Community Resident'}</p>
              </div>
            </div>

            {user?.phone && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-500 text-lg">📞</span>
                  <span className="font-semibold text-gray-900">Phone</span>
                </div>
                <p className="text-gray-900">{user.phone}</p>
              </div>
            )}

          </div>
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