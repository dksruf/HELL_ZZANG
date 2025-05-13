import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ 
  visible, 
  title, 
  message, 
  onClose 
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <ThemedText style={styles.alertTitle}>{title}</ThemedText>
          </View>
          <View style={styles.alertBody}>
            <ThemedText style={styles.alertMessage}>{message}</ThemedText>
          </View>
          <View style={styles.alertFooter}>
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={onClose}
            >
              <ThemedText style={styles.alertButtonText}>확인</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '80%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  alertHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertBody: {
    padding: 20,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  alertFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  alertButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  alertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 