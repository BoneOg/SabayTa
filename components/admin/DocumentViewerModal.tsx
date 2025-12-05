import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface DocumentViewerModalProps {
    visible: boolean;
    onClose: () => void;
    documentUrl: string | null;
    documentTitle: string;
}

export default function DocumentViewerModal({
    visible,
    onClose,
    documentUrl,
    documentTitle
}: DocumentViewerModalProps) {
    const isPdf = documentUrl?.toLowerCase().endsWith('.pdf');

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{documentTitle}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    {documentUrl ? (
                        isPdf ? (
                            <View style={styles.pdfPlaceholder}>
                                <MaterialIcons name="picture-as-pdf" size={80} color="#F44336" />
                                <Text style={styles.pdfText}>PDF Document</Text>
                                <Text style={styles.pdfSubtext}>Tap below to view the PDF</Text>
                                <TouchableOpacity
                                    style={styles.openButton}
                                    onPress={async () => {
                                        try {
                                            await Linking.openURL(documentUrl);
                                        } catch (error) {
                                            Alert.alert('Error', 'Cannot open PDF');
                                        }
                                    }}
                                >
                                    <MaterialIcons name="open-in-new" size={20} color="#fff" />
                                    <Text style={styles.openButtonText}>Open PDF</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Image
                                source={{ uri: documentUrl }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        )
                    ) : null}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    title: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pdfPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pdfText: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
    },
    pdfSubtext: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        marginBottom: 30,
    },
    openButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#534889',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        gap: 8,
    },
    openButtonText: {
        fontFamily: 'Poppins',
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});
