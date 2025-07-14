import React from 'react';

export default function page() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-300 via-white to-green-300 text-white py-16 px-4 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2 text-blue-800">Refund Policy</h1>
        <p className="text-lg text-blue-800 font-semibold max-w-2xl mx-auto">
          Please read this refund policy carefully before using our services.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto p-6 md:p-10 text-gray-700 leading-relaxed">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Overview</h2>
        <p className="mb-4">
          At <strong>MajhiNaviMumbai</strong>, we are committed to ensuring transparency and customer satisfaction. If a transaction is eligible for a refund, the following timelines shall apply:
        </p>

        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Minimum Refund Time:</strong> 5 business days</li>
          <li><strong>Maximum Refund Time:</strong> 10 business days</li>
        </ul>

        <p className="mb-4">
          Refunds are processed via our payment partner <strong>Razorpay</strong> and are credited back to the original source of payment (bank account, UPI, card, etc.).
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Important Notes</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Refund initiation depends on the nature of the transaction and approval process.</li>
          <li>Users will be notified via email or SMS once the refund has been initiated.</li>
          <li>In case of delays beyond 10 business days, please contact our support team at <a href="mailto:admin@majhinavimumbai.com" className="text-blue-600 underline">admin@majhinavimumbai.com</a>.</li>
        </ul>
      </div>
    </div>
  );
}
