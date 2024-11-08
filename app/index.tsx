// index.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginWithEmail, getSession } from '../lib/appwrite'; // Import login and session functions
import { useRouter } from 'expo-router';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if there's an existing session
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          router.replace('/home'); // Redirect to home if session exists
        }
      } catch (error) {
        console.log('No active session:', error);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(''); // Clear any existing error message

    try {
      await loginWithEmail(email, password);
      router.push('/home'); // Redirect to the home tab on successful login
    } catch (error) {
      // Set error message on failed login
      setErrorMessage('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Login</Text>
      
      {errorMessage ? (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
      />
      
      <TouchableOpacity 
        onPress={handleLogin}
        style={{ backgroundColor: '#3498db', padding: 15, borderRadius: 5 }}
        disabled={loading}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginPage;
