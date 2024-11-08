import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Helper function to extract initials from the name
const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  return initials;
};

// Helper function to generate random colors
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);  // Random hue between 0 and 360
  const saturation = Math.floor(Math.random() * 41) + 50;  // Saturation between 50% and 90%
  const lightness = Math.floor(Math.random() * 41) + 30;  // Lightness between 30% and 70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;  // Return the HSL color
};

// Avatar component
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 50 }) => {
  const initials = getInitials(name);
  const backgroundColor = getRandomColor(); // Get random background color

  return (
    <View
      style={[
        styles.avatarContainer,
        { backgroundColor, width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size / 2 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Avatar;
