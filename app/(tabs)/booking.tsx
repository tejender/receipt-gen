import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, Linking } from 'react-native';
import { getCurrentUser, getUpcomingBookings } from '../../lib/appwrite';
import BookingForm from '../../components/BookingForm';
import { Calendar, HomeIcon, Phone, X, ChevronDown } from 'lucide-react-native';
import moment from 'moment';
import { convertDateToMonthName } from '../../lib/dateConverter';
import WhatsAppButton from '@/components/Widgets/WhatsappWidget';
import CallButton from '@/components/Widgets/CallWidget';

const Home: React.FC = () => {
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('No Filter');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const bookings = await getUpcomingBookings(user.$id);
          setUpcomingBookings(bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const applyFilter = (bookings:any) => {
    const today = moment();
    const filteredBookings = bookings.filter((booking:any) => {
      const checkInDate = moment(booking.checkIn);

      switch (filter) {
        case 'Today':
          return checkInDate.isSame(today, 'day');
        case 'Tomorrow':
          return checkInDate.isSame(today.clone().add(1, 'day'), 'day');
        case 'This Week':
          return checkInDate.isSame(today, 'week');
        case 'This Month':
          return checkInDate.isSame(today, 'month');
        case 'No Filter':
        default:
          return true;
      }
    });
    return filteredBookings;
  };

  const filterOptions = ['No Filter', 'Today', 'Tomorrow', 'This Week', 'This Month'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Bookings</Text>

      
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={styles.dropdownButtonText}>{filter}</Text>
          <ChevronDown color="gray" size={16} />
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdownList}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownOption}
                onPress={() => {
                  setFilter(option);
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : upcomingBookings.length > 0 ? (
        <FlatList
          data={applyFilter(upcomingBookings)}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <Text style={styles.bookingInfo}>{item.booker}</Text>

              <View style={styles.infoRow}>
                <HomeIcon color={"gray"} height={20} width={20} />
                <Text style={styles.infoText}>{item.cottage}</Text>
              </View>

              <View style={styles.infoRow}>
                <Calendar color={"gray"} height={20} width={20} />
                <Text style={styles.infoText}>
                {convertDateToMonthName(item.checkIn)} - {convertDateToMonthName(item.checkOut)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Phone color={"gray"} height={20} width={20} />
                
                  <Text style={styles.infoText}>{item.contact}</Text>
                
              </View>

              <View style={styles.buttonRow}>
                <WhatsAppButton contact={item.contact}  stylez=''>
                  <Text>Whatsapp</Text>
                </WhatsAppButton>

                <CallButton contact={item.contact} stylez=''>
                  <Text>Call</Text>
                </CallButton>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noBookingsText}>No upcoming bookings found.</Text>
      )}

     
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Booking</Text>
      </TouchableOpacity>

     
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Booking</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X height={20} width={20} color={"black"} />
              </TouchableOpacity>
            </View>

      
            <BookingForm onClose={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  dropdownButtonText: {
    color: '#555',
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 5,
    elevation: 3,
  },
  dropdownOption: {
    padding: 10,
  },
  dropdownOptionText: {
    color: '#555',
  },
  bookingCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bookingInfo: {
    fontSize: 18,
    marginVertical: 2,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 10,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noBookingsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
});

export default Home;
