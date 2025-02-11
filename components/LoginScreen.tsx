import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoredPin = async () => {
      const pinValue = await AsyncStorage.getItem('appPin');
      if (pinValue) {
        setStoredPin(pinValue);
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
      setError('Incorrect PIN');
    }
  };

  if (!storedPin) {
    return null; // Render nothing if no PIN is set
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter PIN</Text>
        <TextInput
          style={styles.input}
          placeholder="PIN"
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            setError('');
          }}
          secureTextEntry
          keyboardType="numeric"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default LoginScreen;
