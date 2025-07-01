"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { apiDelete, apiGet } from "@/lib/apiClient";
import { toast } from "react-toastify";

const Tab = ({ business, renderStars, setRefreshApi}) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [businessOwnerId, setBusinessOwnerId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const sections = ["overview", "detail", "reviews", "photos"];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

   
    // Fetch current user ID
    useEffect(() => {
     
      const fetchCurrentUser = async () => {
        if(!isLoggedIn) return 
        try {
          const res = await apiGet("/users/me");
          console.log("Fetched user:", res);
  
          if (res && res.id) {
            setCurrentUserId(res.id);
          } else {
            console.warn("User ID missing from /users/me response");
          }
        } catch (err) {
          console.error("Failed to fetch current user:", err);
        }
      };
      fetchCurrentUser();
    }, [isLoggedIn]);
  

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
     // Set business owner ID here
     if (business.owner_id) {
      setBusinessOwnerId(business.owner_id);
    } else {
      console.warn("Business owner_id missing");
    }
  }, [business?.id]);
 

  const handleDeleteReview = async (reviewId, reviewUserId) => {
    const isReviewer = (reviewUserId) === (currentUserId);
  
    try {
      const data = await apiDelete(`/reviews/reviews/${reviewId}`); 
      console.log('Delete Review',data);
  
      if (data.success || data.message === "Review deleted successfully") {
        toast.success(data.message || "Review deleted");
  
        if (isReviewer) {
          setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        }
      } else {
        console.warn("Review delete request raised, not deleted");
        toast.info(data.message || "Delete request has been raised to admin");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setRefreshApi((oldCount) => oldCount + 1);
      setVisibleMenu(null);

    }
  };
  
  // console.log("review user_id", reviews[0]?.user_id);
  // console.log("currentUserId", currentUserId);
  // console.log("businessOwnerId", businessOwnerId);

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
        ) : Array.isArray(reviews) && reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => {
              const isReviewer = review.user_id=== currentUserId;
              const isBusinessOwner = businessOwnerId === currentUserId;
              console.log({"koni takla ":review.user_id,"kon bgtay ":currentUserId,"business owner":businessOwnerId})
                console.log({isReviewer,isBusinessOwner,currentUserId})
                
              return (
                <div key={review.id} className="relative bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
                  {/* Review content */}
                  <p className="text-gray-900 mb-2">{review.comment}</p>
                  <p className="text-yellow-500 flex">{renderStars(review.rating)}</p>
                  <p className="text-sm text-gray-500 mt-2">Date: {new Date(review.created_at).toLocaleString()}</p>

                  {/* Three Dots Menu */}
                  {(isReviewer || isBusinessOwner) && (
                    <div className="absolute top-2 right-2">
                      <div className="relative">
                        <button
                          className="text-red-600 hover:text-red-700 text-xl focus:outline-none"
                          onClick={() =>
                            setVisibleMenu((prev) => (prev === review.id ? null : review.id))
                          }
                        >
                          &#8942;
                        </button>

                        {visibleMenu === review.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button
                              onClick={() => handleDeleteReview(review.id, review.user_id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              {isReviewer ? "Delete Review" : "Raise Delete Request"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </section>

      {/* Photos */}
      <section id="photos" className="scroll-mt-24">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-900">Photos</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {business.images?.length > 0 ? (
            business.images.filter((img) => img) 
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
