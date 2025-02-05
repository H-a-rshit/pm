// filepath: components/EditPasswordModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Button, StyleSheet } from 'react-native';
import { PasswordEntry } from '../utils/storage';

interface EditPasswordModalProps {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
  passwordEntry: PasswordEntry | null;
  editPassword: (id: number, description: string, password: string) => void;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({
  showModal,
  setShowModal,
  passwordEntry,
  editPassword,
}) => {
  const [description, setDescription] = useState(passwordEntry?.description || '');
  const [password, setPassword] = useState(passwordEntry?.password || '');

  useEffect(() => {
    if (passwordEntry) {
      setDescription(passwordEntry.description);
      setPassword(passwordEntry.password);
    }
  }, [passwordEntry]);

  const handleSave = () => {
    if (passwordEntry) {
      editPassword(passwordEntry.id, description, password);
      setShowModal(false);
    }
  };

  return (
    <Modal visible={showModal} animationType="slide">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={() => setShowModal(false)} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default EditPasswordModal;