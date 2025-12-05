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

interface DriverApplication {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profilePicture?: string;
    };
    plateNumber: string;
    motorcycleModel: string;
    documents: {
        driversLicense?: string;
        vehicleORCR?: string;
    };
    applicationStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function DriverApplicationDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [application, setApplication] = useState<DriverApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentViewerVisible, setDocumentViewerVisible] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<{ url: string; title: string } | null>(null);

    useEffect(() => {
        fetchApplicationDetails();
    }, []);

    const fetchApplicationDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/driver-application/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const foundApplication = data.find((a: DriverApplication) => a._id === params.id);
                setApplication(foundApplication);
            }
        } catch (error) {
            console.error('Error fetching application:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/driver-application/admin/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ applicationStatus: status })
            });

            if (response.ok) {
                const data = await response.json();
                if (status === 'approved') {
                    Alert.alert(
                        'Success',
                        'Application approved! User role has been changed to Driver. They will need to log out and log back in to access driver features.',
                        [{ text: 'OK', onPress: () => router.back() }]
                    );
                } else {
                    Alert.alert('Success', `Application ${status} successfully`, [
                        { text: 'OK', onPress: () => router.back() }
                    ]);
                }
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to update application status');
            }
        } catch (error) {
            console.error('Error updating application:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#534889" style={{ marginTop: 50 }} />
            </SafeAreaView>
        );
    }

    if (!application) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Application not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Application Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Applicant Information</Text>
                    <View style={styles.applicantInfo}>
                        <Image
                            source={{ uri: application.userId.profilePicture || 'https://via.placeholder.com/80' }}
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={styles.userName}>{application.userId.name}</Text>
                            <Text style={styles.userDetail}>{application.userId.email}</Text>
                            <Text style={styles.userDetail}>{application.userId.phone}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    <Text style={styles.detailText}>Motorcycle Model: {application.motorcycleModel}</Text>
                    <Text style={styles.detailText}>Plate Number: {application.plateNumber}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Submitted Documents</Text>
                    {application.documents.driversLicense && (
                        <TouchableOpacity
                            style={styles.documentLink}
                            onPress={() => {
                                setViewingDocument({
                                    url: application.documents.driversLicense!,
                                    title: "Driver's License"
                                });
                                setDocumentViewerVisible(true);
                            }}
                        >
                            <MaterialIcons name="description" size={20} color="#534889" />
                            <Text style={styles.documentLinkText}>View Driver's License</Text>
                            <MaterialIcons name="visibility" size={16} color="#534889" />
                        </TouchableOpacity>
                    )}
                    {application.documents.vehicleORCR && (
                        <TouchableOpacity
                            style={styles.documentLink}
                            onPress={() => {
                                setViewingDocument({
                                    url: application.documents.vehicleORCR!,
                                    title: 'Vehicle OR/CR'
                                });
                                setDocumentViewerVisible(true);
                            }}
                        >
                            <MaterialIcons name="description" size={20} color="#534889" />
                            <Text style={styles.documentLinkText}>View Vehicle OR/CR</Text>
                            <MaterialIcons name="visibility" size={16} color="#534889" />
                        </TouchableOpacity>
                    )}
                </View>

                {application.applicationStatus === 'pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => handleStatusUpdate('approved')}
                        >
                            <Text style={styles.actionButtonText}>Approve Application</Text>
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
    applicantInfo: {
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
    approveButton: {
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
});
