import React from 'react'
import subcategoryApiData from '@/dummy/subcategories'
import Link from 'next/link'
import Image from 'next/image'

export default function Page({ params }) {
  const { category } = params
  const selectedCategory = subcategoryApiData.find(data => data.slug === category)

  if (!selectedCategory) {
    return (
      <div className="text-center text-red-500 font-semibold text-lg py-20">
        Category not found.
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 max-w-7xl mx-auto">
      
      {/* Hero Image */}
      <div className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-md mb-10">
        <Image
          src={`/assests/categories/${selectedCategory.slug}.jpg`}
          alt={selectedCategory.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center px-4">
            {selectedCategory.name}
          </h1>
        </div>
      </div>

      {/* Subcategory Section */}
      <h2 className="text-xl sm:text-2xl font-semibold uppercase text-orange-500 text-center mb-8 tracking-wide">
        Explore Subcategories
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
        {selectedCategory?.subcategories.map((data) => (
          <Link key={data.slug} href={`/${category}/${data.slug}`}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-2 group cursor-pointer">
              <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2">
                <Image
                  src={`/assests/category/${category}/${data.slug}.jpg`}
                  alt={data.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm text-center text-orange-600 group-hover:text-orange-500 transition-colors font-medium truncate">
                {data.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
