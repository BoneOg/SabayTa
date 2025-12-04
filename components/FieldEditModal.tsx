import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { KeyboardAvoidingView, KeyboardTypeOptions, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FieldEditModalProps {
    visible: boolean;
    fieldLabel: string;
    value: string;
    onChangeText: (text: string) => void;
    onClose: () => void;
    onSave: () => void;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function FieldEditModal({
    visible,
    fieldLabel,
    value,
    onChangeText,
    onClose,
    onSave,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}: FieldEditModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalKeyboardView}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{fieldLabel}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.modalInput}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={fieldLabel}
                            placeholderTextColor="#D0D0D0"
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            autoFocus
                            multiline={false}
                        />

                        <TouchableOpacity
                            style={styles.modalSaveButton}
                            onPress={onSave}
                        >
                            <Text style={styles.modalSaveButtonText}>Done</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalKeyboardView: {
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Poppins',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#414141',
        backgroundColor: '#F8F8F8',
        fontFamily: 'Poppins',
        marginBottom: 20,
    },
    modalSaveButton: {
        backgroundColor: '#534889',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
    },
    modalSaveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins',
    },
});
