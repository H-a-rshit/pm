import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Switch } from 'react-native';
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
      alert('New PIN and confirmation do not match');
      return;
    }
    await AsyncStorage.setItem('appPin', newPin);
    setIsPinEnabled(true);
    setIsFirstTime(false);
    alert('PIN protection enabled');
    onClose();
  };

  const handleDisablePin = async () => {
    await AsyncStorage.removeItem('appPin');
    setIsPinEnabled(false);
    alert('PIN protection disabled');
    onClose();
  };

  const handleChangePin = async () => {
    const storedPin = await AsyncStorage.getItem('appPin');
    if (storedPin !== currentPin) {
      alert('Current PIN is incorrect');
      return;
    }
    if (newPin !== confirmNewPin) {
      alert('New PIN and confirmation do not match');
      return;
    }
    await AsyncStorage.setItem('appPin', newPin);
    alert('PIN changed successfully');
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.switchContainer}>
        <Text>Enable PIN Protection</Text>
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
        <>
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
          <Button title={isFirstTime ? "Set PIN" : "Change PIN"} onPress={isFirstTime ? handleEnablePin : handleChangePin} />
        </>
      )}
      <Button title="Close" onPress={onClose} />
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default SettingsScreen;