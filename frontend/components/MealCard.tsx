import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { Meal } from '../models/Meal';

interface MealCardProps {
  meal: Meal;
  onDelete?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onDelete }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <View style={styles.mealCard}>
      <View style={styles.mealInfo}>
        <View style={styles.mealImageContainer}>
          {meal.imageUri ? (
            <Image 
              source={{ uri: meal.imageUri }} 
              style={styles.mealImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.mealImagePlaceholder} />
          )}
          <View style={styles.mealNameContainer}>
            <View style={styles.nameAndCalories}>
              <View style={styles.nameAndGrams}>
                <ThemedText style={styles.mealName} numberOfLines={2}>{meal.name}</ThemedText>
                <ThemedText style={styles.mealGrams}>({meal.grams}g)</ThemedText>
              </View>
              <View style={styles.calorieTimeContainer}>
                <ThemedText style={styles.mealCalories}>{meal.calculateActualCalories()} kcal</ThemedText>
                <ThemedText style={styles.mealTime}>{meal.time}</ThemedText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.mealDetails}>
          <View style={styles.macroTags}>
            <ThemedText style={styles.macroTag}>🥩 {meal.calculateActualProtein().toFixed(1)}g</ThemedText>
            <ThemedText style={styles.macroTag}>🌾 {meal.calculateActualCarbs().toFixed(1)}g</ThemedText>
            <ThemedText style={styles.macroTag}>🥑 {meal.calculateActualFat().toFixed(1)}g</ThemedText>
          </View>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <ThemedText style={styles.deleteButtonText}>✕</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mealCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  mealInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  mealImageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    width: '100%',
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  mealDetails: {
    width: '100%',
  },
  mealImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E9ECEF',
    borderRadius: 10,
  },
  mealNameContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    flex: 1,
  },
  nameAndCalories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: 8,
  },
  calorieTimeContainer: {
    alignItems: 'flex-end',
  },
  nameAndGrams: {
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  mealGrams: {
    fontSize: 12,
    color: '#666',
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  macroTags: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
    width: '100%',
  },
  macroTag: {
    fontSize: 12,
    color: '#000',
    flex: 1,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#666',
  },
}); 