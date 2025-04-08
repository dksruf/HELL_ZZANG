import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { CircularProgress } from './CircularProgress';
import { Macro } from '../models/Macro';

interface MacroProgressProps {
  macro: Macro;
}

export const MacroProgress: React.FC<MacroProgressProps> = ({ macro }) => {
  const percentage = macro.getPercentage();
  const remaining = macro.total - macro.current;

  return (
    <View style={styles.macroItem}>
      <View style={styles.macroCircleContainer}>
        <CircularProgress
          percentage={percentage}
          size={70}
          strokeWidth={8}
          color={macro.color}
        />
        <View style={styles.macroValueContainer}>
          <ThemedText style={styles.macroName}>{macro.name}</ThemedText>
          <ThemedText style={styles.macroCurrent}>{macro.current}g</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.macroValue}>
        {remaining < 0 ? Math.abs(remaining) : remaining}g {remaining < 0 ? 'over' : 'left'}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  macroItem: {
    alignItems: 'center',
    width: '30%',
  },
  macroCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroValueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  macroCurrent: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  macroValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },
}); 