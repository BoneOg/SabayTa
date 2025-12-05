import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StudentVerification() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [studentIdImage, setStudentIdImage] = useState<string | null>(null);
    const [corImage, setCorImage] = useState<string | null>(null);

    const pickImage = async (setImage: (uri: string) => void) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!studentIdImage || !corImage) {
            Alert.alert('Error', 'Please upload both Student ID and COR.');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'Not authenticated');
                return;
            }

            // Create form data
            const formData = new FormData();

            // Append images
            const idFilename = studentIdImage.split('/').pop();
            const idMatch = /\.(\w+)$/.exec(idFilename || '');
            const idType = idMatch ? `image/${idMatch[1]}` : 'image/jpeg';

            const corFilename = corImage.split('/').pop();
            const corMatch = /\.(\w+)$/.exec(corFilename || '');
            const corType = corMatch ? `image/${corMatch[1]}` : 'image/jpeg';

            formData.append('schoolId', { uri: studentIdImage, name: idFilename, type: idType } as any);
            formData.append('cor', { uri: corImage, name: corFilename, type: corType } as any);

            // In a real app, you would upload this to your backend
            // For now, we'll simulate a successful upload or use a placeholder endpoint if available
            // const response = await fetch(`${BASE_URL}/api/profile/verify-student`, {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'multipart/form-data',
            //     },
            //     body: formData,
            // });

            // Simulation
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert('Success', 'Documents submitted for verification!');
            router.back();

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to submit documents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Student Verification</Text>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.description}>
                    Please upload your Student ID and Certificate of Registration (COR) to verify your student status.
                </Text>

                <View style={styles.uploadSection}>
                    <Text style={styles.label}>Student ID</Text>
                    <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setStudentIdImage)}>
                        {studentIdImage ? (
                            <Image source={{ uri: studentIdImage }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholder}>
                                <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
                                <Text style={styles.placeholderText}>Tap to upload Student ID</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.uploadSection}>
                    <Text style={styles.label}>Certificate of Registration (COR)</Text>
                    <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setCorImage)}>
                        {corImage ? (
                            <Image source={{ uri: corImage }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholder}>
                                <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
                                <Text style={styles.placeholderText}>Tap to upload COR</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Documents</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        elevation: 2,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        fontFamily: 'Poppins',
        lineHeight: 20,
    },
    uploadSection: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'Poppins',
    },
    uploadBox: {
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        color: '#999',
        fontFamily: 'Poppins',
    },
    submitButton: {
        backgroundColor: '#534889',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        elevation: 2,
    },
    disabledButton: {
        backgroundColor: '#9fa8da',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
});
