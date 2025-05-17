"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { FcOldTimeCamera } from 'react-icons/fc';

export default function Tab({ business, renderStars }) {
  const sections = ["overview", "detail", "reviews", "photos"];

  return (
    <div className="space-y-10 scroll-smooth">
      {/* Tab Buttons */}
      <div className="flex gap-6 border-b mb-4">
        {sections.map((item) => (
          <a
            key={item}
            href={`#${item}`}
            className="pb-2 capitalize text-gray-600 hover:text-blue-700 font-medium transition"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Overview Section */}
      <section id="overview" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">Overview</h2>
        <p className="text-gray-700 mb-4">{business.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-gray-700 mb-6">
          {business.phone && <p><strong>Phone:</strong> {business.phone}</p>}
          {business.wp_number && <p><strong>WhatsApp:</strong> {business.wp_number}</p>}
          {business.email && <p><strong>Email:</strong> {business.email}</p>}
          {business.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={business.website}
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
          <iframe
            src={business.mapLink}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-lg shadow"
          ></iframe>
        )}
      </section>

      {/* Menu Section */}
      <section id="menu" className="scroll-mt-24">
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

      {/* Reviews Section */}
      <section id="reviews" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Reviews</h2>
        <div className="space-y-4">
          {business.reviewsList?.length > 0 ? (
            business.reviewsList.map((review, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{review.user}</span>
                  <div className="flex gap-1 text-yellow-500">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </section>

      {/* Photos Section */}
      <section id="photos" className="scroll-mt-24">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-900">Photos</h2>
          <button className="bg-orange-400 flex gap-2 text-white text-md px-4 py-2 rounded-full font-semibold hover:bg-orange-500 transition">
            <FcOldTimeCamera className="text-xl" />
            <span>Add Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {business.images?.length > 0 ? (
            business.images.map((img, i) => (
              <div key={i} className="relative h-40 rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No images available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
