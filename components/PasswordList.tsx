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

  const renderItem = ({ item }: { item: PasswordEntry }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => toggleFlip(item.id)} style={styles.card}>
        <Text style={styles.cardText}>
          {flippedId === item.id ? item.password : item.description}
        </Text>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
          <Icon name="edit" size={24} color="#E1306C" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E1306C', // Instagram logo color
  },
  cardText: {
    fontSize: 16,
    flex: 1,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});

export default PasswordList;