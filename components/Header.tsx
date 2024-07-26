import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StickyHeader = () => {
  return (
    <View style={styles.headerContainer} className='justify-center '>
      <Text style={styles.headerText}>Booking Receipt Generator</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFEB3B', // yellow color
   
    width: '100%',
    position: 'absolute',
    top: 28,
    zIndex: 1000,
    height:100
  },
  headerText: {
    color: '#4CAF50', // green color
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default StickyHeader;
