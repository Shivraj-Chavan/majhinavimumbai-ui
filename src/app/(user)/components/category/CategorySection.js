"use client"
import Link from 'next/link';
import React from 'react'
import category from '@/dummy/category';
export default function CategorySection() {
  return (
    <div className='py-30'>CategorySection 
        {
            category?.map((data)=>{
                return <Link href={data.slug} >{data.name} -- | </Link>
            })
        }
    </div>
  )
}
