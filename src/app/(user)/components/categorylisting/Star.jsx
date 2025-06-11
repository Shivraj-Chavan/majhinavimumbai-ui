"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Star({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="w-full text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex justify-center items-center gap-2">
        <FaStar className="text-yellow-400" /> Start your Review
      </h3>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-3xl transition-transform  cursor-pointer duration-200 ${
              (hover || rating) >= star
                ? "text-yellow-400 scale-110"
                : "text-gray-300 hover:text-yellow-300 hover:scale-105"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <FaStar />
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {rating > 0
          ? `You rated ${rating} star${rating > 1 ? "s" : ""}`
          : "Click a star to rate"}
      </p>
    </div>
  );
}
