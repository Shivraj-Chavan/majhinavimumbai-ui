import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Check, X, Star } from "lucide-react";
import { apiPost } from "@/lib/apiClient";
import { toast } from "react-toastify";

export default function PricingPlans({ show, onClose, business }) {
  const [selectedPlan, setSelectedPlan] = useState("");
  console.log({business})
  
  // if (!show) return null;

  const plans = [
    {
      id: "1",
      name: "Free",
      price: "₹0",
      period: "Forever",
      visibility: "1x",
      photos: "2",
      mnmVerifiedSeal: false,
      premiumSupport: true,
      discountOnAds: false,
      smartLeadSystem: true,
      color: "saffron",
      popular: false,
      description: "Get started free",
    },
    {
      id: "2",
      name: "Silver",
      price: "₹100",
      period: "/year",
      visibility: "1x",
      photos: "5",
      mnmVerifiedSeal: true,
      premiumSupport: true,
      discountOnAds: false,
      smartLeadSystem: true,
      color: "white",
      popular: false,
      description: "For small business",
    },
    {
      id: "3",
      name: "Gold",
      price: "₹500",
      period: "/year",
      visibility: "3x",
      photos: "10",
      mnmVerifiedSeal: true,
      premiumSupport: true,
      discountOnAds: "5%",
      smartLeadSystem: true,
      color: "green",
      popular: false,
      description: "Most popular",
    },
    {
      id: "4",
      name: "Platinum",
      price: "₹1000",
      period: "/year",
      visibility: "24x Top",
      photos: "20",
      mnmVerifiedSeal: true,
      premiumSupport: true,
      discountOnAds: "10%",
      smartLeadSystem: true,
      color: "saffron",
      popular: true,
      description: "Maximum exposure",
    },
  ];

  // const handlePlanSelect = async (plan) => {
  //   if (!plan?.id) {
  //     toast.error("Plan ID is missing.");
  //     console.error("Plan ID is missing.");
  //     return;
  //   }

  //   if (!business?.id) {
  //     toast.error("Business ID is missing.");
  //     console.error("Business ID is missing.");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       business_id: business.id,
  //       plan_id: plan.id,
  //       plan_price: plan.price.replace("₹", ""),
  //     };

  //     const res = await apiPost("/plan/select", payload);
  //     console.log("Plan selection payload:", payload);
  //     console.log("Response:", res);
  //     toast.success(`${plan.name} plan activated successfully!`);
  //     setSelectedPlan(plan.id);
  //   } catch (err) {
  //     console.error("Error selecting plan:", err);
  //     toast.error("Something went wrong while activating the plan.");
  //   }
  // };
  const handlePlanSelect = async (plan) => {
    console.log({plan})
    if (!plan?.price || !plan?.name) {
      toast.error("Plan info missing.");
      return;
    }
  
    try {
      const amount = parseInt(plan.price.replace("₹", ""));
      const planName = plan.name.toLowerCase();
  
      const res = await apiPost("/payments/initiate", {
        amount,
        plan: planName,
        plan_id: plan?.id,
        business_id: business?.id,
      });
      console.log('Payments',)
  
      const data = res;
      if (!data.key) {
        // toast.error("Razorpay key missing");
        return;
      }
      if (!data.success) {
        // toast.error("Order creation failed");
        return;
      }

      // FREE PLAN — skip Razorpay entirely
    if (amount === 0) {
      toast.success("Free plan activated!");
      setSelectedPlan(plan.id);
      if (typeof onPlanActivated === "function") {
        onPlanActivated(); // trigger refetch
      }
      return;
    }

       // PAID PLAN — proceed with Razorpay
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "MajhiNaviMumbai",
        description: `${plan.name} Plan`,
        order_id: data.transactionId,
        
        handler: async function (response) {
          console.log("Payment success response:", response);
          const verifyData = await apiPost("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            business_id:  business?.id,
            plan_id:plan?.id,
            amount
          });
          console.log("VERIFY API HIT", verifyData);
          // if (!data.key) {
          //   toast.error("Razorpay key missing");
          //   return;
          // }          
  
          if (verifyData.success) {
            toast.success("Payment successful!");
            setSelectedPlan(plan.id);

            if (typeof onPlanActivated === "function") {
              onPlanActivated(); // trigger refetch
            }
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: business.name,
          email: business.email,
          contact: business.phone,
        },
        theme: { color: "#3399cc" },
      };
  
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      toast.error("Something went wrong.");
    }finally{
      onClose()
    }
  };
  

useEffect(() => {
  if (!show) return;
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
}, [show]);

  const getCardStyle = (color) => {
    const base = "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]";
    switch (color) {
      case "saffron":
        return `${base} border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100`;
      case "white":
        return `${base} border-gray-200 bg-gradient-to-br from-white to-gray-50`;
      case "green":
        return `${base} border-green-400 bg-gradient-to-br from-green-50 to-green-100`;
      default:
        return `${base} border-gray-200 bg-white`;
    }
  };

  const getButtonStyle = (color) => {
    switch (color) {
      case "saffron":
        return "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-95";
      case "white":
        return "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 active:scale-95";
      case "green":
        return "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-95";
      default:
        return "bg-gray-600 hover:bg-gray-700 active:scale-95";
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex justify-center items-center p-2 lg:p-4">
      <div className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 p-3 lg:p-6 rounded-t-xl z-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 lg:top-4 lg:right-4 text-gray-500 hover:text-red-500 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <RxCross2 className="text-lg lg:text-xl" />
          </button>
          <div className="text-center pr-6">
            <h2 className="text-xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-gray-800 to-green-600 bg-clip-text text-transparent mb-1">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 text-xs lg:text-lg hidden lg:block">
              Select the perfect plan for your business
            </p>
          </div>
        </div>

        {/* Desktop Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 ${getCardStyle(plan.color)} ${
                  plan.popular ? "ring-2 ring-green-500 ring-offset-2" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 text-sm text-gray-700">
                  <div className="flex justify-between"><span>Visibility</span><span>{plan.visibility}</span></div>
                  <div className="flex justify-between"><span>Photos</span><span>{plan.photos}</span></div>
                  <div className="flex justify-between"><span>Verified Seal</span>{plan.mnmVerifiedSeal ? <Check className="text-green-600 w-4 h-4" /> : <X className="text-red-500 w-4 h-4" />}</div>
                  <div className="flex justify-between"><span>Premium Support</span>{plan.premiumSupport ? <Check className="text-green-600 w-4 h-4" /> : <X className="text-red-500 w-4 h-4" />}</div>
                  <div className="flex justify-between"><span>Discount on Ads</span>{plan.discountOnAds ? <span className="text-green-600">{plan.discountOnAds}</span> : <X className="text-red-500 w-4 h-4" />}</div>
                  <div className="flex justify-between"><span>Smart Lead System</span>{plan.smartLeadSystem ? <Check className="text-green-600 w-4 h-4" /> : <X className="text-red-500 w-4 h-4" />}</div>
                </div>

                <button
                type="button" 
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg ${getButtonStyle(plan.color)}`}
                >
                  {plan.price === "₹0" ? "Start Free" : "Choose Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 lg:p-6 text-center border-t border-gray-100">
          <p className="text-gray-600 text-xs lg:text-sm mb-3">
            All plans include core features. Upgrade anytime.
          </p>
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-500 text-xs ml-2">Proudly Indian</span>
          </div>
        </div>
      </div>
    </div>
  );
}
