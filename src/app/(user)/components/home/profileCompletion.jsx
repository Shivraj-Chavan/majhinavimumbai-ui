import { useState } from "react";
import { toast } from "react-toastify";

export default function ProfileCompletionPopup({
  userId,
  initialData = {},
  onUpdated,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    // wp_number: initialData.wp_number || "",
  });
console.log({initialData})
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    // Optional Email and WhatsApp validation can go here (if needed)

    setErrors(newErrors);

    // If there are validation errors, do not submit
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await onSubmit(e, formData); // Call parent onSubmit with the form data

      // If the parent function provides onUpdated callback, call it
      if (onUpdated) onUpdated(formData);

      // Show success toast
      toast.success("Profile updated successfully!");

      // Optional: If you want to close the popup after submission
      // setShowProfileCompletion(false);  // If you have this state in the parent
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 px-4 sm:px-6 md:px-8">
  <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg relative">
    
    {/* Title */}
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-800">
      Complete Your Profile
    </h2>

    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Full Name Field */}
      <div>
        <label className="block font-medium text-sm sm:text-base">Full Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => {
            // Allow letters and spaces only
            const cleanedValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            setFormData((prev) => ({ ...prev, name: cleanedValue }));
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          className={`w-full px-3 sm:px-4 py-2 border rounded-md text-sm sm:text-base ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block font-medium text-sm sm:text-base">
          Email
        </label>
        <input
          type="email"
          name="email"
          disabled={initialData?.email}
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 sm:px-4 py-2 border rounded-md text-sm sm:text-base ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 sm:py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition text-sm sm:text-base font-medium"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  </div>
</div>
  )
}