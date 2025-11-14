import React, { useState, useEffect } from 'react';

const ProviderProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    // API call to fetch profile data
    const fetchProfile = async () => {
      // a fake API call
      const response = {
        name: 'Service Provider',
        email: 'provider@example.com',
        profilePicture: 'https://via.placeholder.com/150',
        rating: 4.5,
        verified: true,
      };
      setProfile(response);
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = (updatedProfile) => {
    // API call to update profile
    console.log('Updating profile:', updatedProfile);
    setProfile(updatedProfile);
    setEditModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Provider Profile</h2>
      <img src={profile.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mb-4" />
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Rating: {profile.rating}</p>
      <p>Status: {profile.verified ? 'Verified' : 'Not Verified'}</p>
      <button onClick={() => setEditModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Update Profile</button>
      {isEditModalOpen && <ProfileFormModal onClose={() => setEditModalOpen(false)} onSave={handleUpdateProfile} profile={profile} />}
    </div>
  );
};

const ProfileFormModal = ({ onClose, onSave, profile }) => {
  const [name, setName] = useState(profile ? profile.name : '');
  const [email, setEmail] = useState(profile ? profile.email : '');
  const [profilePicture, setProfilePicture] = useState(profile ? profile.profilePicture : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...profile, name, email, profilePicture });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mt-2" />
            <input type="text" value={profilePicture} onChange={e => setProfilePicture(e.target.value)} placeholder="Profile Picture URL" className="w-full p-2 border rounded mt-2" />
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

export default ProviderProfile;
