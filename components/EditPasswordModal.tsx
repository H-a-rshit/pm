import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
    <Modal visible={showModal} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Edit Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Validity (days)"
            value={validity}
            onChangeText={setValidity}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditPasswordModal;
