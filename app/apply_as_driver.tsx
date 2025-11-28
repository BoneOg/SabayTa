import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
    const [plateNumber, setPlateNumber] = useState('ABC 1234');
    const [motorcycleModel, setMotorcycleModel] = useState('');

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
                            <Ionicons name="person-outline" size={30} color="#622C9B" />
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
                        <TouchableOpacity style={styles.uploadBox}>
                            <MaterialIcons name="file-upload" size={24} color="#888" />
                            <Text style={styles.uploadText}>Click to upload or drag and drop</Text>
                            <Text style={styles.uploadSubText}>PDF or Image (Max 5MB)</Text>
                        </TouchableOpacity>
                    </View>

                    {/* School Certificate of Registration */}
                    <View style={styles.documentSection}>
                        <View style={styles.documentLabelRow}>
                            <MaterialIcons name="description" size={16} color="#666" />
                            <Text style={styles.documentLabel}>School Certificate of Registration</Text>
                        </View>
                        <TouchableOpacity style={styles.uploadBox}>
                            <MaterialIcons name="file-upload" size={24} color="#888" />
                            <Text style={styles.uploadText}>Click to upload or drag and drop</Text>
                            <Text style={styles.uploadSubText}>PDF or Image (Max 5MB)</Text>
                        </TouchableOpacity>
                    </View>

                    {/* School ID */}
                    <View style={styles.documentSection}>
                        <View style={styles.documentLabelRow}>
                            <MaterialIcons name="badge" size={16} color="#666" />
                            <Text style={styles.documentLabel}>School ID</Text>
                        </View>
                        <TouchableOpacity style={styles.uploadBox}>
                            <MaterialIcons name="file-upload" size={24} color="#888" />
                            <Text style={styles.uploadText}>Click to upload or drag and drop</Text>
                            <Text style={styles.uploadSubText}>PDF or Image (Max 5MB)</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Vehicle Information */}
                <View style={styles.card}>
                    <View style={styles.cardTitleRow}>
                        <Ionicons name="car-outline" size={20} color="#414141" style={{ marginRight: 8 }} />
                        <Text style={styles.cardTitle}>Vehicle Information</Text>
                    </View>

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
                        <MaterialIcons name="assignment" size={18} color="#E67E22" />
                        <Text style={styles.infoTitle}>Application Process</Text>
                    </View>
                    <Text style={styles.infoText}>
                        After submission, your application will be marked as "Pending admin approval". Our team will review your documents within 1-3 business days. You'll receive a notification once your application is approved.
                    </Text>
                </View>

                {/* Submit Button */}
                <Button
                    label="Submit Application"
                    onPress={() => { }}
                    style={styles.submitButton}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Light gray background for the whole screen
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
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3E5F5', // Light purple
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
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
        backgroundColor: '#FAFAFA',
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
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#414141',
        fontFamily: 'Poppins',
        marginBottom: 15,
    },
    infoBox: {
        backgroundColor: '#E3F2FD', // Light blue
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    infoTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0D47A1',
        marginLeft: 8,
        fontFamily: 'Poppins',
    },
    infoText: {
        fontSize: 13,
        color: '#1565C0',
        lineHeight: 20,
        fontFamily: 'Poppins',
    },
    submitButton: {
        backgroundColor: '#622C9B',
        borderRadius: 10,
    },
});
