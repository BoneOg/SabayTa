import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../config';

type Complaint = {
    id: string;
    reporter: string;
    reportedUser: string;
    reason: string;
    description: string;
    date: string;
    status: 'Pending' | 'Resolved';
};

export default function ComplaintsManagement() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [actionNote, setActionNote] = useState('');

    // Fetch all complaints
    const fetchComplaints = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found');
                return;
            }

            const response = await fetch(`${BASE_URL}/api/complaints/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                setComplaints(data);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch complaints');
            }
        } catch (error) {
            console.error('Fetch complaints error:', error);
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchComplaints();
        }, [fetchComplaints])
    );

    const handleView = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setActionNote('');
        setModalVisible(true);
    };

    const handleResolve = async () => {
        if (!selectedComplaint) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/complaints/admin/${selectedComplaint.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'Resolved',
                    adminNotes: actionNote || undefined
                })
            });

            if (response.ok) {
                Alert.alert('Success', 'Complaint marked as resolved');
                setModalVisible(false);
                fetchComplaints(); // Refresh the list
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to resolve complaint');
            }
        } catch (error) {
            console.error('Resolve complaint error:', error);
            Alert.alert('Error', 'Network error');
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Complaint',
            'Are you sure you want to delete this complaint?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            if (!token) return;

                            const response = await fetch(`${BASE_URL}/api/complaints/admin/${id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            if (response.ok) {
                                Alert.alert('Success', 'Complaint deleted successfully');
                                fetchComplaints(); // Refresh the list
                            } else {
                                const data = await response.json();
                                Alert.alert('Error', data.message || 'Failed to delete complaint');
                            }
                        } catch (error) {
                            console.error('Delete complaint error:', error);
                            Alert.alert('Error', 'Network error');
                        }
                    }
                }
            ]
        );
    };

    const handleWarn = () => {
        if (!selectedComplaint) return;
        Alert.alert('Warning Sent', `Warning sent to ${selectedComplaint.reportedUser}`);
        handleResolve();
    };

    const handleSuspend = () => {
        if (!selectedComplaint) return;
        Alert.alert('User Suspended', `${selectedComplaint.reportedUser} has been suspended`);
        handleResolve();
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#534889" />
                <Text style={styles.loadingText}>Loading complaints...</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Complaint }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.reason}>{item.reason}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Pending' ? '#FEF9E7' : '#E8F8F5' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'Pending' ? '#F39C12' : '#27AE60' }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.details}>
                <Text style={styles.text}>Reporter: <Text style={styles.bold}>{item.reporter}</Text></Text>
                <Text style={styles.text}>Reported: <Text style={styles.bold}>{item.reportedUser}</Text></Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleView(item)}>
                    <MaterialIcons name="visibility" size={18} color="#3498DB" />
                    <Text style={styles.actionText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                    <MaterialIcons name="delete" size={18} color="#E74C3C" />
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={complaints}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.empty}>No complaints found.</Text>}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Complaint Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {selectedComplaint && (
                                <>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Reporter:</Text>
                                        <Text style={styles.detailValue}>{selectedComplaint.reporter}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Reported User:</Text>
                                        <Text style={styles.detailValue}>{selectedComplaint.reportedUser}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Reason:</Text>
                                        <Text style={styles.detailValue}>{selectedComplaint.reason}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Date:</Text>
                                        <Text style={styles.detailValue}>{selectedComplaint.date}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Status:</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: selectedComplaint.status === 'Pending' ? '#FEF9E7' : '#E8F8F5' }]}>
                                            <Text style={[styles.statusText, { color: selectedComplaint.status === 'Pending' ? '#F39C12' : '#27AE60' }]}>
                                                {selectedComplaint.status}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.descriptionLabel}>Description:</Text>
                                    <Text style={styles.description}>{selectedComplaint.description}</Text>

                                    {selectedComplaint.status === 'Pending' && (
                                        <>
                                            <Text style={styles.actionLabel}>Action Notes (Optional):</Text>
                                            <TextInput
                                                style={styles.noteInput}
                                                placeholder="Add notes about the action taken..."
                                                multiline
                                                value={actionNote}
                                                onChangeText={setActionNote}
                                            />

                                            <Text style={styles.actionLabel}>Take Action:</Text>
                                            <View style={styles.actionButtons}>
                                                <TouchableOpacity style={[styles.button, styles.warnButton]} onPress={handleWarn}>
                                                    <Text style={styles.buttonText}>Warn User</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.button, styles.suspendButton]} onPress={handleSuspend}>
                                                    <Text style={styles.buttonText}>Suspend User</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.button, styles.resolveButton]} onPress={handleResolve}>
                                                    <Text style={styles.buttonText}>Mark Resolved</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                </>
                            )}
                        </ScrollView>
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
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    reason: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E74C3C',
        fontFamily: 'Poppins',
    },
    date: {
        fontSize: 12,
        color: '#95A5A6',
        marginTop: 2,
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
    details: {
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 4,
        fontFamily: 'Poppins',
    },
    bold: {
        color: '#2C3E50',
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
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
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: '#95A5A6',
        fontFamily: 'Poppins',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: '90%',
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
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
    },
    detailValue: {
        fontSize: 14,
        color: '#2C3E50',
        fontWeight: '500',
        fontFamily: 'Poppins',
    },
    descriptionLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 15,
        marginBottom: 5,
        fontFamily: 'Poppins',
    },
    description: {
        fontSize: 14,
        color: '#2C3E50',
        lineHeight: 20,
        fontFamily: 'Poppins',
    },
    actionLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 15,
        marginBottom: 10,
        fontFamily: 'Poppins',
        fontWeight: 'bold',
    },
    noteInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        height: 80,
        textAlignVertical: 'top',
        fontFamily: 'Poppins',
        marginBottom: 10,
    },
    actionButtons: {
        gap: 10,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    warnButton: {
        backgroundColor: '#F39C12',
    },
    suspendButton: {
        backgroundColor: '#E67E22',
    },
    resolveButton: {
        backgroundColor: '#27AE60',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
});
