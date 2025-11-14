import React, { useState, useEffect } from 'react';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    // API call to fetch services
    const fetchServices = async () => {
      // a fake API call
      const response = [
        { id: 1, title: 'Service 1', description: 'Description 1', price: 100, image: 'https://via.placeholder.com/150' },
        { id: 2, title: 'Service 2', description: 'Description 2', price: 200, image: null },
      ];
      setServices(response);
    };

    fetchServices();
  }, []);

  const handleAddService = (service) => {
    // API call to add a new service
    console.log('Adding service:', service);
    setServices([...services, { ...service, id: Date.now() }]);
    setAddModalOpen(false);
  };

  const handleUpdateService = (service) => {
    // API call to update a service
    console.log('Updating service:', service);
    setServices(services.map(s => s.id === service.id ? service : s));
    setEditModalOpen(false);
  };

  const handleRemoveService = (id) => {
    // API call to remove a service
    console.log('Removing service with id:', id);
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Services</h2>
      <button onClick={() => setAddModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Service</button>
      <ul>
        {services.map(service => (
          <li key={service.id} className="border p-4 mb-4 rounded">
            {service.image && <img src={service.image} alt={service.title} className="w-32 h-32 mb-4" />}
            <h3 className="font-bold">{service.title}</h3>
            <p>{service.description}</p>
            <p>${service.price}</p>
            <button onClick={() => { setCurrentService(service); setEditModalOpen(true); }} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
            <button onClick={() => handleRemoveService(service.id)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
          </li>
        ))}
      </ul>
      {isAddModalOpen && <ServiceFormModal onClose={() => setAddModalOpen(false)} onSave={handleAddService} />}
      {isEditModalOpen && <ServiceFormModal onClose={() => setEditModalOpen(false)} onSave={handleUpdateService} service={currentService} />}
    </div>
  );
};

const ServiceFormModal = ({ onClose, onSave, service }) => {
  const [title, setTitle] = useState(service ? service.title : '');
  const [description, setDescription] = useState(service ? service.description : '');
  const [price, setPrice] = useState(service ? service.price : '');
  const [image, setImage] = useState(service ? service.image : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: service ? service.id : null, title, description, price, image });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{service ? 'Edit Service' : 'Add Service'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded mt-2"></textarea>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded mt-2" />
            <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" className="w-full p-2 border rounded mt-2" />
          </div>
          <div className="items-center px-4 py-3">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Save
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyServices;
