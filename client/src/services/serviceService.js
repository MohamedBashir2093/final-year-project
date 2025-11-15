import api from '../lib/api';

const serviceService = {
  // Get all services with optional filters
  getServices: async (params = {}) => {
    const response = await api.get('/api/services', { params });
    return response.data;
  },

  // Get single service by ID
  getService: async (id) => {
    const response = await api.get(`/api/services/${id}`);
    return response.data;
  },

  // Create new service (for providers)
  createService: async (serviceData) => {
    const response = await api.post('/api/services', serviceData);
    return response.data;
  },

  // Update service (for providers)
  updateService: async (id, serviceData) => {
    const response = await api.put(`/api/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service (for providers)
  deleteService: async (id) => {
    const response = await api.delete(`/api/services/${id}`);
    return response.data;
  },

  // Get services by provider
  getServicesByProvider: async (providerId) => {
    const response = await api.get(`/api/services/provider/${providerId}`);
    return response.data;
  },

  // Get current user's services (for providers)
  getMyServices: async () => {
    const response = await api.get('/api/services/my-services');
    return response.data;
  },

  // Add review to service
  addReview: async (serviceId, reviewData) => {
    const response = await api.post(`/api/services/${serviceId}/reviews`, reviewData);
    return response.data;
  }
};

export default serviceService;
