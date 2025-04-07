import React from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import "./../globals.css";

export default function layout({ children }) {
    return (
        <html>
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    )
}
