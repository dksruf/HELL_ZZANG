import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'link';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ style, type = 'default', ...props }) => {
  return (
    <Text 
      style={[
        styles.text,
        type === 'link' && styles.link,
        style
      ]} 
      {...props} 
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000000',
  },
  link: {
    color: '#007AFF',
  },
});
