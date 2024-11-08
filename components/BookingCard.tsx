// components/BookingCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../app/navigation/RootStaclNavigationList';
import Avatar from './Avatar';
import { slugToText } from '../lib/slugToText';
import { convertDateToMonthName } from '../lib/dateConverter';
import WhatsAppButton from './Widgets/WhatsappWidget';
import CallButton from './Widgets/CallWidget';
import { ChevronRight, MessageCircle } from 'lucide-react-native';

interface Booking {
  $id: string;
  booker: string;
  cottage: string;
  checkIn: string;
  checkOut: string;
  contact: string;
}

interface BookingCardProps {
  item: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ item }) => {
  // Define navigation prop with types
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigateToDetails = () => {
    navigation.navigate('BookingDetail', { booking: item });
  };

  return (
    <View style={styles.bookingCard} className="gap-y-[1px]">
      <View className="flex flex-row items-center justify-between">
        <View style={styles.headerContainer}>
          <Avatar name={item.booker} />
          <View>
            <Text style={styles.title}>{item.booker}</Text>
            <Text style={styles.cottageText}>{slugToText(item.cottage)}</Text>
          </View>
        </View>

        {/* Navigate to Booking Details on Chevron click */}
        <TouchableOpacity onPress={handleNavigateToDetails}>
          <ChevronRight height={20} width={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex flex-row pt-2 items-center">
        <Text style={styles.dateText}>{convertDateToMonthName(item.checkOut)}</Text>
        <Text> - </Text>
        <Text style={styles.dateText}>{convertDateToMonthName(item.checkIn)}</Text>
      </View>

      <View className="flex flex-row gap-3">
        <WhatsAppButton contact={item.contact} stylez="border w-[95px] p-2 rounded-md">
          <MessageCircle height={15} width={15} color="black" />
          <Text className="text-xs text-black">WhatsApp</Text>
        </WhatsAppButton>
        <CallButton contact={item.contact} stylez="border w-[60px] p-2 rounded-md">
          <MessageCircle height={15} width={15} color="black" />
          <Text className="text-xs text-black">Call</Text>
        </CallButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookingCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cottageText: {
    color: 'gray',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'gray',
  },
});

export default BookingCard;
