import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Home, Calendar, Utensils, Menu, Settings,LogOut, User } from 'lucide-react-native';
import Layout from '@/components/Layout';

import { logout } from '@/lib/appwrite';

export default function TabLayout() {
  const [isMorePopupVisible, setIsMorePopupVisible] = useState(false);

  const handleMorePress = () => {
    setIsMorePopupVisible(!isMorePopupVisible);
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Log out from Appwrite
      router.replace('/'); // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navigateToProfile = () => {
    setIsMorePopupVisible(false); // Close popup
    router.push('/profile'); // Replace '/profile' with the correct path to your profile screen
  };

  return (
    <Layout>
      <Tabs
        screenOptions={{
          headerShown: false, // Ensures no header across all tabs
          tabBarStyle: {
            height: 70,
            paddingVertical: 10,
            backgroundColor: '#fff',
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#7f8c8d',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false, // Hides header on "Home" screen
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="booking"
          options={{
            headerShown: false, // Hides header on "Booking" screen
            tabBarLabel: "Booking",
            tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="restaurant"
          options={{
            headerShown: false, // Hides header on "Restaurant" screen
            tabBarLabel: "Restaurant",
            tabBarIcon: ({ color, size }) => <Utensils color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            headerShown: false, // Hides header on "More" screen
            tabBarLabel: "More",
            tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={handleMorePress} />
            ),
          }}
        />
              <Tabs.Screen
          name="profile"
          options={{
            href: null, // This will hide the tab but keep the route accessible
          }}
  />
      </Tabs>

      {/* Popup Menu for "More" Tab */}
      {isMorePopupVisible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setIsMorePopupVisible(false)}
          />

          <View style={styles.popupContainer}>
            <View style={styles.popupItemContainer}>
                <Settings size={20} style={styles.popupItem} color={'#3498db'}/>
                <TouchableOpacity onPress={() => setIsMorePopupVisible(false)}>
                <Text style={styles.popupItem}>Settings</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.popupItemContainer}>
              <User size={20} style={styles.popupItem} color={'#3498db'}/>
            <TouchableOpacity onPress={navigateToProfile}>
              <Text style={styles.popupItem}>Profile</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.popupItemContainer}>
              <LogOut size={20} style={styles.popupItem} color={'#3498db'}/>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style = {styles.popupItem}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 90,
    right: 10,
    width: 200,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  popupItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
   
    fontSize: 16,
  },
});
