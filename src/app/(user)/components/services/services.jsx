"use client";

import {useState } from "react";
import category from "@/dummy/category";

export default function Services () {

    const [categories, setCategories] = useState(category);

  return (
    <div className=" mx-auto px-6 py-10">

      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 mt-10 ">
        Explore our services that are useful in everyday activities:
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-7">

        {categories.map((category, index) => (
          <div key={index} className="p-6  rounded-lg shadow bg-white hover:shadow-md transition">
            <div className="flex items-center space-x-3 mb-3">
               
               <p className="text-2xl">{category.icons}</p>
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>

            </div>

            <p className="text-gray-600 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
        ))}
      </div>
    </div>
  );
};


