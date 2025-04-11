import React from 'react'
import subcategoryApiData from '@/dummy/subcategories'
import Link from 'next/link'
export default function page({ params }) {

    const {category}=params
    const selectedCategory=subcategoryApiData.find(data=>data.slug==category)
  return (
    <div className='py-30'>
        <h1 className='text-2xl' >category page for  {category} </h1>
        {
            selectedCategory?.subcategories.map((data)=>{
                return  <Link href={`${category}/${data.slug}`} >{data.name} -- | </Link>
            })
        }
    </div>
  )
}
