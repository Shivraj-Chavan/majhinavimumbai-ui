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
      console.log("Loading user", user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profile_image: user.profile_image || '',
        is_active: typeof user.is_active === "number" ? user.is_active : 1,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({...prev,[name]: name === 'is_active' ? parseInt(value) : value,}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting updated form data for user ID:", user.id);
    console.log(formData);
    onUpdate(user.id, formData);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 w-full max-w-md relative transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg">
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit User Details</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Profile Image URL", name: "profile_image", type: "text" },
          ].map(({ label, name, type }) => (
            <div className="relative" key={name}>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="peer w-full border border-gray-300 rounded-md px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=" "/>
              <label className="absolute left-3 -top-3 text-sm text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-600">
                  {label}
                </label>
            </div>
          ))}

            <div className="relative">
              <select
                name="is_active"
                value={formData.is_active ? "1" : "0"}
                onChange={(e) => setFormData({...formData,is_active: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Inactive</option>
                <option value="1">Active</option>
              </select>
              <label className="absolute -top-3 left-3 text-sm text-gray-600 bg-white px-1">Status</label>
            </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow transition"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupEditUser;
