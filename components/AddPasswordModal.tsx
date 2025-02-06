import React from 'react';
import { View, TextInput, Modal, Button, StyleSheet } from 'react-native';

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
    <Modal visible={showModal} animationType="slide">
      <View style={styles.modalContent}>
        <TextInput
          placeholder="Description"
          value={newDescription}
          onChangeText={setNewDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Validity (days)"
          value={newValidity}
          onChangeText={setNewValidity}
          style={styles.input}
          keyboardType="numeric"
        />
        <View style={styles.modalButtons}>
          <Button title="Cancel" onPress={() => setShowModal(false)} />
          <Button title="Add" onPress={addPassword} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddPasswordModal;