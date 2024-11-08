// components/ArrivingToday.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useUser } from '@/app/context/UserContext';
import { getArrivingTodayBookings, getCheckoutTodayBookings } from '../lib/appwrite';
import { Book, Check } from 'lucide-react-native';
import { convertDateToMonthName } from '@/lib/dateConverter';
import {slugToText} from '../lib/slugToText';
import Avatar from './Avatar';
import BookingCard from './BookingCard';



const CheckoutToday: React.FC = () => {
  const { hostId } = useUser();
  const [bookings, setBookings] = useState<any[]>([]); // Use the custom Booking type


  useEffect(() => {
    const fetchBookings = async () => {
      if (hostId) {
        const bookings = await getCheckoutTodayBookings(hostId);
        setBookings(bookings);
      }
    };
    fetchBookings();
    console.log(bookings);
  }, [hostId]);
 

  return (
    <View style={styles.container}>
      
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <BookingCard item={item} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  bookingCard:{
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }
});

export default CheckoutToday;
