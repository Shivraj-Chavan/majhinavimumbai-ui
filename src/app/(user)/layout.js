"use client"
import React from 'react'
import Footer from './components/footer/Footer'
import "./../globals.css";
import { ReduxProvider } from '@/redux/provider';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '@/redux/slice/categoriesSlice';
import { ToastContainer } from 'react-toastify';
import Navbarnew from  '@/app/(user)/components/navbar/Navbarnew';
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
export default function layout({ children }) {

    return (
        <html>
            <body className='bg-gray-100'>
                     <ToastContainer position="top-right" autoClose={3000} />
                <ReduxProvider>
                   {/* <Navbar /> */}
                   <Navbarnew/>
                    {children}
                    <Footer />
                </ReduxProvider>
                
            </body>
        </html>
    )
}
