export default function Validations(data) {
  const {
    owner_id,
    name,
    pin_code,
    block,
    street,
    landmark,
    sector,
    area,
    phone,
    wp_number,
    email,
    website,
    timing,
    selectedCategory,
    selectedSubcategory,
  } = data;

  const phoneRegex = /^[6-9]\d{9}$/;
  const pincodeRegex = /^\d{6}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name?.trim()) {
    return "Business name is required.";
  }

  if (!phone?.trim()) {
    return "Mobile number is required.";
  }

  if (!pincodeRegex.test(pin_code)) {
    return "Pincode must be exactly 6 digits.";
  }

  if (!phoneRegex.test(phone)) {
    return "Enter a valid 10-digit mobile number.";
  }

  if (wp_number && !phoneRegex.test(wp_number)) {
    return "Enter a valid 10-digit WhatsApp number.";
  }

  if (email && !emailRegex.test(email)) {
    return "Enter a valid email address.";
  }


  return true;
}
