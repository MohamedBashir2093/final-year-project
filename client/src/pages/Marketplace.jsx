import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { marketplaceAPI } from '../lib/api';
import { Search, Filter, MapPin, Heart, Share, Plus } from 'lucide-react';


const Marketplace = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showListingForm, setShowListingForm] = useState(false)
  const [listingData, setListingData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good',
    location: '',
    images: [],
    quantity: 1,
  })
  const { user } = useAuth()

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'sports', label: 'Sports' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    fetchMarketplaceItems()
  }, [])

  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true)
      const response = await marketplaceAPI.getAll()
      setItems(response.data || [])
      setFilteredItems(response.data || [])
    } catch (err) {
      console.error('Error fetching marketplace items:', err)
      setItems([])
      setFilteredItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, selectedCategory])

  const filterItems = () => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }

  const handleListItem = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()

      // Add text fields
      Object.keys(listingData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, listingData[key])
        }
      })

      // Add images
      listingData.images.forEach((image, index) => {
        formData.append('images', image)
      })

      await marketplaceAPI.create(formData)

      // Reset form and close modal
      setListingData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: 'good',
        location: '',
        images: [],
        quantity: 1,
      })
      setShowListingForm(false)

      // Refresh items
      fetchMarketplaceItems()

      alert('Item listed successfully!')
    } catch (error) {
      console.error('Error listing item:', error)
      alert('Error listing item: ' + (error.message || 'Please try again'))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setListingData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await marketplaceAPI.delete(itemId);
        setItems(prevItems => prevItems.filter(item => item._id !== itemId));
        alert('Item deleted successfully!');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item: ' + (error.message || 'Please try again'));
      }
    }
  };

  const removeImage = (index) => {
    setListingData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const ItemCard = ({ item }) => {
    const isOwner = user && user._id === item.seller._id;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
        <Link to={`/marketplace/${item._id}`} className="block">
          <div className="relative">
            <img
              src={item.images && item.images[0] ? `http://localhost:5000${item.images[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3 flex space-x-2">
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                <Share className="w-4 h-4 text-gray-600 hover:text-blue-500" />
              </button>
            </div>
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                item.condition === 'new' ? 'bg-green-100 text-green-800' :
                item.condition === 'like_new' ? 'bg-blue-100 text-blue-800' :
                item.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.condition.replace('_', ' ')}
              </span>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
            <span className="text-xl font-bold text-blue-600">${item.price}</span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
            <img
              src={item.seller?.avatar ? `http://localhost:5000${item.seller.avatar}` : `https://ui-avatars.com/api/?name=${item.seller?.name}&background=3B82F6&color=fff`}
              alt={item.seller?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-700 font-medium">{item.seller?.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            {isOwner ? (
              <>
                <Link to={`/marketplace/edit/${item._id}`} className="flex-1 w-full">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </>
            ) : (
              <Link to={`/marketplace/${item._id}`} className="flex-1 w-full">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  View Details
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">Buy and sell items with people in your neighborhood</p>
        </div>
        <button
          onClick={() => setShowListingForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>List Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
           <ItemCard key={item._id} item={item} />
         ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search filters' 
                : 'Be the first to list an item in your neighborhood!'
              }
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              List Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Listing Form Modal */}
      {showListingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">List Your Item</h2>
                <button
                  onClick={() => setShowListingForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleListItem} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={listingData.title}
                      onChange={(e) => setListingData({ ...listingData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Vintage Wooden Chair"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={listingData.category}
                      onChange={(e) => setListingData({ ...listingData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.filter(cat => cat.value !== 'all').map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={listingData.description}
                    onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your item in detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={listingData.price}
                      onChange={(e) => setListingData({ ...listingData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={listingData.quantity}
                      onChange={(e) => setListingData({ ...listingData, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      required
                      value={listingData.condition}
                      onChange={(e) => setListingData({ ...listingData, condition: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="like_new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={listingData.location}
                      onChange={(e) => setListingData({ ...listingData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Downtown, 2 blocks away"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images * (Up to 5 images)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Select multiple images to showcase your item</p>

                  {listingData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {listingData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    List Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowListingForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Marketplace