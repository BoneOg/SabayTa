import ProfileHeader from '@/components/ProfileHeader';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../../config';

export default function StudentVerification() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [existingRequest, setExistingRequest] = useState<any>(null);
    const [course, setCourse] = useState('');
    const [yearLevel, setYearLevel] = useState('');
    const [studentIdFile, setStudentIdFile] = useState<{ uri: string; type: string; name: string } | null>(null);
    const [corFile, setCorFile] = useState<{ uri: string; type: string; name: string } | null>(null);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

    useEffect(() => {
        checkExistingRequest();
    }, []);

    const checkExistingRequest = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                setCheckingStatus(false);
                return;
            }

            console.log('Checking verification status...');
            const response = await fetch(`${BASE_URL}/api/student-verification/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Verification data:', data);
                // Handle both 'request' and 'verification' keys
                const requestData = data.request || data.verification;
                if (data.hasRequest || requestData) {
                    setExistingRequest(requestData);
                    console.log('Found existing request:', requestData);
                }
            } else {
                console.log('Response not OK:', await response.text());
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
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
        if (!course || !yearLevel) {
            Alert.alert('Error', 'Please fill in course and year level.');
            return;
        }

        if (!studentIdFile || !corFile) {
            Alert.alert('Error', 'Please upload both Student ID and COR.');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'Not authenticated');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('course', course);
            formData.append('yearLevel', yearLevel);
            formData.append('schoolId', {
                uri: studentIdFile.uri,
                type: studentIdFile.type,
                name: studentIdFile.name
            } as any);

            formData.append('enrollmentProof', {
                uri: corFile.uri,
                type: corFile.type,
                name: corFile.name
            } as any);

            const response = await fetch(`${BASE_URL}/api/student-verification/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Documents submitted for verification!');
                router.back();
            } else {
                Alert.alert('Error', data.message || 'Failed to submit verification');
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to submit documents');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ProfileHeader onBack={() => router.back()} title="Verify Account" />

            {existingRequest ? (
                <ScrollView style={styles.content}>
                    <View style={[styles.infoCard, {
                        backgroundColor: existingRequest.verificationStatus === 'pending' ? '#E8E0F5' :
                            existingRequest.verificationStatus === 'verified' ? '#D4E8D4' : '#F5E0E8'
                    }]}>
                        <MaterialIcons
                            name={existingRequest.verificationStatus === 'pending' ? 'schedule' :
                                existingRequest.verificationStatus === 'verified' ? 'verified' : 'cancel'}
                            size={48}
                            color={existingRequest.verificationStatus === 'pending' ? '#534889' :
                                existingRequest.verificationStatus === 'verified' ? '#4CAF50' : '#E91E63'}
                        />
                        <Text style={[styles.infoTitle, {
                            color: existingRequest.verificationStatus === 'pending' ? '#534889' :
                                existingRequest.verificationStatus === 'verified' ? '#4CAF50' : '#E91E63'
                        }]}>
                            {existingRequest.verificationStatus === 'pending' ? 'Verification Pending' :
                                existingRequest.verificationStatus === 'verified' ? 'Account Verified!' : 'Verification Rejected'}
                        </Text>
                        <Text style={[styles.infoMessage, {
                            color: existingRequest.verificationStatus === 'pending' ? '#534889' :
                                existingRequest.verificationStatus === 'verified' ? '#4CAF50' : '#E91E63'
                        }]}>
                            {existingRequest.verificationStatus === 'pending' ?
                                'Your verification request is being reviewed by our admin team. You will be notified once it\'s processed.' :
                                existingRequest.verificationStatus === 'verified' ?
                                    'Your student account has been successfully verified!' :
                                    'Your verification request was rejected. Please contact support for more information.'}
                        </Text>
                        <View style={styles.requestDetails}>
                            <Text style={styles.detailLabel}>Course:</Text>
                            <Text style={styles.detailValue}>{existingRequest.course}</Text>
                        </View>
                        <View style={styles.requestDetails}>
                            <Text style={styles.detailLabel}>Year Level:</Text>
                            <Text style={styles.detailValue}>{existingRequest.yearLevel}</Text>
                        </View>
                        <View style={styles.requestDetails}>
                            <Text style={styles.detailLabel}>
                                {existingRequest.verificationStatus === 'verified' ? 'Verified:' : 'Submitted:'}
                            </Text>
                            <Text style={styles.detailValue}>
                                {new Date(
                                    existingRequest.verificationStatus === 'verified'
                                        ? existingRequest.updatedAt
                                        : existingRequest.createdAt
                                ).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <ScrollView style={styles.content}>
                    <Text style={styles.description}>
                        Please fill in your details and upload your Student ID and Certificate of Registration (COR).
                    </Text>

                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Course/Program</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. BS Information Technology"
                            placeholderTextColor="#999"
                            value={course}
                            onChangeText={setCourse}
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Year Level</Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setShowYearDropdown(!showYearDropdown)}
                        >
                            <Text style={[styles.dropdownText, !yearLevel && styles.placeholderText]}>
                                {yearLevel || 'Select Year Level'}
                            </Text>
                            <MaterialIcons name={showYearDropdown ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#666" />
                        </TouchableOpacity>
                        {showYearDropdown && (
                            <View style={styles.dropdownMenu}>
                                {yearLevels.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setYearLevel(year);
                                            setShowYearDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{year}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.uploadSection}>
                        <Text style={styles.label}>Student ID</Text>
                        <TouchableOpacity style={styles.uploadBox} onPress={() => pickFile(setStudentIdFile)}>
                            {studentIdFile ? (
                                studentIdFile.type === 'application/pdf' ? (
                                    <View style={styles.pdfPreview}>
                                        <MaterialIcons name="picture-as-pdf" size={60} color="#F44336" />
                                        <Text style={styles.fileName}>{studentIdFile.name}</Text>
                                    </View>
                                ) : (
                                    <Image source={{ uri: studentIdFile.uri }} style={styles.previewImage} />
                                )
                            ) : (
                                <View style={styles.placeholder}>
                                    <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
                                    <Text style={styles.placeholderText}>Tap to upload Student ID</Text>
                                    <Text style={styles.fileTypeText}>PDF or Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.uploadSection}>
                        <Text style={styles.label}>Certificate of Registration (COR)</Text>
                        <TouchableOpacity style={styles.uploadBox} onPress={() => pickFile(setCorFile)}>
                            {corFile ? (
                                corFile.type === 'application/pdf' ? (
                                    <View style={styles.pdfPreview}>
                                        <MaterialIcons name="picture-as-pdf" size={60} color="#F44336" />
                                        <Text style={styles.fileName}>{corFile.name}</Text>
                                    </View>
                                ) : (
                                    <Image source={{ uri: corFile.uri }} style={styles.previewImage} />
                                )
                            ) : (
                                <View style={styles.placeholder}>
                                    <MaterialIcons name="add-a-photo" size={40} color="#ccc" />
                                    <Text style={styles.placeholderText}>Tap to upload COR</Text>
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
                            <Text style={styles.submitButtonText}>Submit for Verification</Text>
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
        paddingTop: Platform.OS === 'android' ? 20 : 20
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
        zIndex: 1000,
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
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
    dropdownText: {
        fontSize: 15,
        fontFamily: 'Poppins',
        color: '#333',
    },
    placeholderText: {
        color: '#999',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        zIndex: 1001,
        elevation: 5,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
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
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    pdfPreview: {
        alignItems: 'center',
        justifyContent: 'center',
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
    fileTypeText: {
        marginTop: 5,
        color: '#bbb',
        fontFamily: 'Poppins',
        fontSize: 12,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    infoCard: {
        margin: 20,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    infoTitle: {
        fontFamily: 'Poppins',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    infoMessage: {
        fontFamily: 'Poppins',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    requestDetails: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    detailLabel: {
        fontFamily: 'Poppins',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    detailValue: {
        fontFamily: 'Poppins',
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
});
