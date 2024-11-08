// components/WhatsAppButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';

interface WhatsAppButtonProps {
  contact: string;  // The phone number for WhatsApp contact
  children: React.ReactNode; // The text to display inside the button
  stylez:string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ contact, children,stylez }) => {
  const handlePress = () => {
    const whatsappUrl = `whatsapp://send?phone=${contact}`;
    Linking.openURL(whatsappUrl).catch(() =>
      console.warn("WhatsApp is not installed or URL is incorrect")
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} className={`${stylez} flex flex-row items-center  justify-between`}>
      {children}
    </TouchableOpacity>
  );
};



export default WhatsAppButton;
