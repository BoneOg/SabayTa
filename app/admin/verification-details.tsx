import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentViewerModal from '../../components/admin/DocumentViewerModal';
import { BASE_URL } from '../../config';

interface StudentVerificationRequest {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profilePicture?: string;
    };
    course: string;
    yearLevel: string;
    documents: {
        schoolId?: string;
        enrollmentProof?: string;
    };
    verificationStatus: 'pending' | 'verified' | 'rejected';
    createdAt: string;
}

export default function VerificationDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [request, setRequest] = useState<StudentVerificationRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentViewerVisible, setDocumentViewerVisible] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<{ url: string; title: string } | null>(null);

    useEffect(() => {
        fetchRequestDetails();
    }, []);

    const fetchRequestDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/student-verification/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const foundRequest = data.find((r: StudentVerificationRequest) => r._id === params.id);
                console.log('Found request:', foundRequest);
                console.log('Profile picture:', foundRequest?.userId?.profilePicture);
                setRequest(foundRequest);
            }
        } catch (error) {
            console.error('Error fetching request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status: 'verified' | 'rejected') => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/student-verification/admin/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ verificationStatus: status })
            });

            if (response.ok) {
                Alert.alert('Success', `Student ${status} successfully`);
                router.back();
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to update verification status');
            }
        } catch (error) {
            console.error('Error updating verification:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFA500';
            case 'verified': return '#4CAF50';
            case 'rejected': return '#F44336';
            default: return '#999';
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#534889" style={{ marginTop: 50 }} />
            </SafeAreaView>
        );
    }

    if (!request) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Request not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verification Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Student Information</Text>
                    <View style={styles.studentInfo}>
                        <Image
                            source={{ uri: request.userId.profilePicture || 'https://via.placeholder.com/80' }}
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={styles.userName}>{request.userId.name}</Text>
                            <Text style={styles.userDetail}>{request.userId.email}</Text>
                            <Text style={styles.userDetail}>{request.userId.phone}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Academic Information</Text>
                    <Text style={styles.detailText}>Course: {request.course}</Text>
                    <Text style={styles.detailText}>Year Level: {request.yearLevel}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Submitted Documents</Text>
                    {request.documents.schoolId && (
                        <TouchableOpacity
                            style={styles.documentLink}
                            onPress={() => {
                                setViewingDocument({
                                    url: request.documents.schoolId!,
                                    title: 'Student ID'
                                });
                                setDocumentViewerVisible(true);
                            }}
                        >
                            <MaterialIcons name="description" size={20} color="#534889" />
                            <Text style={styles.documentLinkText}>View Student ID</Text>
                            <MaterialIcons name="visibility" size={16} color="#534889" />
                        </TouchableOpacity>
                    )}
                    {request.documents.enrollmentProof && (
                        <TouchableOpacity
                            style={styles.documentLink}
                            onPress={() => {
                                setViewingDocument({
                                    url: request.documents.enrollmentProof!,
                                    title: 'Enrollment Proof (COR)'
                                });
                                setDocumentViewerVisible(true);
                            }}
                        >
                            <MaterialIcons name="description" size={20} color="#534889" />
                            <Text style={styles.documentLinkText}>View Enrollment Proof (COR)</Text>
                            <MaterialIcons name="visibility" size={16} color="#534889" />
                        </TouchableOpacity>
                    )}
                </View>

                {request.verificationStatus === 'pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.verifyButton]}
                            onPress={() => handleStatusUpdate('verified')}
                        >
                            <Text style={styles.actionButtonText}>Verify Student</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleStatusUpdate('rejected')}
                        >
                            <Text style={styles.actionButtonText}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <DocumentViewerModal
                visible={documentViewerVisible}
                onClose={() => setDocumentViewerVisible(false)}
                documentUrl={viewingDocument?.url || null}
                documentTitle={viewingDocument?.title || 'Document'}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: '600',
        color: '#534889',
        marginBottom: 12,
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    userName: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    userDetail: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    detailText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#333',
        marginVertical: 4,
    },
    documentLink: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginVertical: 6,
        gap: 8,
    },
    documentLinkText: {
        flex: 1,
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#534889',
        fontWeight: '500',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        marginBottom: 30,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    verifyButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        fontFamily: 'Poppins',
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    errorText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 50,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalContent: {
        flex: 1,
    },
    documentImage: {
        width: '100%',
        height: '100%',
    },
    pdf: {
        flex: 1,
        width: '100%',
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
    openBrowserButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#534889',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        gap: 8,
    },
    openBrowserText: {
        fontFamily: 'Poppins',
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});
