import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || "my-super-secret-key";

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decrypt Error:", err);
    return null;
  }
};