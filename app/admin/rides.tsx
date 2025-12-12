import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../config';

type Ride = {
    id: string;
    rider: string;
    driver: string;
    pickup: string;
    dropoff: string;
    status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
    date: string;
    time: string;
};

export default function RidesManagement() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
    const [deletingRide, setDeletingRide] = useState<Ride | null>(null);
    const [cancellingRide, setCancellingRide] = useState<Ride | null>(null);

    // Fetch all rides
    const fetchRides = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found');
                return;
            }

            const response = await fetch(`${BASE_URL}/api/bookings/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                setRides(data);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch rides');
            }
        } catch (error) {
            console.error('Fetch rides error:', error);
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchRides();
        }, [fetchRides])
    );

    // READ - View details
    const handleView = (ride: Ride) => {
        setSelectedRide(ride);
        setModalVisible(true);
    };

    // UPDATE - Change status
    const handleUpdateStatus = (ride: Ride, newStatus: Ride['status']) => {
        setCancellingRide(ride);
        setCancelModalVisible(true);
    };

    const confirmCancel = async () => {
        if (!cancellingRide) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/bookings/admin/${cancellingRide.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'Cancelled' })
            });

            if (response.ok) {
                Alert.alert('Success', 'Ride cancelled successfully');
                setCancelModalVisible(false);
                setCancellingRide(null);
                fetchRides(); // Refresh the list
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to cancel ride');
            }
        } catch (error) {
            console.error('Cancel ride error:', error);
            Alert.alert('Error', 'Network error');
        }
    };

    // DELETE
    const handleDelete = (ride: Ride) => {
        setDeletingRide(ride);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!deletingRide) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/bookings/admin/${deletingRide.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                Alert.alert('Success', 'Ride deleted successfully');
                setDeleteModalVisible(false);
                setDeletingRide(null);
                fetchRides(); // Refresh the list
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to delete ride');
            }
        } catch (error) {
            console.error('Delete ride error:', error);
            Alert.alert('Error', 'Network error');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted': return '#3498DB';
            case 'Completed': return '#2ECC71';
            case 'Pending': return '#F39C12';
            case 'Cancelled': return '#E74C3C';
            default: return '#95A5A6';
        }
    };

    const renderItem = ({ item }: { item: Ride }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.rideInfo}>
                    <MaterialIcons name="two-wheeler" size={18} color="#534889" />
                    <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.rider} → {item.driver}
                    </Text>
                </View>
                <View style={styles.statusBadgeContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]} numberOfLines={1}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={styles.cardSubtitle} numberOfLines={1}>{item.pickup} to {item.dropoff}</Text>
            <Text style={styles.dateTime}>{item.date} • {item.time}</Text>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleView(item)}>
                    <MaterialIcons name="visibility" size={20} color="#3498DB" />
                    <Text style={styles.actionText}>View</Text>
                </TouchableOpacity>
                {item.status !== 'Completed' && item.status !== 'Cancelled' && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleUpdateStatus(item, 'Cancelled')}
                    >
                        <MaterialIcons name="cancel" size={20} color="#E74C3C" />
                        <Text style={styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
                    <MaterialIcons name="delete" size={20} color="#E74C3C" />
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#534889" />
                <Text style={styles.loadingText}>Loading rides...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={rides}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No rides found.</Text>}
            />

            {/* View Details Modal */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Ride Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                            {selectedRide && (
                                <View style={styles.modalBody}>
                                    <View style={styles.rideHeader}>
                                        <MaterialIcons name="two-wheeler" size={40} color="#534889" />
                                        <Text style={styles.rideTitle}>Motorcycle Ride</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="person" size={20} color="#7F8C8D" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Rider</Text>
                                            <Text style={styles.detailValue}>{selectedRide.rider}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="two-wheeler" size={20} color="#7F8C8D" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Driver</Text>
                                            <Text style={styles.detailValue}>{selectedRide.driver}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="my-location" size={20} color="#27AE60" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Pickup Location</Text>
                                            <Text style={styles.detailValue}>{selectedRide.pickup}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="location-on" size={20} color="#E74C3C" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Dropoff Location</Text>
                                            <Text style={styles.detailValue}>{selectedRide.dropoff}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="calendar-today" size={20} color="#7F8C8D" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Date & Time</Text>
                                            <Text style={styles.detailValue}>{selectedRide.date} at {selectedRide.time}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="info" size={20} color="#7F8C8D" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Status</Text>
                                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedRide.status) + '20' }]}>
                                                <Text style={[styles.statusText, { color: getStatusColor(selectedRide.status) }]}>
                                                    {selectedRide.status}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.noteBox}>
                                        <MaterialIcons name="info-outline" size={16} color="#7F8C8D" />
                                        <Text style={styles.noteText}>Fare is negotiated between rider and driver</Text>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal visible={deleteModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.deleteModalContainer}>
                        <Text style={styles.deleteModalTitle}>Delete Ride</Text>
                        <Text style={styles.deleteModalMessage}>
                            Are you sure you want to delete this ride from <Text style={styles.deleteModalRider}>{deletingRide?.rider}</Text> to <Text style={styles.deleteModalRider}>{deletingRide?.driver}</Text>?
                        </Text>
                        <Text style={styles.deleteModalWarning}>This action cannot be undone.</Text>

                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={[styles.deleteModalBtn, styles.deleteCancelBtn]}
                                onPress={() => {
                                    setDeleteModalVisible(false);
                                    setDeletingRide(null);
                                }}
                            >
                                <Text style={styles.deleteCancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.deleteModalBtn, styles.deleteConfirmBtn]}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.deleteConfirmText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Cancel Confirmation Modal */}
            <Modal visible={cancelModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.deleteModalContainer}>
                        <Text style={styles.deleteModalTitle}>Cancel Ride</Text>
                        <Text style={styles.deleteModalMessage}>
                            Are you sure you want to cancel the ride from <Text style={styles.deleteModalRider}>{cancellingRide?.rider}</Text> to <Text style={styles.deleteModalRider}>{cancellingRide?.driver}</Text>?
                        </Text>
                        <Text style={styles.deleteModalWarning}>The rider and driver will be notified.</Text>

                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={[styles.deleteModalBtn, styles.deleteCancelBtn]}
                                onPress={() => {
                                    setCancelModalVisible(false);
                                    setCancellingRide(null);
                                }}
                            >
                                <Text style={styles.deleteCancelText}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.deleteModalBtn, styles.cancelConfirmBtn]}
                                onPress={confirmCancel}
                            >
                                <Text style={styles.deleteConfirmText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
    },
    list: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    rideInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
        minWidth: 0,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        fontFamily: 'Poppins',
        marginLeft: 6,
        flex: 1,
        flexShrink: 1,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 2,
        fontFamily: 'Poppins',
    },
    dateTime: {
        fontSize: 12,
        color: '#95A5A6',
        marginTop: 4,
        fontFamily: 'Poppins',
    },
    statusBadgeContainer: {
        flexShrink: 0,
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    actionText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#34495E',
        fontFamily: 'Poppins',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#95A5A6',
        fontFamily: 'Poppins',
    },
    // Modal
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
    modalScrollView: {
        maxHeight: '100%',
    },
    modalBody: {
        padding: 15,
    },
    rideHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    rideTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#534889',
        fontFamily: 'Poppins',
        marginTop: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailInfo: {
        flex: 1,
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
    },
    detailValue: {
        fontSize: 14,
        color: '#2C3E50',
        fontWeight: '500',
        fontFamily: 'Poppins',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 10,
    },
    noteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
    },
    noteText: {
        fontSize: 12,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
        marginLeft: 8,
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    deleteModalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    deleteModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 12,
        fontFamily: 'Poppins',
    },
    deleteModalMessage: {
        fontSize: 15,
        color: '#34495E',
        marginBottom: 8,
        lineHeight: 22,
        fontFamily: 'Poppins',
    },
    deleteModalRider: {
        fontWeight: 'bold',
        color: '#534889',
    },
    deleteModalWarning: {
        fontSize: 13,
        color: '#E74C3C',
        marginBottom: 24,
        fontFamily: 'Poppins',
        fontStyle: 'italic',
    },
    deleteModalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    deleteModalBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteCancelBtn: {
        backgroundColor: '#ECF0F1',
    },
    deleteConfirmBtn: {
        backgroundColor: '#E74C3C',
    },
    cancelConfirmBtn: {
        backgroundColor: '#F39C12',
    },
    deleteCancelText: {
        color: '#2C3E50',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'Poppins',
    },
    deleteConfirmText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'Poppins',
    },
});
