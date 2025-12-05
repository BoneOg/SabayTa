import ProfileHeader from '@/components/ProfileHeader';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../../config';

export default function ApplyAsDriver() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [existingApplication, setExistingApplication] = useState<any>(null);
    const [plateNumber, setPlateNumber] = useState('');
    const [motorcycleModel, setMotorcycleModel] = useState('');
    const [driversLicenseFile, setDriversLicenseFile] = useState<{ uri: string; type: string; name: string } | null>(null);
    const [vehicleORCRFile, setVehicleORCRFile] = useState<{ uri: string; type: string; name: string } | null>(null);

    useEffect(() => {
        checkApplicationStatus();
    }, []);

    const checkApplicationStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/driver-application/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.hasApplication) {
                    setExistingApplication(data.application);
                }
            }
        } catch (error) {
            console.error('Error checking application status:', error);
        } finally {
            setCheckingStatus(false);
        }
    };

    const pickFile = async (setFile: (file: { uri: string; type: string; name: string }) => void) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true
            });

            if (!result.canceled && result.assets[0]) {
                const { uri, mimeType, name } = result.assets[0];
                setFile({
                    uri,
                    type: mimeType || 'application/pdf',
                    name: name || 'document'
                });
            }
        } catch (error) {
            console.error('Error picking file:', error);
        }
    };

    const handleSubmit = async () => {
        if (!plateNumber || !motorcycleModel) {
            Alert.alert('Error', 'Please fill in plate number and motorcycle model.');
            return;
        }

        if (!driversLicenseFile || !vehicleORCRFile) {
            Alert.alert('Error', 'Please upload both Driver\'s License and Vehicle OR/CR.');
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('plateNumber', plateNumber);
            formData.append('motorcycleModel', motorcycleModel);

            formData.append('driversLicense', {
                uri: Platform.OS === 'ios' ? driversLicenseFile.uri.replace('file://', '') : driversLicenseFile.uri,
                type: driversLicenseFile.type,
                name: driversLicenseFile.name,
            } as any);

            formData.append('vehicleORCR', {
                uri: Platform.OS === 'ios' ? vehicleORCRFile.uri.replace('file://', '') : vehicleORCRFile.uri,
                type: vehicleORCRFile.type,
                name: vehicleORCRFile.name,
            } as any);

            const response = await fetch(`${BASE_URL}/api/driver-application/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Response text:', text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON parse error. Response was:', text);
                Alert.alert('Error', 'Server error. Please check if backend is running.');
                setLoading(false);
                return;
            }

            if (response.ok) {
                Alert.alert('Success', 'Driver application submitted successfully!', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error', data.message || 'Failed to submit application');
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <View style={styles.container}>
                <ProfileHeader onBack={() => router.back()} title="Apply as Driver" />
                <ActivityIndicator size="large" color="#534889" style={{ marginTop: 50 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ProfileHeader onBack={() => router.back()} title="Apply as Driver" />

            {existingApplication ? (
                <ScrollView style={styles.content}>
                    <View style={[styles.infoCard, {
                        backgroundColor: existingApplication.applicationStatus === 'pending' ? '#E8E0F5' :
                            existingApplication.applicationStatus === 'approved' ? '#D4E8D4' : '#F5E0E8'
                    }]}>
                        <MaterialIcons
                            name={existingApplication.applicationStatus === 'pending' ? 'schedule' :
                                existingApplication.applicationStatus === 'approved' ? 'check-circle' : 'cancel'}
                            size={48}
                            color={existingApplication.applicationStatus === 'pending' ? '#534889' :
                                existingApplication.applicationStatus === 'approved' ? '#4CAF50' : '#E91E63'}
                        />
                        <Text style={[styles.infoTitle, {
                            color: existingApplication.applicationStatus === 'pending' ? '#534889' :
                                existingApplication.applicationStatus === 'approved' ? '#4CAF50' : '#E91E63'
                        }]}>
                            {existingApplication.applicationStatus === 'pending' ? 'Application Pending' :
                                existingApplication.applicationStatus === 'approved' ? 'Application Approved!' :
                                    'Application Rejected'}
                        </Text>
                        <Text style={styles.infoMessage}>
                            {existingApplication.applicationStatus === 'pending' ?
                                'Your driver application is currently under review by our admin team.' :
                                existingApplication.applicationStatus === 'approved' ?
                                    'Congratulations! Your driver application has been approved. Please log out and log back in to access driver features.' :
                                    'Unfortunately, your driver application was not approved. Please contact support for more information.'}
                        </Text>

                        <View style={styles.applicationDetails}>
                            <Text style={styles.detailLabel}>Motorcycle Model:</Text>
                            <Text style={styles.detailValue}>{existingApplication.motorcycleModel}</Text>
                        </View>

                        <View style={styles.applicationDetails}>
                            <Text style={styles.detailLabel}>Plate Number:</Text>
                            <Text style={styles.detailValue}>{existingApplication.plateNumber}</Text>
                        </View>

                        <View style={styles.applicationDetails}>
                            <Text style={styles.detailLabel}>Submitted:</Text>
                            <Text style={styles.detailValue}>
                                {new Date(existingApplication.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <ScrollView style={styles.content}>
                    <Text style={styles.description}>
                        Please fill in your vehicle details and upload the required documents to apply as a driver.
                    </Text>

                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Plate Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your motorcycle plate number"
                            placeholderTextColor="#999"
                            value={plateNumber}
                            onChangeText={setPlateNumber}
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Motorcycle Model</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Honda Click 150i, Yamaha Mio"
                            placeholderTextColor="#999"
                            value={motorcycleModel}
                            onChangeText={setMotorcycleModel}
                        />
                    </View>

                    <View style={styles.uploadSection}>
                        <Text style={styles.label}>Driver's License</Text>
                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={() => pickFile(setDriversLicenseFile)}
                        >
                            {driversLicenseFile ? (
                                driversLicenseFile.type.startsWith('image/') ? (
                                    <Image source={{ uri: driversLicenseFile.uri }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.uploadContent}>
                                        <MaterialIcons name="picture-as-pdf" size={48} color="#534889" />
                                        <Text style={styles.fileName}>{driversLicenseFile.name}</Text>
                                    </View>
                                )
                            ) : (
                                <View style={styles.placeholder}>
                                    <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
                                    <Text style={styles.placeholderText}>Tap to upload Driver's License</Text>
                                    <Text style={styles.fileTypeText}>PDF or Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.uploadSection}>
                        <Text style={styles.label}>Vehicle OR/CR</Text>
                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={() => pickFile(setVehicleORCRFile)}
                        >
                            {vehicleORCRFile ? (
                                vehicleORCRFile.type.startsWith('image/') ? (
                                    <Image source={{ uri: vehicleORCRFile.uri }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.uploadContent}>
                                        <MaterialIcons name="picture-as-pdf" size={48} color="#534889" />
                                        <Text style={styles.fileName}>{vehicleORCRFile.name}</Text>
                                    </View>
                                )
                            ) : (
                                <View style={styles.placeholder}>
                                    <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
                                    <Text style={styles.placeholderText}>Tap to upload Vehicle OR/CR</Text>
                                    <Text style={styles.fileTypeText}>PDF or Image</Text>
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
                            <Text style={styles.submitButtonText}>Submit Application</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 20 : 20,
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
    inputSection: {
        marginBottom: 20,
    },
    infoCard: {
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    infoTitle: {
        fontFamily: 'Poppins',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    infoMessage: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    applicationDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    detailLabel: {
        fontFamily: 'Poppins',
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    detailValue: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'Poppins',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        fontFamily: 'Poppins',
        color: '#333',
    },
    uploadSection: {
        marginBottom: 25,
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
    uploadContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    uploadText: {
        marginTop: 12,
        fontSize: 15,
        color: '#666',
        fontFamily: 'Poppins',
        fontWeight: '500',
    },
    uploadSubtext: {
        marginTop: 5,
        fontSize: 12,
        color: '#bbb',
        fontFamily: 'Poppins',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    fileName: {
        marginTop: 10,
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        fontFamily: 'Poppins',
        fontSize: 15,
        color: '#999',
        fontWeight: '500',
    },
    fileTypeText: {
        marginTop: 5,
        color: '#bbb',
        fontFamily: 'Poppins',
        fontSize: 12,
    },
    submitButton: {
        backgroundColor: '#534889',
        paddingVertical: 16,
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
