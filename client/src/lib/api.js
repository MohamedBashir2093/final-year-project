import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/', // Direct to backend
  withCredentials: true,                // optional, only if using cookies
})

// Request interceptor to add auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response.data, // Fixed: Return response.data directly
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

export const authAPI = {
  login: (email, password) => API.post('/api/auth/login', { email, password }),
  register: (userData) => API.post('/api/auth/register', userData),
  getProfile: () => API.get('/api/auth/me'), // Fixed: Changed from /profile to /me
  updateDetails: (userData) => API.put('/api/auth/updatedetails', userData),
  updatePassword: (passwordData) => API.put('/api/auth/updatepassword', passwordData),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return API.put('/api/auth/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}

export const postsAPI = {
  getAll: (params = {}) => API.get('/api/posts', { params }),
  create: (postData) => {
    if (postData instanceof FormData) {
      return API.post('/api/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return API.post('/api/posts', postData);
  },
  getById: (id) => API.get(`/api/posts/${id}`),
  update: (id, postData) => API.put(`/api/posts/${id}`, postData),
  delete: (id) => API.delete(`/api/posts/${id}`),
  like: (id) => API.put(`/api/posts/${id}/like`),
  unlike: (id) => API.put(`/api/posts/${id}/unlike`),
  addComment: (id, comment) => API.post(`/api/posts/${id}/comment`, { text: comment }),
  deleteComment: (id, commentId) => API.delete(`/api/posts/${id}/comment/${commentId}`),
  getMyPostsCount: () => API.get('/api/posts/my-posts/count'),
}

export const servicesAPI = {
  getAll: (filters = {}) => API.get('/api/services', { params: filters }),
  create: (serviceData) => API.post('/api/services', serviceData),
  getById: (id) => API.get(`/api/services/${id}`),
  update: (id, serviceData) => API.put(`/api/services/${id}`, serviceData),
  delete: (id) => API.delete(`/api/services/${id}`),
  getByProvider: (providerId) => API.get(`/api/services/provider/${providerId}`),
  addReview: (id, reviewData) => API.post(`/api/services/${id}/reviews`, reviewData),

  // New method for provider dashboard
  getMyServices: () => API.get('/api/services/my-services'),
}

export const bookingsAPI = {
  create: (bookingData) => API.post('/api/bookings', bookingData),
  getMyBookings: () => API.get('/api/bookings/my-bookings'),
  getById: (id) => API.get(`/api/bookings/${id}`),
  updateStatus: (id, status) => API.put(`/api/bookings/${id}/status`, { status }),
  update: (id, data) => API.put(`/api/bookings/${id}`, data),
  addReview: (id, reviewData) => API.post(`/api/bookings/${id}/review`, reviewData),

  // New method for provider dashboard
  getProviderBookings: () => API.get('/api/bookings/my-services'),
}

export const marketplaceAPI = {
  getAll: (filters = {}) => API.get('/api/marketplace', { params: filters }),
  create: (itemData) => API.post('/api/marketplace', itemData),
  getById: (id) => API.get(`/api/marketplace/${id}`),
  update: (id, itemData) => API.put(`/api/marketplace/${id}`, itemData),
  delete: (id) => API.delete(`/api/marketplace/${id}`),
  getMyItems: () => API.get('/api/marketplace/my-items'),
  getMyItemsCount: () => API.get('/api/marketplace/my-items/count'),
  updateStatus: (id, status) => API.put(`/api/marketplace/${id}/status`, { status }),
}


export default API
