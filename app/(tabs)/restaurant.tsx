import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { fetchMenuItems } from '../../lib/appwrite'; // Adjust the path if needed
import { Provider, Button as PaperButton } from 'react-native-paper';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { MinusCircle, PlusCircle, Download, ShoppingCart, Trash2 } from 'lucide-react-native';

interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  quantity?: number;
}

const BillGenerator: React.FC = () => {
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const currentDate = new Date().toLocaleDateString();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loadMenuItems = async () => {
        setIsLoading(true);
        const items = await fetchMenuItems();
        setMenuItems(items);
        setIsLoading(false);
      };
      loadMenuItems();
    }, 1000);

    return () => clearTimeout(timer);
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
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePdf = async () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
              .container { background-color: #fff; padding: 20px; border-radius: 5px; width: 100%; margin: auto; text-align: center; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              .info { margin-bottom: 20px; text-align: left; }
              .table { width: 100%; border-collapse: collapse; }
              .table, .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
              .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
              .page-break { page-break-after: always; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Order Summary</h1>
              <div class="info">
                  <p><strong>Name:</strong> ${customerName}</p>
                  <p><strong>Date:</strong> ${currentDate}</p>
              </div>
              <table class="table">
                  <tr><th>Item Name</th><th>Quantity</th><th>Price</th></tr>
                  ${orderItems.map((item, index) => `
                      <tr ${index > 0 && index % 20 === 0 ? 'class="page-break"' : ''}>
                          <td>${item.name}</td>
                          <td>${item.quantity}</td>
                          <td>$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                      </tr>
                  `).join('')}
              </table>
              <div class="total">Total: $${calculateTotal().toFixed(2)}</div>
          </div>
      </body>
      </html>
    `;
  
    const file = await printToFileAsync({ html });
    await shareAsync(file.uri);
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1, padding: 20, marginTop: 20, backgroundColor: '#fff' }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading menu items...</Text>
          </View>
        ) : (
          <>
            <TextInput
              placeholder="Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
              style={{ padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
            />
            <View className='border border-gray-300 p-3 rounded-lg h-[75vh] shadow-sm shadow-gray-300 mb-4'>
              <TextInput
                placeholder="Search for items"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
                className='rounded-full shadow-2xl'
              />
              <FlatList
                data={filteredMenuItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                    <View>
                      <Text className='font-bold capitalize'>{item.name}</Text>
                      <Text className='text-gray-500 text-xs'>₹ {item.price.toFixed(2)}</Text>
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
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={generatePdf} style={{ backgroundColor: '#000', borderRadius: 30, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                <Download width={24} height={24} color={'white'} />
                <Text style={{ color: '#fff', marginLeft: 8 }}>Download Bill</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPreviewVisible(true)} style={{ backgroundColor: '#000', borderRadius: 30, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                <ShoppingCart width={24} height={24} color={'white'} />
                <Text style={{ color: '#fff', marginLeft: 8 }}>
                  {orderItems.length} Items - ₹ {calculateTotal().toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>

            <Modal visible={isPreviewVisible} transparent={true} animationType="slide">
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', width: '80%', borderRadius: 10, padding: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Order Preview</Text>
                  <ScrollView>
                    {orderItems.map((item, index) => (
                      <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                        <Text>{item.name} x{item.quantity}</Text>
                        <Text>₹ {(item.price * (item.quantity || 1)).toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => removeItemFromOrder(item.id)}>
                          <Trash2 width={20} height={20} color="red" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginVertical: 10 }}>
                    Total: ₹ {calculateTotal().toFixed(2)}
                  </Text>
                  <PaperButton onPress={() => setIsPreviewVisible(false)} mode="contained" color="black">
                    Close
                  </PaperButton>
                </View>
              </View>
            </Modal>
          </>
        )}
      </SafeAreaView>
    </Provider>
  );
};

export default BillGenerator;
