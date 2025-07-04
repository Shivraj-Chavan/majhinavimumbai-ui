"use client"
import React from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import "./../globals.css";
import { ReduxProvider } from '@/redux/provider';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '@/redux/slice/categoriesSlice';
import { ToastContainer } from 'react-toastify';

export default function layout({ children }) {

    return (
        <html>
            <body className='bg-gray-100'>
                     <ToastContainer position="top-right" autoClose={3000} />
                <ReduxProvider>
                   <Navbar />
                    {children}
                    <Footer />
                </ReduxProvider>
                
            </body>
        </html>
    )
}
