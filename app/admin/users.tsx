import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'Rider' | 'Driver';
    status: 'Active' | 'Suspended';
    // Documents
    schoolId?: string;
    cor?: string;
    license?: string;
    orCr?: string;
    vehicleInfo?: string;
};

const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '09123456789',
        role: 'Rider',
        status: 'Active',
        schoolId: 'School ID uploaded',
        cor: 'COR uploaded'
    },
    {
        id: '2',
        name: 'Bob Jones',
        email: 'bob@example.com',
        phone: '09123456780',
        role: 'Driver',
        status: 'Active',
        schoolId: 'School ID uploaded',
        cor: 'COR uploaded',
        license: 'License uploaded',
        orCr: 'OR/CR uploaded',
        vehicleInfo: 'Yamaha NMAX 155'
    },
    {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        phone: '09170000000',
        role: 'Driver',
        status: 'Suspended',
        schoolId: 'School ID uploaded',
        cor: 'COR uploaded',
        license: 'License uploaded',
        orCr: 'OR/CR uploaded',
        vehicleInfo: 'Honda Click 160'
    },
];

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Rider' as 'Rider' | 'Driver',
        status: 'Active' as 'Active' | 'Suspended',
        vehicleInfo: ''
    });

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // CREATE
    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', phone: '', role: 'Rider', status: 'Active', vehicleInfo: '' });
        setModalVisible(true);
    };

    // READ - View documents
    const handleViewDocuments = (user: User) => {
        setViewingUser(user);
        setViewModalVisible(true);
    };

    // UPDATE
    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            vehicleInfo: user.vehicleInfo || ''
        });
        setModalVisible(true);
    };

    // DELETE
    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setUsers(users.filter(u => u.id !== id))
                }
            ]
        );
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.phone) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (editingUser) {
            // Update existing user
            setUsers(users.map(u => u.id === editingUser.id ? {
                ...editingUser,
                ...formData,
                vehicleInfo: formData.role === 'Driver' ? formData.vehicleInfo : undefined
            } : u));
        } else {
            // Create new user
            const newUser: User = {
                id: Date.now().toString(),
                ...formData,
                schoolId: 'Pending upload',
                cor: 'Pending upload',
                ...(formData.role === 'Driver' && {
                    license: 'Pending upload',
                    orCr: 'Pending upload',
                })
            };
            setUsers([...users, newUser]);
        }
        setModalVisible(false);
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userDetail}>{item.email}</Text>
                <Text style={styles.userDetail}>{item.phone}</Text>
                {item.role === 'Driver' && item.vehicleInfo && (
                    <Text style={styles.userDetail}>🏍️ {item.vehicleInfo}</Text>
                )}
                <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: item.role === 'Driver' ? '#FEF9E7' : '#EBF5FB' }]}>
                        <Text style={[styles.badgeText, { color: item.role === 'Driver' ? '#F1C40F' : '#2980B9' }]}>
                            {item.role}
                        </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: item.status === 'Active' ? '#E8F8F5' : '#FDEDEC', marginLeft: 8 }]}>
                        <Text style={[styles.badgeText, { color: item.status === 'Active' ? '#27AE60' : '#E74C3C' }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleViewDocuments(item)}>
                    <MaterialIcons name="description" size={20} color="#9B59B6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
                    <MaterialIcons name="edit" size={20} color="#3498DB" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                    <MaterialIcons name="delete" size={20} color="#E74C3C" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color="#95A5A6" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Create Button */}
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={styles.createButtonText}>Add New User</Text>
            </TouchableOpacity>

            {/* User List */}
            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={renderUserItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
            />

            {/* View Documents Modal */}
            <Modal visible={viewModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>User Documents</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {viewingUser && (
                                <>
                                    <Text style={styles.docUserName}>{viewingUser.name}</Text>
                                    <Text style={styles.docUserRole}>{viewingUser.role}</Text>

                                    <View style={styles.docSection}>
                                        <Text style={styles.docSectionTitle}>Student Documents</Text>

                                        <View style={styles.docItem}>
                                            <MaterialIcons name="badge" size={20} color="#534889" />
                                            <View style={styles.docInfo}>
                                                <Text style={styles.docLabel}>School ID</Text>
                                                <Text style={styles.docStatus}>{viewingUser.schoolId || 'Not uploaded'}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.docItem}>
                                            <MaterialIcons name="description" size={20} color="#534889" />
                                            <View style={styles.docInfo}>
                                                <Text style={styles.docLabel}>Certificate of Registration</Text>
                                                <Text style={styles.docStatus}>{viewingUser.cor || 'Not uploaded'}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {viewingUser.role === 'Driver' && (
                                        <View style={styles.docSection}>
                                            <Text style={styles.docSectionTitle}>Driver Documents</Text>

                                            <View style={styles.docItem}>
                                                <MaterialIcons name="credit-card" size={20} color="#F39C12" />
                                                <View style={styles.docInfo}>
                                                    <Text style={styles.docLabel}>Driver's License</Text>
                                                    <Text style={styles.docStatus}>{viewingUser.license || 'Not uploaded'}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.docItem}>
                                                <MaterialIcons name="article" size={20} color="#F39C12" />
                                                <View style={styles.docInfo}>
                                                    <Text style={styles.docLabel}>OR/CR</Text>
                                                    <Text style={styles.docStatus}>{viewingUser.orCr || 'Not uploaded'}</Text>
                                                </View>
                                            </View>

                                            {viewingUser.vehicleInfo && (
                                                <View style={styles.docItem}>
                                                    <MaterialIcons name="two-wheeler" size={20} color="#F39C12" />
                                                    <View style={styles.docInfo}>
                                                        <Text style={styles.docLabel}>Vehicle Information</Text>
                                                        <Text style={styles.docStatus}>{viewingUser.vehicleInfo}</Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setViewModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Create/Edit Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingUser ? 'Edit User' : 'Add New User'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Enter name"
                            />

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholder="Enter email"
                                keyboardType="email-address"
                            />

                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                placeholder="Enter phone"
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Role</Text>
                            <View style={styles.roleButtons}>
                                <TouchableOpacity
                                    style={[styles.roleButton, formData.role === 'Rider' && styles.roleButtonActive]}
                                    onPress={() => setFormData({ ...formData, role: 'Rider' })}
                                >
                                    <Text style={[styles.roleButtonText, formData.role === 'Rider' && styles.roleButtonTextActive]}>Rider</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleButton, formData.role === 'Driver' && styles.roleButtonActive]}
                                    onPress={() => setFormData({ ...formData, role: 'Driver' })}
                                >
                                    <Text style={[styles.roleButtonText, formData.role === 'Driver' && styles.roleButtonTextActive]}>Driver</Text>
                                </TouchableOpacity>
                            </View>

                            {formData.role === 'Driver' && (
                                <>
                                    <Text style={styles.label}>Vehicle Information</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.vehicleInfo}
                                        onChangeText={(text) => setFormData({ ...formData, vehicleInfo: text })}
                                        placeholder="e.g., Yamaha NMAX 155"
                                    />
                                </>
                            )}

                            <Text style={styles.label}>Status</Text>
                            <View style={styles.roleButtons}>
                                <TouchableOpacity
                                    style={[styles.roleButton, formData.status === 'Active' && styles.roleButtonActive]}
                                    onPress={() => setFormData({ ...formData, status: 'Active' })}
                                >
                                    <Text style={[styles.roleButtonText, formData.status === 'Active' && styles.roleButtonTextActive]}>Active</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleButton, formData.status === 'Suspended' && styles.roleButtonActive]}
                                    onPress={() => setFormData({ ...formData, status: 'Suspended' })}
                                >
                                    <Text style={[styles.roleButtonText, formData.status === 'Suspended' && styles.roleButtonTextActive]}>Suspended</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        height: 50,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Poppins',
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: '#534889',
        marginHorizontal: 15,
        marginBottom: 15,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Poppins',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        fontFamily: 'Poppins',
    },
    userDetail: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 2,
        fontFamily: 'Poppins',
    },
    badgeRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#95A5A6',
        fontFamily: 'Poppins',
    },
    // Documents Modal
    docUserName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        fontFamily: 'Poppins',
        marginBottom: 5,
    },
    docUserRole: {
        fontSize: 14,
        color: '#534889',
        fontFamily: 'Poppins',
        marginBottom: 20,
    },
    docSection: {
        marginBottom: 20,
    },
    docSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        fontFamily: 'Poppins',
        marginBottom: 10,
    },
    docItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        marginBottom: 10,
    },
    docInfo: {
        flex: 1,
        marginLeft: 12,
    },
    docLabel: {
        fontSize: 14,
        color: '#2C3E50',
        fontFamily: 'Poppins',
        fontWeight: '500',
    },
    docStatus: {
        fontSize: 12,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
        marginTop: 2,
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
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
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
    label: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 10,
        marginBottom: 5,
        fontFamily: 'Poppins',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        fontFamily: 'Poppins',
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    roleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    roleButtonActive: {
        backgroundColor: '#534889',
        borderColor: '#534889',
    },
    roleButtonText: {
        color: '#7F8C8D',
        fontFamily: 'Poppins',
    },
    roleButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#7F8C8D',
        fontFamily: 'Poppins',
    },
    saveButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#534889',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Poppins',
    },
});
