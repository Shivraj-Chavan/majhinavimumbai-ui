// "use client";

// import { useState, useEffect, useCallback } from "react";
// import EditBusinessPopup from "@/app/(user)/components/profileComp/EditBusinessPopup";
// import PopUp from "../components/home/popUp";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { FcFinePrint } from "react-icons/fc";
// import { apiGet, apiPut } from "@/lib/apiClient";
// import { GrEdit } from "react-icons/gr";
// import { toast } from "react-toastify";
// import Image from "next/image";
// // import PricingPlans from "../components/profileComp/PricingPlans";
// import { ImCross } from "react-icons/im";
// import { HiMiniStar } from "react-icons/hi2";
// import { TbTargetArrow } from "react-icons/tb";
// import CONFIG from "@/constance";
// // import { BiSolidSelectMultiple } from "react-icons/bi";

// export default function MyBusinessPage() {
//   const [businesses, setBusinesses] = useState([]); 
//   const [businessToEdit, setBusinessToEdit] = useState(null);
//   const [token, setToken] = useState(null);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showPopup, setShowPopup] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [showPricingPopup, setShowPricingPopup] = useState(false);
//   const [userBusiness, setUserBusiness] = useState(null);
//   // const [plans, setPlans] = useState([]);
//   const [businessList, setBusinessList] = useState([]);
//   // const [selectedPlans, setSelectedPlans] = useState({});
//   const router = useRouter();
  
//   // This comes after all your useState declarations
// const fetchBusiness = useCallback(async () => {
//   try {
//     const res = await apiGet(`/businesses/user`);
//     console.log("businesses:", res);
//     setBusinessList(res || []);

//     if (res.businesses) {
//       setBusinesses(res.businesses);
//       //next_phase
//       // await fetchSelectedPlans(res.businesses);
//     } else {
//       console.warn("Unexpected response format:", res);
//       setBusinesses([]);
//     }
//   } catch (err) {
//     console.error("Failed to load businesses:", err);
//   } finally {
//     setLoading(false);
//   }
// }, []);


// // For selected plan   next_phase 
// // const fetchSelectedPlans = useCallback(async (businessList) => {
// //   if (!Array.isArray(businessList)) {
// //     console.error("businessList is undefined or not an array:", businessList);
// //     return;
// //   } 

// //   const planMap = {};

// //   await Promise.all(
// //     businessList.map(async (biz) => {
// //       try {
// //         const res = await apiGet(`/plan/selectedplan/${biz.id}`);
// //         console.log('selectedplan', res);

// //         if (res && res.name) {
// //           planMap[biz.id] = res; // store by business id
// //         }
// //       } catch (err) {
// //         console.warn(`No plan found for business ${biz.id}`, err);
// //       }
// //     })
// //   );

// //   setSelectedPlans(planMap);  
// // }, []); 


// //next_phase
// // useEffect(() => {
// //   if (businessList && Array.isArray(businessList)) {
// //     fetchSelectedPlans(businessList);
// //   } else {
// //     console.warn("businessList not ready yet:", businessList);
// //   }
// // }, [businessList]);

// useEffect(() => {
//   const storedToken = localStorage.getItem("token");
//   setToken(storedToken);

//   if (!storedToken) {
//     router.push("/");
//     return;
//   }

//   setIsAuthenticated(true);
//   fetchBusiness();
//   // fetchSelectedPlans();
// }, [fetchBusiness]);


//   if (!isAuthenticated) {
//     console.log("Rendering popup...");
//     return <>{showPopup && <PopUp onClose={() => setShowPopup(false)} />}</>;
//   }

//   const handleLoginSuccess = () => {
//     const newToken = localStorage.getItem("token");
//     if (newToken) {
//       setToken(newToken);
//     }
//   };

//   const handleSubmit = async (updatedBusinessData) => {
//     try {
//       const res = await apiPut(`/businesses/${businessToEdit.id}`, updatedBusinessData);
//       console.log("Updating Business", res);

//       if (res.business) {
//         handleUpdate(res.business); 
//       } else {
//         alert("Update succeeded, but response format is unexpected.");
//       }
//     } catch (error) {
//       console.error("Update failed", error);
//       toast.error("Failed to update business info.");
//     }
//   };

//   const handleUpdate = (updatedData) => {
//     setBusinesses((prev) =>
//       prev.map((b) => b.id === updatedData.id ? { ...b, ...updatedData, is_verified: b.is_verified }: b));
//     setShowEditPopup(false);
//     setBusinessToEdit(null);
//   };
  
//   if (!token) return <PopUp onClose={handleLoginSuccess} />;

