// components/Layout.tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';

import AuthWrapper from './Authwrapper';
import { UserProvider } from '@/app/context/UserContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthWrapper>
      <UserProvider>

        <View style={styles.container}>
        <Toast />

          {children}
        
        </View>

      </UserProvider>
    </AuthWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    marginTop:30,
   
  },
});

export default Layout;
