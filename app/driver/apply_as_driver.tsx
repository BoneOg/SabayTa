import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ApplyAsDriver() {
    const router = useRouter();
    const [plateNumber, setPlateNumber] = useState('');
    const [motorcycleModel, setMotorcycleModel] = useState('');
    const [documents, setDocuments] = useState({
        license: false,
        orCr: false,
        cor: false,
        schoolId: false,
    });

    const handleUpload = (docType: keyof typeof documents) => {
        // Simulate upload
        setDocuments(prev => ({ ...prev, [docType]: true }));
    };

    const isFormComplete = plateNumber && motorcycleModel &&
        documents.license && documents.orCr &&
        documents.cor && documents.schoolId;

    const handleSubmit = () => {
        // Here you would typically upload documents and submit data to your backend
        // For now, we'll simulate a successful submission
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => router.back()} style={{ marginBottom: 0 }} />

                <Text style={styles.headerTitle}>Apply as Driver</Text>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Applicant Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Applicant Information</Text>
                    <View style={styles.applicantRow}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('@/assets/images/cat5.jpg')}
                                style={styles.profileImage}
                            />
                        </View>
                        <View style={styles.applicantDetails}>
                            <Text style={styles.applicantName}>John Doe</Text>
                            <Text style={styles.applicantEmail}>john.doe@ustp.edu.ph</Text>
                            <Text style={styles.applicantUniversity}>University of Science and Technology of Southern Philippines</Text>
                        </View>
                    </View>
                </View>

                {/* Required Documents */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Required Documents</Text>

                    {/* Driver's License */}
                    <View style={styles.documentSection}>
                        <View style={styles.documentLabelRow}>
                            <MaterialIcons name="credit-card" size={16} color="#666" />
                            <Text style={styles.documentLabel}>Driver's License</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.uploadBox, documents.license && styles.uploadBoxActive]}
                            onPress={() => handleUpload('license')}
                        >
                            <MaterialIcons
                                name={documents.license ? "check-circle" : "file-upload"}
                                size={24}
                                color={documents.license ? "#4CAF50" : "#888"}
                            />
                            <Text style={styles.uploadText}>
                                {documents.license ? "Uploaded" : "Tap to upload"}
                            </Text>
                            {!documents.license && (
                                <Text style={styles.uploadSubText}>PDF or Image (Max 5MB)</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Vehicle OR/CR */}
                    <View style={styles.documentSection}>
                        <View style={styles.documentLabelRow}>
                            <MaterialIcons name="description" size={16} color="#666" />
                            <Text style={styles.documentLabel}>Vehicle OR/CR</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.uploadBox, documents.orCr && styles.uploadBoxActive]}
                            onPress={() => handleUpload('orCr')}
                        >
                            <MaterialIcons
                                name={documents.orCr ? "check-circle" : "file-upload"}
                                size={24}
                                color={documents.orCr ? "#4CAF50" : "#888"}
                            />
                            <Text style={styles.uploadText}>
                                {documents.orCr ? "Uploaded" : "Tap to upload"}
                            </Text>
                            {!documents.orCr && (
                                <Text style={styles.uploadSubText}>PDF or Image (Max 5MB)</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* School Certificate of Registration (COR) */}
                    <View style={styles.documentSection}>
                        <View style={styles.documentLabelRow}>
                            <MaterialIcons name="description" size={16} color="#666" />
                            <Text style={styles.documentLabel}>School Certificate of Registration (COR)</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.uploadBox, documents.cor && styles.uploadBoxActive]}
                            onPress={() => handleUpload('cor')}
                        >
                            <MaterialIcons
                                name={documents.cor ? "check-circle" : "file-upload"}
                                size={24}
                                color={documents.cor ? "#4CAF50" : "#888"}
                            />
                            <Text style={styles.uploadText}>
                                {documents.cor ? "Uploaded" : "Tap to upload"}
                            </Text>
                            {!documents.cor && (
                                <Text style={styles.uploadSubText}>PDF or Image (Max 5MB)</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* School ID */}
                    <View style={styles.documentSection}>
                        <View style={styles.documentLabelRow}>
                            <MaterialIcons name="badge" size={16} color="#666" />
                            <Text style={styles.documentLabel}>School ID</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.uploadBox, documents.schoolId && styles.uploadBoxActive]}
                            onPress={() => handleUpload('schoolId')}
                        >
                            <MaterialIcons
                                name={documents.schoolId ? "check-circle" : "file-upload"}
                                size={24}
                                color={documents.schoolId ? "#4CAF50" : "#888"}
                            />
                            <Text style={styles.uploadText}>
                                {documents.schoolId ? "Uploaded" : "Tap to upload"}
                            </Text>
                            {!documents.schoolId && (
                                <Text style={styles.uploadSubText}>PDF or Image (Max 5MB)</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Vehicle Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Vehicle Information</Text>

                    <Text style={styles.inputLabel}>Plate Number</Text>
                    <TextInput
                        style={styles.input}
                        value={plateNumber}
                        onChangeText={setPlateNumber}
                        placeholder="ABC 1234"
                        placeholderTextColor="#D0D0D0"
                    />

                    <Text style={styles.inputLabel}>Motorcycle Model</Text>
                    <TextInput
                        style={styles.input}
                        value={motorcycleModel}
                        onChangeText={setMotorcycleModel}
                        placeholder="e.g., Honda Click 125"
                        placeholderTextColor="#D0D0D0"
                    />
                </View>

                {/* Application Process Info */}
                <View style={styles.infoBox}>
                    <View style={styles.infoTitleRow}>
                        <MaterialIcons name="assignment" size={18} color="#622C9B" />
                        <Text style={styles.infoTitle}>Application Process</Text>
                    </View>
                    <Text style={styles.infoText}>
                        Your application will be reviewed within 1-3 business days. You'll be notified once approved.
                    </Text>
                </View>

                {/* Submit Button */}
                <Button
                    label="Submit Application"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    disabled={!isFormComplete}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // White background
        paddingTop: Platform.OS === 'android' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#1C1B1F',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#414141',
        marginBottom: 15,
        fontFamily: 'Poppins',
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    applicantRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 15,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#D0D0D0',
    },
    applicantDetails: {
        flex: 1,
    },
    applicantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#414141',
        fontFamily: 'Poppins',
    },
    applicantEmail: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins',
    },
    applicantUniversity: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
        fontFamily: 'Poppins',
    },
    documentSection: {
        marginBottom: 20,
    },
    documentLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    documentLabel: {
        fontSize: 14,
        color: '#414141',
        marginLeft: 8,
        fontFamily: 'Poppins',
    },
    uploadBox: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderStyle: 'dashed',
        borderRadius: 10,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    uploadBoxActive: {
        borderColor: '#4CAF50',
        backgroundColor: '#F1F8E9',
        borderStyle: 'solid',
    },
    uploadText: {
        fontSize: 14,
        color: '#414141',
        marginTop: 10,
        fontFamily: 'Poppins',
    },
    uploadSubText: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        fontFamily: 'Poppins',
    },
    inputLabel: {
        fontSize: 14,
        color: '#414141',
        marginBottom: 8,
        fontFamily: 'Poppins',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#414141',
        fontFamily: 'Poppins',
        marginBottom: 15,
        backgroundColor: '#F8F8F8',
    },
    infoBox: {
        backgroundColor: '#F3E5F5', // Light purple
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#E1BEE7',
    },
    infoTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4A148C', // Darker purple
        marginLeft: 8,
        fontFamily: 'Poppins',
    },
    infoText: {
        fontSize: 13,
        color: '#6A1B9A', // Medium purple
        lineHeight: 20,
        fontFamily: 'Poppins',
    },
    submitButton: {
        backgroundColor: '#622C9B',
        borderRadius: 10,
    },
});
