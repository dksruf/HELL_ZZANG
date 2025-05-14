import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { Meal } from '../models/Meal';

interface MealCardProps {
  meal: Meal;
  onDelete: () => void;
  onEdit?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onDelete, onEdit }) => {
  return (
    <TouchableOpacity 
      style={styles.mealCard}
      onPress={onEdit}
    >
      <View style={styles.mealInfo}>
        {meal.imageUri && (
          <Image
            source={{ uri: meal.imageUri }}
            style={styles.mealImage}
          />
        )}
        <View>
          <View style={styles.mealNameContainer}>
            <ThemedText style={styles.mealName}>{meal.koreanName || meal.name}</ThemedText>
            <ThemedText style={styles.mealGrams}>{meal.grams}g</ThemedText>
          </View>
          <View style={styles.macroTags}>
            <ThemedText style={styles.macroTag}>🥩{"\n"}{meal.protein}g </ThemedText>
            <ThemedText style={styles.macroTag}>🌾{"\n"}{meal.carbs}g </ThemedText>
            <ThemedText style={styles.macroTag}>🥑{"\n"}{meal.fat}g </ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.mealRightSection}>
        <View style={styles.calorieDeleteContainer}>
          <ThemedText style={styles.mealCalories}>{meal.calories}kcal</ThemedText>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <ThemedText style={styles.deleteButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
  mealRightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  calorieDeleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}); 