import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { PasswordEntry } from '../utils/storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PasswordListProps {
  passwords: PasswordEntry[];
  flippedId: number | null;
  toggleFlip: (id: number) => void;
  openEditModal: (passwordEntry: PasswordEntry) => void;
  scrollY: Animated.Value;
  handleScroll: (event: any) => void;
  indicatorSize: Animated.AnimatedInterpolation<number>;
  translateY: Animated.AnimatedInterpolation<number>;
}

const PasswordList: React.FC<PasswordListProps> = ({
  passwords,
  flippedId,
  toggleFlip,
  openEditModal,
  handleScroll,
}) => {
  const calculateRemainingDays = (passwordEntry: PasswordEntry) => {
    const createdAt = passwordEntry.createdAt;
    const validityDays = passwordEntry.validity;
    const currentDate = new Date().getTime();
    const expiryDate = createdAt + validityDays * 24 * 60 * 60 * 1000;
    return Math.ceil((expiryDate - currentDate) / (24 * 60 * 60 * 1000));
  };

  const renderItem = ({ item }: { item: PasswordEntry }) => {
    const remainingDays = calculateRemainingDays(item);
    const isExpiringSoon = remainingDays <= 5;

    return (
      <TouchableOpacity
        onPress={() => toggleFlip(item.id)}
        style={[styles.card, isExpiringSoon && styles.expiringCard]}>
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardText, isExpiringSoon && styles.expiringCardText]}>
            {flippedId === item.id ? item.password : item.description}
          </Text>
          <Text style={[styles.remainingDays, isExpiringSoon && styles.expiringDaysText]}>
            {remainingDays} days left
          </Text>
        </View>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
          <Icon name="edit" size={22} color={isExpiringSoon ? "#fff" : "#007bff"} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={passwords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  expiringCard: {
    backgroundColor: '#ff4d4d',
    borderLeftColor: '#000000',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  expiringCardText: {
    color: '#fff',
  },
  remainingDays: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  expiringDaysText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    padding: 10,
  },
});

export default PasswordList;
