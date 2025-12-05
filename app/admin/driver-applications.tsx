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

interface DriverApplication {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profilePicture?: string;
    };
    vehicleType: string;
    vehicleModel: string;
    vehiclePlateNumber: string;
    licenseNumber: string;
    documents: {
        driversLicense?: string;
        vehicleRegistration?: string;
        schoolId?: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function DriverApplications() {
    const [applications, setApplications] = useState<DriverApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    const fetchApplications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/admin/driver-applications`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                Alert.alert('Error', 'Failed to fetch driver applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/admin/driver-applications/${applicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                Alert.alert('Success', `Application ${status} successfully`);
                setModalVisible(false);
                fetchApplications();
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to update application');
            }
        } catch (error) {
            console.error('Error updating application:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    const filteredApplications = applications.filter(app =>
        filter === 'all' ? true : app.status === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFA500';
            case 'approved': return '#4CAF50';
            case 'rejected': return '#F44336';
            default: return '#999';
        }
    };

    const renderApplication = ({ item }: { item: DriverApplication }) => (
        <TouchableOpacity
            style={styles.applicationCard}
            onPress={() => {
                setSelectedApp(item);
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
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="two-wheeler" size={18} color="#534889" />
                    <Text style={styles.infoText}>{item.vehicleModel} ({item.vehicleType})</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialIcons name="confirmation-number" size={18} color="#534889" />
                    <Text style={styles.infoText}>{item.vehiclePlateNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialIcons name="badge" size={18} color="#534889" />
                    <Text style={styles.infoText}>License: {item.licenseNumber}</Text>
                </View>
            </View>

            <Text style={styles.dateText}>
                Applied: {new Date(item.createdAt).toLocaleDateString()}
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
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
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
                data={filteredApplications}
                renderItem={renderApplication}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#534889']} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="assignment" size={64} color="#D0D0D0" />
                        <Text style={styles.emptyText}>No {filter !== 'all' ? filter : ''} applications found</Text>
                    </View>
                }
            />

            {/* Application Details Modal */}
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
                                <Text style={styles.modalTitle}>Application Details</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            {selectedApp && (
                                <>
                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Applicant Information</Text>
                                        <View style={styles.applicantInfo}>
                                            <Image
                                                source={{ uri: selectedApp.userId.profilePicture || 'https://via.placeholder.com/80' }}
                                                style={styles.modalProfileImage}
                                            />
                                            <View>
                                                <Text style={styles.modalUserName}>{selectedApp.userId.name}</Text>
                                                <Text style={styles.modalUserDetail}>{selectedApp.userId.email}</Text>
                                                <Text style={styles.modalUserDetail}>{selectedApp.userId.phone}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Vehicle Information</Text>
                                        <Text style={styles.detailText}>Type: {selectedApp.vehicleType}</Text>
                                        <Text style={styles.detailText}>Model: {selectedApp.vehicleModel}</Text>
                                        <Text style={styles.detailText}>Plate Number: {selectedApp.vehiclePlateNumber}</Text>
                                        <Text style={styles.detailText}>License Number: {selectedApp.licenseNumber}</Text>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Documents</Text>
                                        {selectedApp.documents.driversLicense && (
                                            <Text style={styles.documentText}>✓ Driver's License</Text>
                                        )}
                                        {selectedApp.documents.vehicleRegistration && (
                                            <Text style={styles.documentText}>✓ Vehicle Registration</Text>
                                        )}
                                        {selectedApp.documents.schoolId && (
                                            <Text style={styles.documentText}>✓ School ID</Text>
                                        )}
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionTitle}>Status</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedApp.status) }]}>
                                            <Text style={styles.statusText}>{selectedApp.status.toUpperCase()}</Text>
                                        </View>
                                    </View>

                                    {selectedApp.status === 'pending' && (
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.approveButton]}
                                                onPress={() => handleStatusUpdate(selectedApp._id, 'approved')}
                                            >
                                                <MaterialIcons name="check-circle" size={20} color="#fff" />
                                                <Text style={styles.actionButtonText}>Approve</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionButton, styles.rejectButton]}
                                                onPress={() => handleStatusUpdate(selectedApp._id, 'rejected')}
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
    applicationCard: {
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
    applicantInfo: {
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
});
