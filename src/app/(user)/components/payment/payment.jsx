import { apiPost } from "@/lib/apiClient";

const RazorpayButton = ({ amount=100 }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    console.log("Creating order on backend with amount:", amount);
    const { data: order } = await apiPost("/payments/initiate", {plan:"normal", amount });
    console.log("Order created:", order);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 1000,
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      // order_id: ,
      handler: async function (response) {
        const res = await apiPost("/payments/verify", response);
        console.log("Verification response from server:", res.data);
        if (res.data.success) {
          alert("Payment Successful");
        } else {
          alert("Payment verification failed");
        }
      },
      prefill: {
        name: "Your Name",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#528FF0",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay ₹{amount}</button>;
};

export default RazorpayButton;
