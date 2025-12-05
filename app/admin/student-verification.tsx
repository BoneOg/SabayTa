import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    studentId: string;
    school: string;
    course: string;
    yearLevel: string;
    documents: {
        schoolId?: string;
        enrollmentProof?: string;
    };
    verificationStatus: 'pending' | 'verified' | 'rejected';
    createdAt: string;
}

export default function StudentVerification() {
    const [requests, setRequests] = useState<StudentVerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<StudentVerificationRequest | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

    const fetchRequests = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/admin/student-verification`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            } else {
                Alert.alert('Error', 'Failed to fetch verification requests');
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (requestId: string, status: 'verified' | 'rejected') => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/admin/student-verification/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ verificationStatus: status })
            });

            if (response.ok) {
                Alert.alert('Success', `Student ${status} successfully`);
                setModalVisible(false);
                fetchRequests();
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to update verification status');
            }
        } catch (error) {
            console.error('Error updating verification:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    const filteredRequests = requests.filter(req =>
        filter === 'all' ? true : req.verificationStatus === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFA500';
            case 'verified': return '#4CAF50';
            case 'rejected': return '#F44336';
            default: return '#999';
        }
    };

    const renderRequest = ({ item }: { item: StudentVerificationRequest }) => (
        <TouchableOpacity
            style={styles.requestCard}
            onPress={() => {
                setSelectedRequest(item);
                setModalVisible(true);
            }}
        >
            <View style={styles.cardHeader}>
                <Image
                    source={{ uri: item.userId.profilePicture || 'https://via.placeholder.com/50' }}
                    style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.userId.name}</Text>
                    <Text style={styles.userEmail}>{item.userId.email}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.verificationStatus) }]}>
                    <Text style={styles.statusText}>{item.verificationStatus.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="school" size={18} color="#534889" />
                    <Text style={styles.infoText}>{item.school}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialIcons name="book" size={18} color="#534889" />
                    <Text style={styles.infoText}>{item.course}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialIcons name="grade" size={18} color="#534889" />
                    <Text style={styles.infoText}>Year {item.yearLevel}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialIcons name="badge" size={18} color="#534889" />
                    <Text style={styles.infoText}>ID: {item.studentId}</Text>
                </View>
            </View>

            <Text style={styles.dateText}>
                Submitted: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#534889" style={{ marginTop: 50 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.filterContainer}>
                {['all', 'pending', 'verified', 'rejected'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterButton, filter === f && styles.filterButtonActive]}
                        onPress={() => setFilter(f as any)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredRequests}
                renderItem={renderRequest}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#534889']} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="school" size={64} color="#D0D0D0" />
                        <Text style={styles.emptyText}>No {filter !== 'all' ? filter : ''} verification requests found</Text>
                    </View>
                }
            />

            {/* Request Details Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Verification Details</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            {selectedRequest && (
                                <>
                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Student Information</Text>
                                        <View style={styles.studentInfo}>
                                            <Image
                                                source={{ uri: selectedRequest.userId.profilePicture || 'https://via.placeholder.com/80' }}
                                                style={styles.modalProfileImage}
                                            />
                                            <View>
                                                <Text style={styles.modalUserName}>{selectedRequest.userId.name}</Text>
                                                <Text style={styles.modalUserDetail}>{selectedRequest.userId.email}</Text>
                                                <Text style={styles.modalUserDetail}>{selectedRequest.userId.phone}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Academic Information</Text>
                                        <Text style={styles.detailText}>School: {selectedRequest.school}</Text>
                                        <Text style={styles.detailText}>Course: {selectedRequest.course}</Text>
                                        <Text style={styles.detailText}>Year Level: {selectedRequest.yearLevel}</Text>
                                        <Text style={styles.detailText}>Student ID: {selectedRequest.studentId}</Text>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Submitted Documents</Text>
                                        {selectedRequest.documents.schoolId && (
                                            <Text style={styles.documentText}>✓ School ID</Text>
                                        )}
                                        {selectedRequest.documents.enrollmentProof && (
                                            <Text style={styles.documentText}>✓ Enrollment Proof</Text>
                                        )}
                                        {!selectedRequest.documents.schoolId && !selectedRequest.documents.enrollmentProof && (
                                            <Text style={styles.noDocumentText}>No documents uploaded</Text>
                                        )}
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Verification Status</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedRequest.verificationStatus) }]}>
                                            <Text style={styles.statusText}>{selectedRequest.verificationStatus.toUpperCase()}</Text>
                                        </View>
                                    </View>

                                    {selectedRequest.verificationStatus === 'pending' && (
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.verifyButton]}
                                                onPress={() => handleStatusUpdate(selectedRequest._id, 'verified')}
                                            >
                                                <MaterialIcons name="verified" size={20} color="#fff" />
                                                <Text style={styles.actionButtonText}>Verify Student</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.rejectButton]}
                                                onPress={() => handleStatusUpdate(selectedRequest._id, 'rejected')}
                                            >
                                                <MaterialIcons name="cancel" size={20} color="#fff" />
                                                <Text style={styles.actionButtonText}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#534889',
    },
    filterText: {
        fontFamily: 'Poppins',
        fontSize: 13,
        color: '#666',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    requestCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userEmail: {
        fontFamily: 'Poppins',
        fontSize: 13,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: 'Poppins',
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
    },
    cardBody: {
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    infoText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
    },
    dateText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontFamily: 'Poppins',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    modalSection: {
        marginBottom: 20,
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
    modalProfileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    modalUserName: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalUserDetail: {
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
    documentText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#4CAF50',
        marginVertical: 4,
    },
    noDocumentText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
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
});
