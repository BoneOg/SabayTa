import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Ride = {
    id: string;
    rider: string;
    driver: string;
    pickup: string;
    dropoff: string;
    status: 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled';
    date: string;
    time: string;
};

const INITIAL_RIDES: Ride[] = [
    { id: '1', rider: 'Alice Smith', driver: 'Charlie Brown', pickup: 'Main Gate', dropoff: 'Library', status: 'Ongoing', date: '2023-10-28', time: '10:00 AM' },
    { id: '2', rider: 'Bob Jones', driver: 'David Lee', pickup: 'Dormitory', dropoff: 'Science Building', status: 'Completed', date: '2023-10-28', time: '09:30 AM' },
];

export default function RidesManagement() {
    const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

    // READ - View details
    const handleView = (ride: Ride) => {
        setSelectedRide(ride);
        setModalVisible(true);
    };

    // UPDATE - Change status
    const handleUpdateStatus = (id: string, newStatus: Ride['status']) => {
        setRides(rides.map(r => r.id === id ? { ...r, status: newStatus } : r));
        Alert.alert('Success', `Ride status updated to ${newStatus}`);
    };

    // DELETE
    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Ride',
            'Are you sure you want to delete this ride record?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setRides(rides.filter(r => r.id !== id))
                }
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ongoing': return '#3498DB';
            case 'Completed': return '#2ECC71';
            case 'Pending': return '#F39C12';
            case 'Cancelled': return '#E74C3C';
            default: return '#95A5A6';
        }
    };

    const renderItem = ({ item }: { item: Ride }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <View style={styles.rideInfo}>
                        <MaterialIcons name="two-wheeler" size={20} color="#534889" />
                        <Text style={styles.cardTitle}>{item.rider} → {item.driver}</Text>
                    </View>
                    <Text style={styles.cardSubtitle}>{item.pickup} to {item.dropoff}</Text>
                    <Text style={styles.dateTime}>{item.date} • {item.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleView(item)}>
                    <MaterialIcons name="visibility" size={20} color="#3498DB" />
                    <Text style={styles.actionText}>View</Text>
                </TouchableOpacity>
                {item.status !== 'Completed' && item.status !== 'Cancelled' && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleUpdateStatus(item.id, 'Cancelled')}
                    >
                        <MaterialIcons name="cancel" size={20} color="#E74C3C" />
                        <Text style={styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                    <MaterialIcons name="delete" size={20} color="#E74C3C" />
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Ride Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

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

                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
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
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    rideInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        fontFamily: 'Poppins',
        marginLeft: 8,
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
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
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
    closeButton: {
        backgroundColor: '#534889',
        padding: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Poppins',
    },
});
