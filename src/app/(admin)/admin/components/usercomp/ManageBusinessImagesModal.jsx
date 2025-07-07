"use client";
import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import CONFIG from "@/constance";
import axiosInstance from "@/lib/axios";
import Image from "next/image";

export default function ManageBusinessImagesModal({ isOpen, onClose, business }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (isOpen && business?.id) {
      fetchImages();
    }
  }, [isOpen, business]);

  const fetchImages = async () => {
    try {
      const res = await apiGet(`/businesses/${business.id}/photos`);
      console.log({res})
      setImages(res.images || []);
    } catch (err) {
      console.error("Error loading images:", err);
      alert("Failed to load images");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`The following files are too large (must be under 2MB): ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9)
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }

    // Reset input
    e.target.value = '';
  };

  const removeSelectedFile = (fileId) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(({ file }) => {
      formData.append("photos", file);
    });

    try {
      setUploading(true);
      await axiosInstance.post(`/businesses/${business.id}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Clean up previews
      selectedFiles.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
      setSelectedFiles([]);
      
      await fetchImages();
      alert("Images uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      await axiosInstance.delete(`${CONFIG.API_BASE_URL}/businesses/${business.id}/photos`, {
        data: { photoUrl: imageUrl },
      });

      await fetchImages();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete image");
    }
  };

  const confirmDelete = (imageUrl) => {
    setDeleteConfirm(imageUrl);
  };

  const getImageUrl = (img) => {
    // Handle different possible URL formats
    if (img?.image_url) {
      // If it's a relative path, prepend the base URL
      if (img.image_url.startsWith('/') || !img.image_url.startsWith('http')) {
        return `${CONFIG.IMAGE_BASE_URL}${img.image_url}`;
      }
      // If it's already a full URL, use as is
      return img.image_url;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 text-2xl font-light w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
        >
          ×
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Manage Images
          </h2>
          <p className="text-gray-600">
            for <span className="font-semibold text-blue-600">{business?.name}</span>
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200">
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleFileChange}
              className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="w-full mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Selected Files ({selectedFiles.length})</h3>
                  <button
                    onClick={handleUploadAll}
                    disabled={uploading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span>Upload All</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedFiles.map(({ file, preview, id }) => (
                    <div key={id} className="relative group">
                      <Image
                        src={preview}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-lg shadow border"
                      />
                      <button
                        onClick={() => removeSelectedFile(id)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Images */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Current Images ({images.length})</h3>
          
          {images.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No images uploaded yet.</p>
              <p className="text-gray-400 text-sm mt-2">Upload your first image to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img, idx) => {
                const imageUrl = getImageUrl(img);
                return (
                  <div key={idx} className="relative group bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`Business Image ${idx + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Invalid image URL</span>
                      </div>
                    )}
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                      <span className="text-gray-500">Failed to load image</span>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => confirmDelete(img.image_url)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteImage(deleteConfirm)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}