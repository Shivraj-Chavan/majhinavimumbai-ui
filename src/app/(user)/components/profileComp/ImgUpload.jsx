'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';
// import { MdDelete } from 'react-icons/md';

export default function UploadPhotosSection({ onPhotosSelected }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (selectedPhotos.length + newFiles.length > 20) {
      alert('You can select up to 20 photos only');
      return;
    }

    const updated = [...selectedPhotos, ...newFiles];
    setSelectedPhotos(updated);
    onPhotosSelected(updated); 
  };

  // const handleDeletePhoto = (index) => {
  //   const updated = selectedPhotos.filter((_, i) => i !== index);
  //   setSelectedPhotos(updated);
  //   onPhotosSelected(updated); 
  // };

  return (
    <div className="space-y-4">
      <FileUpload
        label="Photos (max 20)"
        name="photos"
        onChange={handleChange}
        accept="image/*"
        multiple
      />

      {/* {selectedPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
          {selectedPhotos.map((file, idx) => (
            <div key={idx} className="relative group w-32 h-32">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="object-cover w-full h-full rounded border border-gray-200"
              />
              <button
                onClick={() => handleDeletePhoto(idx)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                title="Delete photo"
              >
                <MdDelete size={13} />
              </button>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
