import api from '../lib/api';

const reviewService = {
  getReviewsForService: (serviceId) => api.get(`/services/${serviceId}/reviews`),
  createReview: (serviceId, reviewData) => api.post(`/services/${serviceId}/reviews`, reviewData),
};

export default reviewService;
