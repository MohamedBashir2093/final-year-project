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
      console.log('Response data:', response.data);
      const servicesData = response.data?.data || response.data || [];
      console.log('Services data:', servicesData);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (service) => {
    try {
      const response = await serviceService.createService(service);
      const newService = response.data; // The service is nested in the data property
      setServices((prevServices) => [newService, ...prevServices]);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleUpdateService = async (service) => {
    try {
      const response = await serviceService.updateService(
        service._id || service.id,
        service
      );
      const updatedService = response.data; // The service is nested in the data property
      setServices((prevServices) =>
        prevServices.map((s) =>
          (s._id || s.id) === (updatedService._id || updatedService.id)
            ? updatedService
            : s
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Services</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md"
        >
          Add New Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No services yet</h3>
          <p className="text-gray-500">Start by adding your first service to help neighbors in your community.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s).map(service => {
            console.log('Rendering service:', service);
            return (
              <div key={service._id || service.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service?.title || 'Untitled Service'}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium capitalize">
                      {service?.category?.replace('_', ' ') || 'Other'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">${service?.price || '0'}</p>
                    <p className="text-sm text-gray-500 capitalize">{service?.priceType || 'fixed'}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{service?.description || 'No description available'}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setCurrentService(service); setEditModalOpen(true); }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveService(service._id || service.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
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

