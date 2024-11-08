import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { getOrdersByBookingId, deleteOrderById } from '../lib/appwrite'; // Import deleteOrderById function
import { Delete, LucideTrash2, Trash } from 'lucide-react-native';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetailsProps {
  isVisible: boolean;
  onClose: () => void;
  bookingId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ isVisible, onClose, bookingId }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      setIsLoading(true);
      try {
        const items = await getOrdersByBookingId(bookingId);
        setOrderItems(items);
      } catch (error) {
        Alert.alert('Error', 'Failed to load order items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) fetchOrderItems();
  }, [isVisible]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderById(orderId); // Call the function to delete the order from the database
      setOrderItems((prevItems) => prevItems.filter(item => item.id !== orderId)); // Update the local list
      Alert.alert('Success', 'Order item deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete order item. Please try again.');
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Order Details</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : orderItems.length > 0 ? (
            <>
              <FlatList
                data={orderItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <View style={styles.itemTextContainer}>
                      <Text>{item.name}</Text>
                      <Text>₹{item.price.toFixed(2)} x {item.quantity}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteOrder(item.id)}
                      style={styles.deleteButton}
                    >
                      <LucideTrash2 height={20} width={20} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Order Total:</Text>
                <Text style={styles.totalAmount}>₹{calculateTotal().toFixed(2)}</Text>
              </View>
            </>
          ) : (
            <Text>No order items found.</Text>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  itemTextContainer: {
    flex: 1,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#ff0000',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0000ff',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OrderDetails;
