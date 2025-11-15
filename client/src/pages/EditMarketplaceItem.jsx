import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marketplaceAPI } from "../lib/api";

const EditMarketplaceItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listingData, setListingData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "good",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await marketplaceAPI.getById(id);
        setListingData(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await marketplaceAPI.update(id, listingData);
      alert("Item updated successfully!");
      navigate("/marketplace");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item: " + (error.message || "Please try again"));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Your Item</h2>
      <form onSubmit={handleUpdateItem} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Title *</label>
          <input
            type="text"
            required
            value={listingData.title}
            onChange={(e) => setListingData({ ...listingData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            required
            rows="4"
            value={listingData.description}
            onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={listingData.price}
            onChange={(e) => setListingData({ ...listingData, price: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Update Item
          </button>
          <button
            type="button"
            onClick={() => navigate("/marketplace")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMarketplaceItem;