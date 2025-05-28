'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';
import { apiPost } from '@/lib/apiClient';

export default function UploadPhotosSection({ businessId }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (selectedPhotos.length + newFiles.length > 20) {
      alert('You can select up to 20 photos only');
      return;
    }
    setSelectedPhotos((prev) => [...prev, ...newFiles]);
};

  const handleUploadPhotos = async () => {
    if (selectedPhotos.length === 0) {
      alert('Please select photos first.');
      return;
    }
    if (!businessId) {
      alert('Business ID is missing.');
      return;
    }

    const formData = new FormData();
    selectedPhotos.forEach((file) => {
      formData.append('photos', file);
    });

    try {
    const res = await apiPost (`/businesses/${businessId}`)
    //   if (!res.ok) throw new Error('Upload failed');
    //   const data = await res.json();
      console.log('Uploaded:', data.files);
      alert('Photos uploaded successfully!');
      setSelectedPhotos([]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload photos');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <FileUpload
          label="Photos (max 20)"
          name="photos"
          onChange={handleChange}
          accept="image/*"
          multiple
        />
        <button
          type="button"
          onClick={handleUploadPhotos}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Photos
        </button>
      </div>

      {selectedPhotos.length > 0 && (
        <div className="grid grid-cols-3 mt-4">
          {selectedPhotos.map((file, idx) => (
            <div key={idx} className="w-32 h-32 overflow-hidden border rounded">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
