import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const PopupEditUser = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_image: '',
    is_active: 1,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profile_image: user.profile_image || '',
        is_active: user.is_active,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-7 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-black">
          <FaTimes />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="profile_image"
            value={formData.profile_image}
            onChange={handleChange}
            placeholder="profile_image"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupEditUser;
