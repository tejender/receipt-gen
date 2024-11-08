// components/CallButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';

interface CallButtonProps {
  contact: string;  // The phone number to call
  children: React.ReactNode; // The text to display inside the button
  stylez:string
}

const CallButton: React.FC<CallButtonProps> = ({ contact, children, stylez }) => {
  const handlePress = () => {
    const callUrl = `tel:${contact}`;
    Linking.openURL(callUrl).catch(() =>
      console.warn("Unable to make a call or the number is incorrect")
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}  className={`${stylez} flex flex-row items-center  justify-between`}>
     {children}
    </TouchableOpacity>
  );
};


export default CallButton;
