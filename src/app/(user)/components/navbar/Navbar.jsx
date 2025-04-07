import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <div>Navbar
      <Link href='/' className='text-blue-600' >Home page link</Link>
    </div>
  )
}
