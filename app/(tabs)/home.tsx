import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser, getFutureBookingCount } from '../../lib/appwrite';
import { useUser } from '../context/UserContext';

import CheckoutToday from '../../components/CheckoutToday';
import CurrentlyHosting from '@/components/CurrentlyHosting';

const Home: React.FC = () => {
  const [bookingCount, setBookingCount] = useState(0);
  const [activeTab, setActiveTab] = useState('currentlyHosting'); // Set default tab to 'currentlyHosting'
  const navigation = useNavigation();
  const {hostId, userName} = useUser();

  useEffect(() => {
    const fetchBookingCount = async () => {
      const user = await getCurrentUser();
      if (user) {
        const count = await getFutureBookingCount(user.$id);
        setBookingCount(count);
      }
    };
    fetchBookingCount();
  }, []);

  const handleBookingTabNavigation = () => {
    navigation.navigate("booking" as never);
  };

  return (
    <View style={styles.container}>
      <View className='space-y-2 mb-10'>
        <Text className="text-lg ">Welcome Back, </Text>
        <Text className="text-4xl font-medium capitalize text-gray-600">{userName} </Text>
      </View>

      <TouchableOpacity onPress={handleBookingTabNavigation} style={styles.bookingLink}>
        <Text style={styles.bookingText}>
          Upcoming Bookings : {bookingCount}
        </Text>
      </TouchableOpacity>

      {/* Tab navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'currentlyHosting' && styles.activeTab]} 
          onPress={() => setActiveTab('currentlyHosting')}
        >
          <Text style={styles.tabText}>Currently Hosting</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'checkoutToday' && styles.activeTab]} 
          onPress={() => setActiveTab('checkoutToday')}
        >
          <Text style={styles.tabText}>Checkout Today</Text>
        </TouchableOpacity>
      </View>

      {/* Render content based on active tab */}
      <View style={styles.contentContainer}>
        {activeTab === 'currentlyHosting' && <CurrentlyHosting />}
        {activeTab === 'checkoutToday' && <CheckoutToday />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookingLink: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    
  },
  bookingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight:'bold'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#F4F4F5',
    padding:10
  },
  tab: {
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'black',
    fontWeight:'bold',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
});

export default Home;
