import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, Button, StyleSheet } from 'react-native';
import { PasswordEntry } from '../utils/storage';

interface EditPasswordModalProps {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
  passwordEntry: PasswordEntry | null;
  editPassword: (id: number, description: string, password: string, validity: number) => void;
  deletePassword: (id: number) => void;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({
  showModal,
  setShowModal,
  passwordEntry,
  editPassword,
  deletePassword,
}) => {
  const [description, setDescription] = useState(passwordEntry?.description || '');
  const [password, setPassword] = useState(passwordEntry?.password || '');
  const [validity, setValidity] = useState(passwordEntry?.validity.toString() || '');

  useEffect(() => {
    if (passwordEntry) {
      setDescription(passwordEntry.description);
      setPassword(passwordEntry.password);
      setValidity(passwordEntry.validity.toString());
    }
  }, [passwordEntry]);

  const handleSave = () => {
    if (passwordEntry) {
      editPassword(passwordEntry.id, description, password, parseInt(validity));
      setShowModal(false);
    }
  };

  const handleDelete = () => {
    if (passwordEntry) {
      deletePassword(passwordEntry.id);
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
        <TextInput
          style={styles.input}
          placeholder="Validity (days)"
          value={validity}
          onChangeText={setValidity}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setShowModal(false)} />
          <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EditPasswordModal;