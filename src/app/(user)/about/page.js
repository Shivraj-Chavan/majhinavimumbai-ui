"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Button from "../components/form/Button";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../components/home/contactPopup";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
   const dispatch = useDispatch();
   const [authPurpose, setAuthPurpose] = useState("login");
   const [showModal, setShowModal] = useState(false);
   const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  
    useEffect(() => {
       const token = localStorage.getItem("token");
      //  if (token && !isLoggedIn) {
      //    const user = { phone: "unknown" };
      //    dispatch(login({ user, token }));
      //  }
     }, [dispatch, isLoggedIn]);
    
  
    const handleClick = () => {
      console.log("Logged In:", isLoggedIn); 
      if (isLoggedIn) {
        router.push("/businessRegister");
      } else {
        setAuthPurpose("business");
        setShowLogin(true);  
      }
    };
  
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[200px] md:h-[500px]">
       
             <Image
                src="/nmmc.png"
                alt="I Love Majhi Navi Mumbai"
                fill
                className="object-contain object-[center_-50px] w-full h-full blur-sm brightness-95"
                priority
                  />
                
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/10 backdrop-blur-sm text-white px-4 text-center">
              <Image src="/logo.png" alt="logo" width={550} height={130} />
            </div>
         
      </div>

      {/* About Us Section */}
      <div className="max-w-6xl mx-auto px-6 py-4 mb-8">
        <h1 className="text-orange-500 font-bold text-5xl italic text-center">ABOUT US</h1>
       
          <p className="text-gray-700 mt-6 leading-relaxed">
            <span className="font-bold">Navi Mumbai Local Search (Majhi Navi Mumbai)</span> is Navi Mumbai’s dedicated local
            discovery platform. Our mission is to connect users with the best businesses, services, and
            solutions available exclusively in Navi Mumbai. Whether you&apos;re looking for a service
            provider, a local store, a restaurant, or any essential service, we make discovery simple, fast,
            and reliable. We empower users to find relevant local businesses and enable smooth communication and
            transactions, all through a single, user-friendly platform available on web, mobile apps, and
            voice services.
          </p>
      </div>

      {/* Our Vision */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-500">Our Vision</h2>
        
            <p className="text-gray-700 mt-4 leading-relaxed">
              To be Navi Mumbai’s most trusted and comprehensive local search platform — helping
              users find services effortlessly and enabling local businesses to grow their digital presence.
            </p>
         
        </div>
      </div>

      {/* Our Journey */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center">Our Journey</h2>
      
          <p className="text-gray-700 mt-4 text-center leading-relaxed">
            We started with a clear vision: <span className="font-bold">To bridge the gap between customers and local businesses in Navi Mumbai.</span>
            Inspired by India’s leading platforms but focused only on Navi Mumbai, we offer tailored,
            hyperlocal search services to make everyday life easier for our users.
            Our platform is designed not just to list businesses, but to simplify interactions, bookings,
            reviews, payments, and more — all in one place.
          </p>
      
      </div>

      {/* What We Offer */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center">What We Offer...?</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800">✅ Local Business Directory</h3>
                  <p className="text-gray-700 mt-2">A vast collection of verified listings of service providers, shops, and professionals from Navi Mumbai.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800">✅ Search & Discover</h3>
                  <p className="text-gray-700 mt-2">Find businesses by category, location, rating, or service offered.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800">✅ Customer Reviews & Ratings</h3>
                  <p className="text-gray-700 mt-2">Genuine feedback from real users to help you make better decisions.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800">✅ Seamless Communication</h3>
                  <p className="text-gray-700 mt-2">Directly connect with businesses through calls, messages, or real-time chat.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800">✅ Digital Solutions</h3>
                  <p className="text-gray-700 mt-2">Free business listing, premium packages, online presence creation, and campaign promotions.</p>
                </div>
             
          </div>
        </div>
      </div>

      {/* Why Choose Us? */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-500 text-center">Why Choose Us?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">🔹 100% Navi Mumbai-Focused</h3>
                <p className="text-gray-700 mt-2">Unlike other platforms that cover the entire country we are exclusively focused on Navi Mumbai’s local market.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">🔹 Real-Time Data</h3>
                <p className="text-gray-700 mt-2">Accurate, verified, and updated listings to ensure you get the best information.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">🔹 User-Friendly Platform</h3>
                <p className="text-gray-700 mt-2">Clean, simple interface for smooth navigation and interaction.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">🔹 Business Growth Support</h3>
                <p className="text-gray-700 mt-2">We help small and medium businesses in Navi Mumbai to get discovered, gain leads, and grow their digital presence.</p>
              </div>
              <div className="flex justify-center w-full">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">🔹 Community-Driven Reviews</h3>
                  <p className="text-gray-700 mt-2">We believe in the power of local voice — our platform thrives on real reviews from Navi Mumbai residents.</p>
                </div>
              </div>
            
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-500 text-white text-center py-12 px-6">
        <h2 className="text-3xl font-bold">Join Us in Making Navi Mumbai Smarter!</h2>
        <p className="mt-2 text-lg">List your business today and connect with thousands of potential customers.</p>
        <button
          onClick={handleClick}
          className="mt-6 px-6 py-3 bg-white rounded-xl font-semibold text-green-500 shadow-md hover:bg-green-700 hover:text-white"
        >
          Get Started
        </button>
      </div>
      {showLogin && (
  <>
    <div 
      className="fixed inset-0 bg-black/60 z-[10]" 
      onClick={() => setShowLogin(false)}
    />

    {/* Modal */}
    <div className="fixed inset-0 z-[20] flex items-center justify-center">
      {/* <div className="bg-white rounded-xl shadow-2xl  max-w-md p-6"> */}
        <PopUp
          showModal={showLogin}
          setShowModal={setShowLogin}
          authPurpose={authPurpose}
        />
      {/* </div> */}
    </div>
  </>
)}


    </div>
  );
}
