import React, { useState, useEffect } from 'react';
import serviceService from '../../services/serviceService';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getMyServices();
      console.log('API Response:', response);
      const servicesData = Array.isArray(response) ? response : response.data || [];
      console.log('Services data:', servicesData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (service) => {
    try {
      const newService = await serviceService.createService(service);
      setServices((prevServices) => [newService, ...prevServices]);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleUpdateService = async (service) => {
    try {
      const updatedService = await serviceService.updateService(
        service._id || service.id,
        service
      );

      setServices((prevServices) =>
        prevServices.map((s) =>
          (s._id || s.id) === updatedService._id ? updatedService : s
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleRemoveService = async (id) => {
    try {
      await serviceService.deleteService(id);
      setServices(services.filter(s => (s._id || s.id) !== id));
    } catch (error) {
      console.error('Error removing service:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
          <p className="text-gray-600 mt-2">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md"
        >
          <span>+</span>
          <span>Add New Service</span>
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 text-7xl mb-6">🛠️</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No services yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Start by adding your first service to help neighbors in your community and earn money doing what you love.</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md"
          >
            Create Your First Service
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {services.filter(s => s).map(service => (
            <div key={service._id || service.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-8 border border-gray-100 group">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex flex-wrap items-center space-x-3 mb-3">
                    <h3 className="text-2xl font-semibold text-gray-900">{service?.title || 'Untitled Service'}</h3>
                    {service?.isActive !== false && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2 sm:mt-0">
                        ✓ Active
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center space-x-4 mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize mt-2 sm:mt-0">
                      📂 {service?.category?.replace('_', ' ') || 'Other'}
                    </span>
                    <span className="flex items-center space-x-2 text-gray-600 mt-2 sm:mt-0">
                      <span>⭐</span>
                      <span className="font-medium">{service?.rating || 'New'}</span>
                    </span>
                    <span className="flex items-center space-x-2 text-gray-600 mt-2 sm:mt-0">
                      <span>👁️</span>
                      <span className="font-medium">{service?.views || 0} views</span>
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-3xl font-bold text-green-600">
                    ${service?.price || '0'}
                    <span className="text-lg font-normal text-gray-500">
                      {service?.priceType === 'hourly' ? '/hr' : ''}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 capitalize mt-1">{service?.priceType || 'fixed'}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 text-base leading-relaxed">{service?.description || 'No description available'}</p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => { setCurrentService(service); setEditModalOpen(true); }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <span>✏️</span>
                  <span>Edit Service</span>
                </button>
                <button
                  onClick={() => handleRemoveService(service._id || service.id)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <span>🗑️</span>
                  <span>Remove Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAddModalOpen && <ServiceFormModal onClose={() => setAddModalOpen(false)} onSave={handleAddService} />}
      {isEditModalOpen && <ServiceFormModal onClose={() => setEditModalOpen(false)} onSave={handleUpdateService} service={currentService} />}
    </div>
  );
};

const ServiceFormModal = ({ onClose, onSave, service }) => {
  const [title, setTitle] = useState(service ? service.title : '');
  const [category, setCategory] = useState(service ? service.category : '');
  const [description, setDescription] = useState(service ? service.description : '');
  const [price, setPrice] = useState(service ? service.price : '');
  const [priceType, setPriceType] = useState(service ? service.priceType : 'fixed');
  const [loading, setLoading] = useState(false);

  const categories = [
    'plumbing', 'electrical', 'cleaning', 'tutoring', 'gardening',
    'carpentry', 'painting', 'moving', 'pet_care', 'beauty', 'fitness', 'other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        ...(service?._id ? { _id: service._id } : {}), // keep ID for editing
        title,
        category,
        description,
        price: Number(price),
        priceType
      };

      await onSave(serviceData);
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., House Cleaning"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your service in detail..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price/Rate *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={priceType}
                  onChange={e => setPriceType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Per Hour</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyServices;
