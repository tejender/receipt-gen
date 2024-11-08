import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { NativeWindStyleSheet } from "nativewind";
import { Calendar, Home, Menu, MoreHorizontal, MoreVerticalIcon, Utensils } from 'lucide-react-native';

// Import your screens explicitly if needed
import BookingDetail from './BookingDetail'; 
import Layout from '@/components/Layout';
import { TouchableOpacity } from 'react-native';

NativeWindStyleSheet.setOutput({
  default: "native",
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Define your tab layout as the root screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Booking details and other screens for deeper navigation */}
      <Stack.Screen name="BookingDetail"  options={{ headerShown: true, title: 'Booking Details' }} />
  
      

    
    </Stack>
  );
}
