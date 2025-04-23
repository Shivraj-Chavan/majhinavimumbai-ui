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
    // contactPerson,
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
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)*[\w-]+\.\w{2,}(\/.*)?$/;

  if (!name?.trim()) {
    return "Business name is required.";
  }

  // if (!contactPerson?.trim()) {
  //   return "Contact person is required.";
  // }

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

  if (website && !urlRegex.test(website)) {
    return "Enter a valid website URL (e.g., https://example.com).";
  }

  // if (!selectedCategory) {
  //   return "Please select a category.";
  // }

  // if (!selectedSubcategory) {
  //   return "Please select a subcategory.";
  // }

  return true;
}
