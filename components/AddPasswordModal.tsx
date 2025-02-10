import React from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AddPasswordModalProps {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
  newDescription: string;
  setNewDescription: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  newValidity: string;
  setNewValidity: (text: string) => void;
  addPassword: () => void;
}

const AddPasswordModal: React.FC<AddPasswordModalProps> = ({
  showModal,
  setShowModal,
  newDescription,
  setNewDescription,
  newPassword,
  setNewPassword,
  newValidity,
  setNewValidity,
  addPassword,
}) => {
  return (
    <Modal visible={showModal} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add New Password</Text>

          <TextInput
            placeholder="Description"
            value={newDescription}
            onChangeText={setNewDescription}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Validity (days)"
            value={newValidity}
            onChangeText={setNewValidity}
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={addPassword}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPasswordModal;
