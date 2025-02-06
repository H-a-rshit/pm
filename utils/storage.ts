import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PasswordEntry {
  id: number;
  description: string;
  password: string;
  validity: number;
  createdAt: number;
}

export const loadPasswords = async (): Promise<PasswordEntry[]> => {
  try {
    const storedPasswords = await AsyncStorage.getItem('passwords');
    if (storedPasswords) {
      return JSON.parse(storedPasswords);
    }
    return [];
  } catch (error) {
    console.error('Failed to load passwords', error);
    return [];
  }
};

export const savePasswords = async (passwords: PasswordEntry[]) => {
  try {
    await AsyncStorage.setItem('passwords', JSON.stringify(passwords));
  } catch (error) {
    console.error('Failed to save passwords', error);
  }
};