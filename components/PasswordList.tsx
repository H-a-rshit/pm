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
  scrollY,
  handleScroll,
  indicatorSize,
  translateY,
}) => {
  console.log("Rendering PasswordList, passwords:", passwords);

  const calculateRemainingDays = (passwordEntry: PasswordEntry) => {
    const createdAt = passwordEntry.createdAt;
    const validityDays = passwordEntry.validity;
    const currentDate = new Date().getTime();
    const expiryDate = createdAt + validityDays * 24 * 60 * 60 * 1000;
    const remainingDays = Math.ceil((expiryDate - currentDate) / (24 * 60 * 60 * 1000));
    return remainingDays;
  };

  const renderItem = ({ item }: { item: PasswordEntry }) => {
    const remainingDays = calculateRemainingDays(item);
    const isExpiringSoon = remainingDays <= 5;

    return (
      <View style={[styles.cardContainer, isExpiringSoon && styles.expiringCardContainer]}>
        <TouchableOpacity onPress={() => toggleFlip(item.id)} style={[styles.card, isExpiringSoon && styles.expiringCard]}>
          <Text style={[styles.cardText, isExpiringSoon && styles.expiringCardText]}>
            {flippedId === item.id ? item.password : item.description}
          </Text>
          <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
            <Icon name="edit" size={24} color={isExpiringSoon ? "#fff" : "#E1306C"} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
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
  },
  listContent: {
    paddingBottom: 80, // Ensure space for the button
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  expiringCardContainer: {
    backgroundColor: 'black',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E1306C', // Instagram logo color
  },
  expiringCard: {
    backgroundColor: 'black',
  },
  cardText: {
    fontSize: 16,
    flex: 1,
  },
  expiringCardText: {
    color: 'white',
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});

export default PasswordList;