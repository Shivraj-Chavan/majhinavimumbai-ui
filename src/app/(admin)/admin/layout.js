// app/layout.js
"use client"
import './../../globals.css'
import { ReduxProvider } from "@/redux/provider"; 
import DashboardLayout from "./DashboardLayout/page";
import { ToastContainer } from 'react-toastify';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ToastContainer position="top-right" autoClose={3000} />
        <ReduxProvider>
          <DashboardLayout>
          {children}
          </DashboardLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
