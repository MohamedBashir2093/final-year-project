import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../lib/api';
import { Link } from 'react-router-dom';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const response = await servicesAPI.getMyServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching my services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <div key={service._id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold">{service.title}</h2>
            <p>{service.description}</p>
            <Link to={`/services/${service._id}`} className="text-blue-500">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyServices;
