import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet, Animated, TextInput, TouchableOpacity, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PasswordEntry, loadPasswords, savePasswords } from './utils/storage';
import { exportPasswords, importPasswords } from './utils/fileoperations';
import PasswordList from './components/PasswordList';
import AddPasswordModal from './components/AddPasswordModal';
import EditPasswordModal from './components/EditPasswordModal';
import LoginScreen from './components/LoginScreen';
import SettingsScreen from './components/SettingsScreen';

const App = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newValidity, setNewValidity] = useState("");
  const [editPasswordEntry, setEditPasswordEntry] = useState<PasswordEntry | null>(null);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

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

  useEffect(() => {
    const updateValidityDays = () => {
      const updatedPasswords = passwords.map(passwordEntry => {
        const createdAt = passwordEntry.createdAt;
        const validityDays = passwordEntry.validity;
        const currentDate = new Date().getTime();
        const expiryDate = createdAt + validityDays * 24 * 60 * 60 * 1000;
        const remainingDays = Math.ceil((expiryDate - currentDate) / (24 * 60 * 60 * 1000));
        return { ...passwordEntry, validity: remainingDays };
      });
      setPasswords(updatedPasswords);
      savePasswords(updatedPasswords);
    };

    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeToMidnight = midnight.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      updateValidityDays();
      setInterval(updateValidityDays, 24 * 60 * 60 * 1000); // Update every 24 hours
    }, timeToMidnight);

    return () => clearTimeout(timeoutId);
  }, [passwords]);

  const addPassword = () => {
    if (newDescription && newPassword && newValidity) {
      const newPasswordEntry: PasswordEntry = {
        id: passwords.length > 0 ? passwords[passwords.length - 1].id + 1 : 1,
        description: newDescription,
        password: newPassword,
        validity: parseInt(newValidity),
        createdAt: new Date().getTime(),
      };
      const updatedPasswords = [...passwords, newPasswordEntry];
      setPasswords(updatedPasswords);
      savePasswords(updatedPasswords);
      setNewDescription("");
      setNewPassword("");
      setNewValidity("");
      setShowAddModal(false);
    }
  };

  const editPassword = (id: number, description: string, password: string, validity: number) => {
    const updatedPasswords = passwords.map(passwordEntry =>
      passwordEntry.id === id ? { ...passwordEntry, description, password, validity } : passwordEntry
    );
    setPasswords(updatedPasswords);
    savePasswords(updatedPasswords);
    setShowEditModal(false);
  };

  const deletePassword = (id: number) => {
    const updatedPasswords = passwords.filter(passwordEntry => passwordEntry.id !== id);
    setPasswords(updatedPasswords);
    savePasswords(updatedPasswords);
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

  useEffect(() => {
    const checkAuthentication = async () => {
      const pin = await AsyncStorage.getItem('appPin');
      if (!pin) {
        setIsAuthenticated(true); // No PIN set, proceed to the app
      }
    };
    checkAuthentication();
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettingsModal(true)}>
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
        newValidity={newValidity}
        setNewValidity={setNewValidity}
        addPassword={addPassword}
      />
      {editPasswordEntry && (
        <EditPasswordModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          passwordEntry={editPasswordEntry}
          editPassword={editPassword}
          deletePassword={deletePassword}
        />
      )}
      {showSettingsModal && (
        <SettingsScreen onClose={() => setShowSettingsModal(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  settingsButton: {
    backgroundColor: 'orange',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default App;