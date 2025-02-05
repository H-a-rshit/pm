import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet, Animated, TextInput } from "react-native";
import { PasswordEntry, loadPasswords, savePasswords } from './utils/storage';
import { exportPasswords, importPasswords } from './utils/fileoperations';
import PasswordList from './components/PasswordList';
import AddPasswordModal from './components/AddPasswordModal';
import EditPasswordModal from './components/EditPasswordModal';

const App = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editPasswordEntry, setEditPasswordEntry] = useState<PasswordEntry | null>(null);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPasswords = async () => {
      const loadedPasswords = await loadPasswords();
      setPasswords(loadedPasswords);
      setFilteredPasswords(loadedPasswords);
    };
    fetchPasswords();
  }, []);

  useEffect(() => {
    console.log("Passwords state updated:", passwords);
  }, [passwords]);

  useEffect(() => {
    const filtered = passwords.filter(password =>
      password.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPasswords(filtered);
  }, [searchQuery, passwords]);

  const addPassword = () => {
    if (newDescription && newPassword) {
      const newPasswordEntry: PasswordEntry = {
        id: passwords.length > 0 ? passwords[passwords.length - 1].id + 1 : 1,
        description: newDescription,
        password: newPassword,
      };
      const updatedPasswords = [...passwords, newPasswordEntry];
      setPasswords(updatedPasswords);
      savePasswords(updatedPasswords);
      setNewDescription("");
      setNewPassword("");
      setShowAddModal(false);
    }
  };

  const editPassword = (id: number, description: string, password: string) => {
    const updatedPasswords = passwords.map(passwordEntry =>
      passwordEntry.id === id ? { ...passwordEntry, description, password } : passwordEntry
    );
    setPasswords(updatedPasswords);
    savePasswords(updatedPasswords);
    setShowEditModal(false);
  };

  const toggleFlip = (id: number) => {
    setFlippedId(flippedId === id ? null : id);
  };

  const openEditModal = (passwordEntry: PasswordEntry) => {
    setEditPasswordEntry(passwordEntry);
    setShowEditModal(true);
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
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Password" onPress={() => setShowAddModal(true)} />
        <Button title="Export Passwords" onPress={() => exportPasswords(passwords)} />
        <Button title="Import Passwords" onPress={() => importPasswords(setPasswords, passwords)} />
      </View>
      <PasswordList
        passwords={filteredPasswords}
        flippedId={flippedId}
        toggleFlip={toggleFlip}
        openEditModal={openEditModal}
        scrollY={scrollY}
        handleScroll={handleScroll}
        indicatorSize={indicatorSize}
        translateY={translateY}
      />
      <AddPasswordModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        addPassword={addPassword}
      />
      {editPasswordEntry && (
        <EditPasswordModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          passwordEntry={editPasswordEntry}
          editPassword={editPassword}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default App;