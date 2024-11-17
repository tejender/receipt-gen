  // screens/BookingDetails.tsx
  import React, { useEffect, useState } from 'react';
  import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
  import { RouteProp, useRoute } from '@react-navigation/native';
  import { getBookingDetail } from '@/lib/appwrite';
  import { BadgeIndianRupee, Calendar, CircleDashed, Eye, HandCoins, Home, Phone, Plus, Users } from 'lucide-react-native';
  import { convertDateToMonthName } from '@/lib/dateConverter';
  import { slugToText } from '@/lib/slugToText';
  import FoodOrders from '@/components/FoodOrders';
  import OrderDetails from '@/components/OrderDetail';

  type BookingDetailsRouteProp = RouteProp<{ BookingDetails: { booking: any } }, 'BookingDetails'>;

  const BookingDetail: React.FC = () => {
    const route = useRoute<BookingDetailsRouteProp>();
    const { booking } = route.params;

    const [bookingDetails, setBookingDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [isFoodOrdersVisible, setIsFoodOrdersVisible] = useState(false);
    const [isOrderVisible, setIsOrderVisible] = useState(false);

    useEffect(() => {
      const fetchBookingDetails = async () => {
        try {
          const details = await getBookingDetail(booking.$id);
          setBookingDetails(details);
        } catch (err) {
          setError('Failed to fetch booking details');
        } finally {
          setLoading(false);
        }
      };
      fetchBookingDetails();
    }, [booking.$id]);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Text style={styles.header}>Customer Information</Text>
          <View style={styles.infoContainer}>
            <Users height={20} width={20} color={'gray'} />
            <Text style={styles.infoText}>{booking.booker}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Phone height={20} width={20} color={'gray'} />
            <Text style={styles.infoText}>{booking.contact}</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.header}>Accommodation</Text>
          <View style={styles.infoContainer}>
            <Home height={20} width={20} color={'gray'} />
            <Text style={styles.infoText}>{slugToText(booking.cottage)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Calendar height={20} width={20} color={'gray'} />
            <Text style={styles.infoText}>
              {convertDateToMonthName(booking.checkIn)} - {convertDateToMonthName(booking.checkOut)}
            </Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.header}>Payment Details</Text>
          <View style={styles.infoContainer}>
            <BadgeIndianRupee height={20} width={20} color={'gray'} />
            <Text style={styles.infoText}>Total Amount: ₹ {booking.totalAmount}</Text>
          </View>
          <View style={styles.infoContainer}>
            <HandCoins height={20} width={20} color={'gray'} />
            <Text style={styles.infoText}>Paid Amount: ₹ {booking.tokenMoney}</Text>
          </View>
          <View style={styles.infoContainer}>
            <CircleDashed height={20} width={20} color={'gray'} />
            <Text style={styles.infoText}>Pending Amount: ₹ {booking.pendingAmount}</Text>
          </View>
        </View>

        <View style={styles.cardContainer} className='space-y-2'>
          <Text style={styles.header}>Food Orders</Text>
          <View className='flex flex-row justify-between'>

            <TouchableOpacity onPress={() => setIsOrderVisible(true)} 
            className='w-[48%] flex flex-row bg-wihte border border-gray-400 gap-x-3 justify-center items-center rounded-lg p-3'>
              <Eye height={20} width={20} color={'black'} />
              <Text className='text-black font-bold'>View Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFoodOrdersVisible(true)}
            className=' w-[48%] flex flex-row bg-black gap-x-3 justify-center items-center rounded-lg p-3'>
              <Plus height={20} width={20} color={'white'} />
              <Text className='text-white font-bold'>Add Order</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modals */}
        {isFoodOrdersVisible && (
          <FoodOrders onClose={() => setIsFoodOrdersVisible(false)} orderItems={orderItems} setOrderItems={setOrderItems} 
          bookingId={booking.$id}/>
        )}
        <OrderDetails isVisible={isOrderVisible} onClose={() => setIsOrderVisible(false)} bookingId={booking.$id} bookingDetails={bookingDetails} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f8f8f8', flex: 1 },
    cardContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginVertical: 10 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    infoContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
    infoText: { marginLeft: 10, fontSize: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    button: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#ccc', borderRadius: 5, marginTop: 10 },
    buttonText: { marginLeft: 5, color: '#000' },
  });

  export default BookingDetail;
