import Link from 'next/link'
import React from 'react'

export default function page({ params }) {
    const {category,subcategories}=params

  return (
    <div className='py-15 bg-red-400'> 
        <Link href={`/${category}`}>Back to {category}</Link>
        <h1 className='text-2xl' >page for  Listing of all {subcategories} </h1>
    </div>
  )
}
