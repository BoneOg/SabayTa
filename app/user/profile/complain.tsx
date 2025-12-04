import BackButton from '@/components/ui/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const complaintTypes = [
  'Vehicle not clean',
  'Driver arrived late',
  'Unsafe driving',
  'Incorrect fare',
  'Other',
];

const ComplaintsScreen = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(complaintTypes[0]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  const isSubmitDisabled = useMemo(() => message.trim().length < 10, [message]);

  const handleSubmit = () => {
    if (isSubmitDisabled) return;
    setSuccessVisible(true);
  };

  const resetForm = () => {
    setMessage('');
    setSelectedType(complaintTypes[0]);
    setSuccessVisible(false);
    router.push('/user/home');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BackButton style={{ marginBottom: 0 }} />
          <Text style={styles.title}>Complaint</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formCard}>
          <TouchableOpacity
            style={styles.dropdown}
            activeOpacity={0.8}
            onPress={() => setDropdownVisible((prev) => !prev)}
          >
            <Text style={styles.dropdownText}>{selectedType}</Text>
            <Ionicons
              name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#494949"
            />
          </TouchableOpacity>
          {isDropdownVisible && (
            <View style={styles.dropdownList}>
              {complaintTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedType(type);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Write your complaint here (minimum 10 characters)"
            placeholderTextColor="#A0A0A0"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={[styles.submitButton, isSubmitDisabled && styles.buttonDisabled]}
            activeOpacity={0.9}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isSuccessVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSuccessVisible(false)}>
              <Ionicons name="close" size={18} color="#414141" />
            </TouchableOpacity>
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={32} color="#4C1889" />
            </View>
            <Text style={styles.modalTitle}>Send successful</Text>
            <Text style={styles.modalMessage}>
              Your complaint has been sent successfully.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={resetForm}>
              <Text style={styles.modalButtonText}>Back Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1B1F',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4D8F4',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D9C6F4',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dropdownText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#1C1B1F',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#D9C6F4',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#414141',
  },
  textArea: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#D9C6F4',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Poppins',
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#1C1B1F',
  },
  submitButton: {
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E8D7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1B1F',
    marginTop: 8,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#5F5F5F',
    fontFamily: 'Poppins',
    marginVertical: 8,
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ComplaintsScreen;

