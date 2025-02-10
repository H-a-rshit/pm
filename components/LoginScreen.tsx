import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState('');

  useEffect(() => {
    const fetchStoredPin = async () => {
      const pin = await AsyncStorage.getItem('appPin');
      if (pin) {
        setStoredPin(pin);
      } else {
        onLogin(); // No PIN set, proceed to the app
      }
    };
    fetchStoredPin();
  }, []);

  const handleLogin = () => {
    if (pin === storedPin) {
      onLogin();
    } else {
      alert('Incorrect PIN');
    }
  };

  if (!storedPin) {
    return null; // Render nothing if no PIN is set
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;