// helpers/phoneFormatter.js

export const phoneFormatter = (phoneNumber) => {
    // Remove any non-numeric characters except the '+' at the start
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
    // Extract groups based on the example given
    const countryCode = cleaned.slice(0, 3);       // e.g., "+91"
    const firstGroup = cleaned.slice(-4);          // Last 4 digits
    const secondGroup = cleaned.slice(-7, -4);     // Next 3 digits
    const thirdGroup = cleaned.slice(-10, -7);     // Next 3 digits
  
    // Return the formatted phone number
    return `${countryCode} ${thirdGroup} ${secondGroup} ${firstGroup}`;
  };
  