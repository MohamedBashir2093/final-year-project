import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { marketplaceAPI } from '../lib/api';

const MarketplaceItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await marketplaceAPI.getById(id);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
      <img src={item.images[0]} alt={item.title} className="w-full h-96 object-cover rounded-lg mb-4" />
      <p className="text-xl font-bold">${item.price}</p>
      <p>{item.description}</p>
    </div>
  );
};

export default MarketplaceItemDetails;
