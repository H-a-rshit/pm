import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet, Animated } from "react-native";
import { PasswordEntry, loadPasswords, savePasswords } from './utils/storage';
import { exportPasswords, importPasswords } from './utils/fileoperations';
import PasswordList from './components/PasswordList';
import AddPasswordModal from './components/AddPasswordModal';

const App = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [flippedId, setFlippedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPasswords = async () => {
      const loadedPasswords = await loadPasswords();
      setPasswords(loadedPasswords);
    };
    fetchPasswords();
  }, []);

  useEffect(() => {
    console.log("Passwords state updated:", passwords);
  }, [passwords]);

  const addPassword = () => {
    if (newDescription && newPassword) {
      const newPasswordEntry: PasswordEntry = {
        id: passwords.length + 1,
        description: newDescription,
        password: newPassword,
      };
      const updatedPasswords = [...passwords, newPasswordEntry];
      setPasswords(updatedPasswords);
      savePasswords(updatedPasswords);
      setNewDescription("");
      setNewPassword("");
      setShowModal(false);
    }
  };

  const toggleFlip = (id: number) => {
    setFlippedId(flippedId === id ? null : id);
  };

  const scrollY = useRef(new Animated.Value(0)).current;
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const indicatorSize = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const translateY = Animated.multiply(scrollY, indicatorSize);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Add Password" onPress={() => setShowModal(true)} />
        <Button title="Export Passwords" onPress={() => exportPasswords(passwords)} />
        <Button title="Import Passwords" onPress={() => importPasswords(setPasswords, passwords)} />
      </View>
      <PasswordList
        passwords={passwords}
        flippedId={flippedId}
        toggleFlip={toggleFlip}
        scrollY={scrollY}
        handleScroll={handleScroll}
        indicatorSize={indicatorSize}
        translateY={translateY}
      />
      <AddPasswordModal
        showModal={showModal}
        setShowModal={setShowModal}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        addPassword={addPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default App;