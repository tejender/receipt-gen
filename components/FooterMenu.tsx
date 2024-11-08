import React from 'react';
import { Home, Calendar, Utensils, Menu } from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

const FooterMenu = () => {
  const menuItems = [
    {
      id: 1,
      title: 'Home',
      icon: <Home className="w-6 h-6" />,
    },
    {
      id: 2,
      title: 'Booking',
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      id: 3,
      title: 'Restaurant',
      icon: <Utensils className="w-6 h-6" />,
    },
    {
      id: 4,
      title: 'More',
      icon: <Menu className="w-6 h-6" />,
    },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <View className="flex flex-row justify-around items-center h-16">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-1 flex-col items-center justify-center p-2 active:bg-gray-100"
          >
            <View className=''>

            {item.icon}
            </View>
            <Text className="text-xs mt-1 text-gray-600">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FooterMenu;