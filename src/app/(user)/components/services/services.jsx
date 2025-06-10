"use client";

import { useEffect, useState } from "react";
import category from "@/dummy/category";

// Skeleton loader for categories
const CategorySkeleton = () => (
  <div className="p-6 rounded-lg shadow bg-white animate-pulse space-y-3">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 rounded w-full" />
      <div className="h-3 bg-gray-300 rounded w-5/6" />
      <div className="h-3 bg-gray-300 rounded w-4/6" />
      <div className="h-3 bg-gray-300 rounded w-3/6" />
    </div>
  </div>
);

export default function Services() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(category);
      setLoading(false);
    }, 1500); // simulate 1.5s loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto px-6 py-10 max-w-7xl">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 mt-10">
        Explore our services that are useful in everyday activities:
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-7">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          : categories.map((category, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow bg-white hover:shadow-md transition"
              >
                <div className="flex items-center space-x-0 mb-3">
                  <p className="text-2xl">{category.icons}</p>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
