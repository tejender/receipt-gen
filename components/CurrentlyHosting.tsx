// components/ArrivingToday.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useUser } from '@/app/context/UserContext';
import { getCurrentlyHostingBookings } from '../lib/appwrite';
import BookingCard from './BookingCard';



const CurrentlyHosting: React.FC = () => {
  const { hostId } = useUser();
  const [bookings, setBookings] = useState<any[]>([]); // Use the custom Booking type


  useEffect(() => {
    const fetchBookings = async () => {
      if (hostId) {
        const bookings = await getCurrentlyHostingBookings(hostId);
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
});

export default CurrentlyHosting;
