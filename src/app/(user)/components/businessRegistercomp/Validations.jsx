import { toast } from "react-toastify";

export default function Validations(data) {
  const {
    businessName,
    contactPerson,
    mobile,
    whatsapp,
    email,
    website,
    pincode,
    selectedCategory,
    selectedSubcategory,
  } = data;

  const phoneRegex = /^[6-9]\d{9}$/;
  const pincodeRegex = /^\d{6}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)*[\w-]+\.\w{2,}(\/.*)?$/;

  if (!businessName || !contactPerson || !mobile) {
    return "Business name, contact person, and mobile number are required.";
  }

  if (!pincodeRegex.test(pincode)) {
    return "Pincode must be exactly 6 digits.";
  }

  if (!phoneRegex.test(mobile)) {
    return "Enter a valid 10-digit mobile number.";
  }

  if (whatsapp && !phoneRegex.test(whatsapp)) {
    return "Enter a valid 10-digit WhatsApp number.";
  }

  if (email && !emailRegex.test(email)) {
    return "Enter a valid email address.";
  }

  if (website && !urlRegex.test(website)) {
    return "Enter a valid website URL (e.g., https://example.com).";
  }

  if (!selectedCategory || !selectedSubcategory) {
    return "Please select both category and subcategory.";
  }

  return true;
}
