import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { PasswordEntry, savePasswords } from './storage';

export const exportPasswords = async (passwords: PasswordEntry[]) => {
  try {
    const json = JSON.stringify(passwords);
    const path = `${RNFS.DocumentDirectoryPath}/passwords.json`;
    await RNFS.writeFile(path, json, 'utf8');
    await Share.open({
      url: `file://${path}`,
      type: 'application/json',
      filename: 'passwords.json',
    });
  } catch (error) {
    console.error('Failed to export passwords', error);
  }
};

export const importPasswords = async (setPasswords: (passwords: PasswordEntry[]) => void, existingPasswords: PasswordEntry[]) => {
  try {
    console.log("Starting import process...");
    
    const res: DocumentPickerResponse[] = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });

    const fileUri = res[0].uri;
    console.log("Selected file URI:", fileUri);

    const fileContent = await RNFS.readFile(fileUri, 'utf8');
    console.log("File content read successfully:", fileContent);

    let importedPasswords: PasswordEntry[];
    try {
      importedPasswords = JSON.parse(fileContent);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      return;
    }

    console.log("Imported passwords:", importedPasswords);

    const updatedPasswords = [...existingPasswords, ...importedPasswords];
    console.log("Updated passwords:", updatedPasswords);

    setPasswords(updatedPasswords);
    savePasswords(updatedPasswords);
    console.log("Passwords state after import:", updatedPasswords);
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      console.log('User cancelled the picker');
    } else {
      console.error('Failed to import passwords', error);
    }
  }
};