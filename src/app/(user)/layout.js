import React from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import "./../globals.css";
import { ReduxProvider } from '@/redux/provider';

export default function layout({ children }) {
    return (
        <html>
            <body className='bg-gray-100'>
                <ReduxProvider>
                   <Navbar />
                    {children}
                    <Footer />
                </ReduxProvider>
                
            </body>
        </html>
    )
}
