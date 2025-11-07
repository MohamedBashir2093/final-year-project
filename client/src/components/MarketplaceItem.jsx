import React from 'react';
import { Link } from 'react-router-dom';

const MarketplaceItem = ({ item }) => {
  return (
    <div className="border p-4 rounded-lg">
      <Link to={`/marketplace/${item._id}`}>
        <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        <h2 className="text-xl font-bold">{item.title}</h2>
        <p className="text-gray-500">${item.price}</p>
      </Link>
    </div>
  );
};

export default MarketplaceItem;
