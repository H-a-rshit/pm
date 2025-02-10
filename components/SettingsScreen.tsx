import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsScreenProps {
  onClose: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const fetchPinStatus = async () => {
      const storedPin = await AsyncStorage.getItem('appPin');
      setIsPinEnabled(!!storedPin);
      setIsFirstTime(!storedPin);
    };
    fetchPinStatus();
  }, []);

  const handleEnablePin = async () => {
    if (newPin !== confirmNewPin) {
      Alert.alert('Error', 'New PIN and confirmation do not match');
      return;
    }
    await AsyncStorage.setItem('appPin', newPin);
    setIsPinEnabled(true);
    setIsFirstTime(false);
    Alert.alert('Success', 'PIN protection enabled');
    onClose();
  };

  const handleDisablePin = async () => {
    await AsyncStorage.removeItem('appPin');
    setIsPinEnabled(false);
    Alert.alert('Success', 'PIN protection disabled');
    onClose();
  };

  const handleChangePin = async () => {
    const storedPin = await AsyncStorage.getItem('appPin');
    if (storedPin !== currentPin) {
      Alert.alert('Error', 'Current PIN is incorrect');
      return;
    }
    if (newPin !== confirmNewPin) {
      Alert.alert('Error', 'New PIN and confirmation do not match');
      return;
    }
    await AsyncStorage.setItem('appPin', newPin);
    Alert.alert('Success', 'PIN changed successfully');
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Enable PIN Protection</Text>
        <Switch
          value={isPinEnabled}
          onValueChange={async (value) => {
            if (value) {
              setIsFirstTime(true);
              setIsPinEnabled(true);
            } else {
              await handleDisablePin();
            }
          }}
        />
      </View>

      {isPinEnabled && (
        <View style={styles.card}>
          {!isFirstTime && (
            <TextInput
              style={styles.input}
              placeholder="Current PIN"
              value={currentPin}
              onChangeText={setCurrentPin}
              secureTextEntry
              keyboardType="numeric"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="New PIN"
            value={newPin}
            onChangeText={setNewPin}
            secureTextEntry
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New PIN"
            value={confirmNewPin}
            onChangeText={setConfirmNewPin}
            secureTextEntry
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={isFirstTime ? handleEnablePin : handleChangePin}
          >
            <Text style={styles.saveButtonText}>
              {isFirstTime ? 'Set PIN' : 'Change PIN'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsScreen;
