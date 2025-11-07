import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // <-- backend URL
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
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/me'), // Fixed: Changed from /profile to /me
  updateDetails: (userData) => API.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => API.put('/auth/updatepassword', passwordData),
}

export const postsAPI = {
  getAll: (params = {}) => API.get('/posts', { params }),
  create: (postData) => API.post('/posts', postData),
  getById: (id) => API.get(`/posts/${id}`),
  update: (id, postData) => API.put(`/posts/${id}`, postData),
  delete: (id) => API.delete(`/posts/${id}`),
  like: (id) => API.put(`/posts/${id}/like`),
  unlike: (id) => API.put(`/posts/${id}/unlike`),
  addComment: (id, comment) => API.post(`/posts/${id}/comment`, { text: comment }),
  deleteComment: (id, commentId) => API.delete(`/posts/${id}/comment/${commentId}`),
}

export const servicesAPI = {
  getAll: (filters = {}) => API.get('/services', { params: filters }),
  create: (serviceData) => API.post('/services', serviceData),
  getById: (id) => API.get(`/services/${id}`),
  update: (id, serviceData) => API.put(`/services/${id}`, serviceData),
  delete: (id) => API.delete(`/services/${id}`),
  getByProvider: (providerId) => API.get(`/services/provider/${providerId}`),
  addReview: (id, reviewData) => API.post(`/services/${id}/reviews`, reviewData),

  // New method for provider dashboard
  getMyServices: () => API.get('/services/my-services'),
}

export const bookingsAPI = {
  create: (bookingData) => API.post('/bookings', bookingData),
  getMyBookings: () => API.get('/bookings/my-bookings'),
  getById: (id) => API.get(`/bookings/${id}`),
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status }),
  addReview: (id, reviewData) => API.post(`/bookings/${id}/review`, reviewData),

  // New method for provider dashboard
  getProviderBookings: () => API.get('/bookings/my-services'),
}

export const marketplaceAPI = {
  getAll: (filters = {}) => API.get('/marketplace', { params: filters }),
  create: (itemData) => API.post('/marketplace', itemData),
  getById: (id) => API.get(`/marketplace/${id}`),
  update: (id, itemData) => API.put(`/marketplace/${id}`, itemData),
  delete: (id) => API.delete(`/marketplace/${id}`),
  getMyItems: () => API.get('/marketplace/my-items'),
  updateStatus: (id, status) => API.put(`/marketplace/${id}/status`, { status }),
}


export default API
