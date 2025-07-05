"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { apiDelete, apiGet } from "@/lib/apiClient";
import { toast } from "react-toastify";
import CONFIG from "@/constance";
import { FaAddressBook, FaBuilding, FaCity, FaCommentDots, FaEnvelope, FaGlobe, FaInfoCircle, FaMapMarkerAlt, FaMapPin, FaPhoneAlt, FaStarHalfAlt, FaWhatsapp } from "react-icons/fa";
import { MdPhotoLibrary, MdRateReview } from "react-icons/md";

const Tab = ({ business, renderStars, setRefreshApi}) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [businessOwnerId, setBusinessOwnerId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFull, setShowFull] = useState(false);

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
  const maxChars = 500;
  const descriptionText = business.description || "";
  const isLong = descriptionText.length > maxChars;
  const preview = descriptionText.slice(0, maxChars);

  
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
      <div className="flex items-center gap-2 text-blue-800 font-semibold text-xl mb-4">
        <FaInfoCircle className="text-blue-500" />
        <h2>Overview</h2>
      </div>
        
        <p className="text-gray-700 mb-2 whitespace-pre-line">
          {!business.description || business.description.trim() === "" ? (
            <span className="text-gray-500 italic">No overview added yet.</span>
          ) : isLong && !showFull ? (
            <>
              {preview}...{" "}
              <button
                onClick={() => setShowFull(true)}
                className="text-black font-semibold underline text-sm inline"
              >
                Read more
              </button>
            </>
          ) : (
            <>
              {business.description}{" "}
              {isLong && (
                <button
                  onClick={() => setShowFull(false)}
                  className="text-black font-semibold underline text-sm inline"
                >
                  Read less
                </button>
              )}
            </>
          )}
        </p>
        <hr className="text-gray-100 mt-5"/>

        {/* Detail Section */}
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2 mt-3">
         <FaAddressBook className="text-indigo-500 text-xl mt-1" /> Business Information </h2>

         <div className=" grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 mt-4">
          {/* Phone */}
          {business.phone && (
            <a href={`tel:${business.phone}`} className="block hover:opacity-90 transition">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full text-lg">
                <FaPhoneAlt />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-800 font-semibold">{business.phone}</p>
              </div>
            </div>
          </a>
          
          )}

          {/* WhatsApp */}
          {business.wp_number && (
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-full text-lg"> <FaWhatsapp/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                <a
                  href={`https://wa.me/+91${business.wp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-semibold hover:text-green-700"
                >
                  {business.wp_number}
                </a>
              </div>
            </div>
          )}

          {/* Email */}
          {business.email && (
            <div className="flex items-center gap-4">
              <div className="bg-red-100 text-red-600 p-2 rounded-full text-lg"><FaEnvelope/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <a
                  href={`mailto:${business.email}`}
                  className="text-gray-800 font-semibold underline hover:text-red-600"
                >
                  {business.email}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {business.website && (
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full text-lg"><FaGlobe /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Website</p>
                <a
                  href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 text-sm font-semibold underline break-words hover:text-indigo-700"
                >
                  {business.website}
                </a>
              </div>
            </div>
          )}

          {/* Pincode */}
          {business.pin_code && (
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 text-gray-600 p-2 rounded-full text-lg"><FaMapPin /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pincode</p>
                <p className="text-gray-800 font-semibold">{business.pin_code}</p>
              </div>
            </div>
          )}

          {/* Landmark */}
          {business.landmark && (
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full text-lg"><FaMapMarkerAlt /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Landmark</p>
                <p className="text-gray-800 font-semibold">{business.landmark}</p>
              </div>
            </div>
          )}

          {/* Sector */}
          {business.sector && (
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-full text-lg"><FaBuilding /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sector</p>
                <p className="text-gray-800 font-semibold">{business.sector}</p>
              </div>
            </div>
          )}

          {/* Area */}
          {business.area && (
            <div className="flex items-center gap-4">
              <div className="bg-teal-100 text-teal-600 p-2 rounded-full text-lg"><FaCity /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Area</p>
                <p className="text-gray-800 font-semibold">{business.area}</p>
              </div>
            </div>
          )}
          </div>
          <hr className="text-gray-100 mt-5"/>


        {/* {business.timings?.length > 0 && (
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
            )} */}

        {/* map */}
        {business.mapLink && (
          <iframe src={business.mapLink} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" className="rounded-lg shadow"></iframe>
        )}
      </section>
      {/* <hr className="text-gray-100 mt-5"/> */}


      {/* Timing */}
      <section id="timings" className="scroll-mt-24 mb-10">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              🕒 Business Timings
            </h2>

            {business.timing ? (() => {
              let timings = [];

              try {
                timings = typeof business.timing === "string"
                  ? JSON.parse(business.timing)
                  : business.timing;
              } catch (err) {
                console.error("Failed to parse timing data", err);
                return <p className="text-red-600">Invalid timing format</p>;
              }

              return timings?.length > 0 ? (
                <ul className="text-sm md:text-base space-y-1">
            {timings.map((t, i) => {
              const isClosed = t.closed || !t.open || !t.close;
              return (
                <li key={i} className="flex items-center py-1 px-2">
                  <span className="w-32 font-medium text-gray-700">{t.day}</span>
                  <span className={isClosed ? "text-red-600 font-semibold" : "text-gray-800"}>
                    {isClosed ? "Closed" : `${t.open} - ${t.close}`}
                  </span>
                </li>
              );
            })}
          </ul>
              ) : (
                <p className="text-gray-500">No timing data available.</p>
              );
            })() : (
              <p className="text-gray-500">Timings not provided.</p>
            )}
          </section>
          <hr className="text-gray-100 mt-5"/>


      {/* Reviews */}
    <section id="reviews" className="scroll-mt-24">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
    <FaCommentDots  className="text-yellow-500 text-2xl" />
    Reviews
  </h2>

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
      <hr className="text-gray-100 mt-5"/>


      {/* Photos */}
      <section id="photos" className="scroll-mt-24">
        
      <div className="flex items-center gap-2 mb-4">
        <MdPhotoLibrary className="text-purple-500 text-2xl" />
        <h2 className="text-2xl font-semibold text-blue-900">Photos</h2>
      </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {business.images?.length > 0 ? (
            business.images.filter((img) => img) 
            .map((img, i) => (
              <div key={i} className="relative h-40 rounded-lg overflow-hidden">
                <Image src={`${CONFIG.IMAGE_BASE_URL}${img.url}`} alt={`Photo ${i + 1}`} fill className="object-cover" />
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
