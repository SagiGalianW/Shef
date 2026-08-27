// src/utils/whatsapp.ts

/**
 * Formats an Israeli phone number for WhatsApp and opens a clean chat
 */
export const getWhatsAppLink = (phone: string) => {
  if (!phone) return '#';
  
  // מנקה את המספר מכל תו שהוא לא מספר (כמו מקפים או רווחים)
  const cleanPhone = phone.replace(/\D/g, ''); 
  
  // מחליף את ה-0 בהתחלה בקידומת של ישראל (972)
  const withCountryCode = cleanPhone.startsWith('0') 
    ? `972${cleanPhone.substring(1)}` 
    : cleanPhone;

  // מחזיר נטו את הקישור לצ'אט
  return `https://wa.me/${withCountryCode}`;
};