//   // Skeleton
//   const renderSkeletons = () => {
//     return Array.from({ length: 6 }).map((_, i) => (
//       <div key={i} className="bg-white rounded-2xl shadow-lg p-6 space-y-6 animate-pulse flex flex-col justify-between">
//         <div className="flex flex-col items-center text-center space-y-4">
//           <div className="w-32 h-32 bg-gray-200 rounded-full shadow-md" />
//           <div className="space-y-2">
//             <div className="h-5 bg-gray-200 rounded w-40 mx-auto" />
//             <div className="h-3 bg-gray-100 rounded w-52 mx-auto" />
//           </div>
//           <div className="h-6 w-24 bg-gray-100 rounded-full mx-auto" />
//         </div>
//         <hr className="border-gray-100" />
//         <div className="flex justify-center gap-3">
//           <div className="h-9 w-24 bg-gray-200 rounded-lg" />
//           <div className="h-9 w-20 bg-gray-200 rounded-lg" />
//         </div>
//       </div>
//     ));
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
//       <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
//         My Business Profiles
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {loading ? (
//           renderSkeletons()
//         ) : businesses.length === 0 ? (
//           <p className="text-center col-span-full text-gray-500">
//            You have not added any Business Yet !!
//           </p>
//         ) : (
//           businesses.map((business) => {
//             // next_phase
//             // const planDetails = selectedPlans[business.id]; 
//             // console.log("Plan Details for", business.id, planDetails);
//             console.log({business})
//             return (
//             <div
//               key={business.id}
//               className="bg-white rounded-2xl shadow-lg p-6 space-y-6 flex flex-col justify-between"
//             >
//               <div className="flex flex-col items-center text-center space-y-4">
//                 <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden shadow-md">
//                   <Image
//                    src={business?.images?.length>0 ? `${CONFIG.IMAGE_BASE_URL}${business?.images[0].url}`   :"/image.png"}
//                     alt="Business Logo"
//                     width={128} 
//                     height={128}
//                     className="object-contain w-full h-full"
//                   />
//                 </div>

//                 <div>
//                   <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//                     {business.name}
//                   </h2>
//                   {/* <div className="text-gray-600 text-sm mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: business.description || "<p>No description provided.</p>",}}/> */}
//                 </div>

//                 <div>
//                     {(() => {
//                       console.log("Businesses:", business);
//                       console.log("Verification Status:", business.is_verified);

//                       return business.is_verified? (
//                         <span className="text-green-600 font-semibold text-sm bg-green-100 px-4 py-1.5 rounded-full border border-green-300">
//                           Verified
//                         </span>
//                       ) : (
//                         <span className="text-red-600 font-semibold text-sm bg-red-100 px-4 py-1.5 rounded-full border border-red-300">
//                           Unverified
//                         </span>
//                       );
//                     })()}
//                   </div>

//                    {/*SHOW SELECTED PLAN */}
//                    {/* next_phase */}
//                     {/* {planDetails ? (
//                       <div>
//                         <p className="text-md text-green-600 font-semibold">
//                           {planDetails.name}
//                         </p>
//                         <div className="text-sm text-gray-500 mt-1">
//                         <p className="flex gap-1">
//                         Active from {new Date(planDetails.start_date).toLocaleDateString('en-GB')} to {new Date(planDetails.end_date).toLocaleDateString('en-GB')}
//                       </p>
//                        </div>
//                       </div>
//                     ) : (
//                       <p className="flex items-center text-sm gap-2 text-slate-400">
//                      Please choose plan for this Business
//                      </p>
//                     )} */}
//                  </div>

//               <hr className="border-gray-200" />

//               <div className="flex justify-center gap-3">
//                 <Link href={`/listinginfo/${business.slug}`}>
//                   <button className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm shadow flex items-center">
//                     <FcFinePrint className="text-xl mr-1" />
//                     View Details
//                   </button>
//                 </Link>

//                 <button
//                   onClick={() => {
//                     setBusinessToEdit(business);
//                     setShowEditPopup(true);
//                   }}
//                   className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex items-center px-2 py-2 rounded-lg text-sm shadow"
//                 >
//                   <GrEdit className="text-md mr-1" /> Edit
//                 </button>

//                  {/*Choose Plan button if no completed plan next_phase*/}
               
//                 {/* {planDetails ? (
//                   planDetails.name.toLowerCase() === "free" ? (
//                     <button
//                       onClick={() => {
//                         setUserBusiness(business);
//                         setShowPricingPopup(true);
//                       }}
//                       className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm shadow"
//                     >
//                       Upgrade Plan
//                     </button>
//                   ) : (
//                     // <button
//                     //   className="bg-gray-400 cursor-not-allowed px-4 py-2 rounded-lg text-sm shadow text-white"
//                     //   disabled
//                     // >
//                     //   Choose Plan
//                     // </button>
//                     <></>
//                   )
//                 ) : (
//                   <button
//                     onClick={() => {
//                       setUserBusiness(business);
//                       setShowPricingPopup(true);
//                     }}
//                     className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
//                   >
//                     Choose Plan
//                   </button>
//                 )} */}

//       {/* after choose plan switch to Upgrade */}
//         {/* {planDetails ? (
//           <button 
//             onClick={() => {
//               setUserBusiness(business);
//               setShowPricingPopup(true);
//             }}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow"
//           >
//             Upgrade Plan
//           </button>
//         ) : (
//           <button
//             onClick={() => {
//               setUserBusiness(business);
//               setShowPricingPopup(true);
//             }}
//             className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
//           >
//             Choose Plan
//           </button>
//         )} */}
//               </div>
//             </div>
//             )
//       })
//         )}
//       </div>

//       {/* Edit Popup */}
//       {showEditPopup && businessToEdit && (
//         <EditBusinessPopup business={businessToEdit} 
//         // plan={selectedPlans[businessToEdit?.id]}
//           onClose={() => { setShowEditPopup(false); setBusinessToEdit(null);}} onSave={handleSubmit}/>
//       )}

//       {/* Payment popup next_phase */}
//       {/* {showPricingPopup && (
//         <PricingPlans show={showPricingPopup} onClose={() => setShowPricingPopup(false)} business={userBusiness} onPlanActivated={fetchBusiness} setSelectedPlans={setSelectedPlans}/>
//       )} */}
//     </div>
//   );
// }


















"use client";

import { useState, useEffect, useCallback } from "react";
import EditBusinessPopup from "@/app/(user)/components/profileComp/EditBusinessPopup";
import PopUp from "../components/home/popUp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcFinePrint } from "react-icons/fc";
import { apiGet, apiPut } from "@/lib/apiClient";
import { GrEdit } from "react-icons/gr";
import { toast } from "react-toastify";
import Image from "next/image";
import { ImCross } from "react-icons/im";
import { HiMiniStar } from "react-icons/hi2";
import { TbTargetArrow } from "react-icons/tb";
import CONFIG from "@/constance";

export default function MyBusinessPage() {
  const [businesses, setBusinesses] = useState([]);
  const [businessToEdit, setBusinessToEdit] = useState(null);
  const [token, setToken] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [userBusiness, setUserBusiness] = useState(null);
  const [businessList, setBusinessList] = useState([]);
  const router = useRouter();

  const fetchBusiness = useCallback(async () => {
    try {
      const res = await apiGet(`/businesses/user`);
      console.log("businesses:", res);
      setBusinessList(res || []);
      if (res.businesses) {
        setBusinesses(res.businesses);
      } else {
        console.warn("Unexpected response format:", res);
        setBusinesses([]);
      }
    } catch (err) {
      console.error("Failed to load businesses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      router.push("/");
      return;
    }
    setIsAuthenticated(true);
    fetchBusiness();
  }, [fetchBusiness]);

  if (!isAuthenticated) {
    return <>{showPopup && <PopUp onClose={() => setShowPopup(false)} />}</>;
  }

  const handleLoginSuccess = () => {
    const newToken = localStorage.getItem("token");
    if (newToken) setToken(newToken);
  };

  const handleSubmit = async (updatedBusinessData) => {
    try {
      const res = await apiPut(`/businesses/${businessToEdit.id}`, updatedBusinessData);
      if (res.business) {
        handleUpdate(res.business);
      } else {
        alert("Update succeeded, but response format is unexpected.");
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update business info.");
    }
  };

  const handleUpdate = (updatedData) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === updatedData.id ? { ...b, ...updatedData, is_verified: b.is_verified } : b
      )
    );
    setShowEditPopup(false);
    setBusinessToEdit(null);
  };

  if (!token) return <PopUp onClose={handleLoginSuccess} />;

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-4 animate-pulse"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 rounded-lg flex-1" />
          <div className="h-9 bg-gray-100 rounded-lg w-16" />
        </div>
      </div>
    ));

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              My Business Profiles
            </h1>
          </div>
          {!loading && businesses.length > 0 && (
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              {businesses.length} {businesses.length === 1 ? "business" : "businesses"}
            </span>
          )}
        </div>
        <div className="mt-4 h-px bg-gradient-to-r from-orange-200 via-gray-200 to-transparent" />
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          renderSkeletons()
        ) : businesses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl">
              🏢
            </div>
            <p className="text-gray-700 font-semibold text-lg">No businesses yet</p>
            <p className="text-gray-400 text-sm">You haven't added any business profiles.</p>
          </div>
        ) : (
          businesses.map((business) => {
            console.log({ business });
            return (
              <div
                key={business.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                {/* Card Top — orange accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-orange-500" />

                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Business identity row */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm">
                      <Image
                        src={
                          business?.images?.length > 0
                            ? `${CONFIG.IMAGE_BASE_URL}${business?.images[0].url}`
                            : "/image.png"
                        }
                        alt="Business Logo"
                        width={56}
                        height={56}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Name + badge */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-gray-800 truncate leading-snug">
                        {business.name}
                      </h2>
                      <div className="mt-1.5">
                        {business.is_verified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100" />

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/listinginfo/${business.slug}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm">
                        <FcFinePrint className="text-base shrink-0" />
                        View Details
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        setBusinessToEdit(business);
                        setShowEditPopup(true);
                      }}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors duration-150 shadow-sm shrink-0"
                    >
                      <GrEdit className="text-sm" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Popup */}
      {showEditPopup && businessToEdit && (
        <EditBusinessPopup
          business={businessToEdit}
          onClose={() => {
            setShowEditPopup(false);
            setBusinessToEdit(null);
          }}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
}