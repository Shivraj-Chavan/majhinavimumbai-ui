"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { apiDelete, apiGet } from "@/lib/apiClient";

const Tab = ({ business, renderStars }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const sections = ["overview", "detail", "reviews", "photos"];

  useEffect(() => { 
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await apiGet(`/reviews/${business.id}`);
        console.log("Fetching reviews for business:", business?.id);
        console.log('reviews',res);
  
        setReviews(res);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (business?.id) fetchReviews();
  }, [business?.id]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    console.log("Attempting to delete review with ID:", reviewId);
  
    try {
      const res = await apiDelete(`/reviews/${reviewId}`);
      console.log("Deleted review:", reviewId);
      alert("Review Deleted Successfully!");
  
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review");
    }
  };  

  return (
    <div className="space-y-10 scroll-smooth">
      {/* Tabs */}
      <div className="flex gap-6 border-b mb-4">
        {sections.map((item) => (
          <a key={item} href={`#${item}`} className="pb-2 capitalize text-gray-600 hover:text-blue-700 font-medium transition">
            {item}
          </a>
        ))}
      </div>

      {/* Overview */}
      <section id="overview" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">Overview</h2>
        <p className="text-gray-700 mb-4">{business.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-gray-700 mb-6">
          {business.phone && <p><strong>Phone:</strong> {business.phone}</p>}
          {business.wp_number && (
            <p>
              <strong>WhatsApp:</strong>{" "}
              <a href={`https://wa.me/+91${business.wp_number}`} target="_blank" rel="noopener noreferrer" className="text-black underline">
                {business.wp_number}
              </a>
            </p>
          )}
          {business.email && (
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${business.email}`} className="text-blue-600">
                {business.email}
              </a>
            </p>
          )}
          {business.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {business.website}
              </a>
            </p>
          )}
          {business.pin_code && <p><strong>Pincode:</strong> {business.pin_code}</p>}
          {business.landmark && <p><strong>Landmark:</strong> {business.landmark}</p>}
          {business.sector && <p><strong>Sector:</strong> {business.sector}</p>}
          {business.area && <p><strong>Area:</strong> {business.area}</p>}
        </div>

        {business.timings?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800">Business Timings</h3>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {business.timings.map((t, i) => (
                <li key={i}>
                  <strong>{t.day}:</strong> {t.openTime} - {t.closeTime}
                </li>
              ))}
            </ul>
          </div>
        )}

        {business.mapLink && (
          <iframe src={business.mapLink} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" className="rounded-lg shadow"></iframe>
        )}
      </section>

      {/* Detail */}
      <section id="detail" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">Detail</h2>
        <ul className="text-gray-700 space-y-2">
          {business.menu?.length > 0 ? (
            business.menu.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b py-2">
                <span>{item.item}</span>
                <span>{item.price}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No menu items available.</p>
          )}
        </ul>
      </section>

      {/* Reviews */}
        <section id="reviews" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">Reviews</h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="relative bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
                  {/* Three Dots Menu */}
                  <div className="absolute top-2 right-2">
                    <div className="relative group">
                      <button className="text-gray-700 hover:text-gray-800 text-xl"> &#8942; </button>

                      {/* Dropdown */}
                      <div className="hidden group-hover:block absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button onClick={() => handleDeleteReview(review.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                      <Image src={review.avatar || "/image.png"} alt={review.user || "User"} fill className="object-cover"/>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{review.user || "Anonymous"}</h4>
                      <p className="text-sm text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </section>

      {/* Photos */}
      <section id="photos" className="scroll-mt-24">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-900">Photos</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {business.images?.length > 0 ? (
            business.images.filter((img) => img) // Filter out empty, null, or undefined strings
            .map((img, i) => (
              <div key={i} className="relative h-40 rounded-lg overflow-hidden">
                <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No images available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tab;
