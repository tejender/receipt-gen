// components/FoodOrders.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';
import { fetchMenuItems, submitOrder } from '../lib/appwrite';
import { MinusCircle, PlusCircle } from 'lucide-react-native';

interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  quantity?: number;
}

interface FoodOrdersProps {
  onClose: () => void;
  orderItems: MenuItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  bookingId: string;
}

const FoodOrders: React.FC<FoodOrdersProps> = ({ onClose, orderItems, setOrderItems,bookingId }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMenuItems = async () => {
      setIsLoading(true);
      const items = await fetchMenuItems();
      setMenuItems(items);
      setIsLoading(false);
    };
    loadMenuItems();
  }, []);

  const addItemToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find((orderItem) => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: (orderItem.quantity || 1) + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const removeItemFromOrder = (itemId: number | string) => {
    const existingItem = orderItems.find((orderItem) => orderItem.id === itemId);
    if (existingItem && existingItem.quantity && existingItem.quantity > 1) {
      setOrderItems(orderItems.map((orderItem) =>
        orderItem.id === itemId
          ? { ...orderItem, quantity: (orderItem.quantity ?? 1) - 1 }
          : orderItem
      ));
    } else {
      setOrderItems(orderItems.filter((item) => item.id !== itemId));
    }
  };

  const handleSubmitOrder = async () => {
    try {
      await submitOrder(orderItems,bookingId);
      Alert.alert("Order Submitted", "Your order has been successfully submitted!");
      setOrderItems([]); // Clear the order list after submission
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to submit the order. Please try again.");
    }
  };

  console.log(orderItems);
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={true} animationType="slide">
      <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
        <TextInput
          placeholder="Search for items"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredMenuItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <View>
                  <Text>{item.name}</Text>
                  <Text>₹ {item.price.toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => removeItemFromOrder(item.id)}>
                    <MinusCircle width={24} height={24} color={'black'} />
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 8 }}>
                    {orderItems.find((orderItem) => orderItem.id === item.id)?.quantity || 0}
                  </Text>
                  <TouchableOpacity onPress={() => addItemToOrder(item)}>
                    <PlusCircle width={24} height={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
        <TouchableOpacity onPress={handleSubmitOrder} style={{ marginTop: 20, backgroundColor: '#0000ff', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Submit Order</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
          <Text style={{ color: '#0000ff', textAlign: 'center' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FoodOrders;
