import React from 'react';
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";

export default function BusinessRegisterModal({ isOpen, onClose, business }) {
  if (!business) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg md:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          <div className="flex justify-between items-center  mb-4">
            <Dialog.Title className="text-xl font-bold text-gray-800">
              Bussiness Details
            </Dialog.Title>
            <button onClick={onClose}>
              <IoMdClose className="text-xl font-bold text-gray-600 hover:text-blue-700" />
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
          <div>
              <strong>Owner Id:</strong> {business.owner_id}
            </div>
            <div>
              <strong>Name:</strong> {business.name}
            </div>
            <div>
              <strong>Phone:</strong> {business.phone}
            </div>
            <div>
              <strong>Email:</strong> {business.email}
            </div>
            <div>
              <strong>Category:</strong> {business.category}
            </div>
            <div>
              <strong>Subcategory:</strong> {business.subcategory}
            </div>
            <div>
              <strong>Address:</strong> {business.address || "N/A"}
            </div>
            <div>
              <strong>Area:</strong> {business.area || "N/A"}
            </div>
            <div>
              <strong>Pincode:</strong> {business.pin_code}
            </div>
            <div>
              <strong>Landmark:</strong> {business.landmark || "N/A"}
            </div>
            <div>
              <strong>Sector:</strong> {business.sector}
            </div>
            <div>
              <strong>Whatsapp Number:</strong> {business.wp_number}
            </div>
            <div>
              <strong>Timings:</strong> {business.timings}
            </div>
            <div>
              <strong>Website:</strong>{" "}
              {business.website ? (
                <a href={business.website} target="_blank" className="text-blue-600 underline">
                  {business.website}
                </a>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
