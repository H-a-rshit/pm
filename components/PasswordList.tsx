import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { PasswordEntry } from '../utils/storage';

interface PasswordListProps {
  passwords: PasswordEntry[];
  flippedId: number | null;
  toggleFlip: (id: number) => void;
  scrollY: Animated.Value;
  handleScroll: (event: any) => void;
  indicatorSize: Animated.AnimatedInterpolation<number>;
  translateY: Animated.AnimatedInterpolation<number>;
}

const PasswordList: React.FC<PasswordListProps> = ({
  passwords,
  flippedId,
  toggleFlip,
  scrollY,
  handleScroll,
  indicatorSize,
  translateY,
}) => {
  console.log("Rendering PasswordList, passwords:", passwords);

  const renderItem = ({ item }: { item: PasswordEntry }) => (
    <TouchableOpacity onPress={() => toggleFlip(item.id)} style={styles.card}>
      <Text style={styles.cardText}>
        {flippedId === item.id ? item.password : item.description}
      </Text>
    </TouchableOpacity>
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
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E1306C', // Instagram logo color
  },
  cardText: {
    fontSize: 16,
  },
});

export default PasswordList;