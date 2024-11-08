// components/AuthWrapper.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getSession } from '../lib/appwrite'; // Function to check session

type AuthWrapperProps = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        setIsAuthenticated(!!session); // If session exists, set to true
      } catch {
        router.replace('/'); // Redirect to login if session check fails
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthWrapper;
