import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
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
    plateNumber: string;
    motorcycleModel: string;
    documents: {
        driversLicense?: string;
        vehicleORCR?: string;
    };
    applicationStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function DriverApplications() {
    const router = useRouter();
    const [applications, setApplications] = useState<DriverApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    const fetchApplications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/driver-application/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
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

    const filteredApplications = applications.filter(app =>
        filter === 'all' ? true : app.applicationStatus === filter
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
            style={styles.requestCard}
            onPress={() => router.push(`/admin/driver-application-details?id=${item._id}`)}
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
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.applicationStatus) }]}>
                    <Text style={styles.statusText}>{item.applicationStatus.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="motorcycle" size={18} color="#534889" />
                    <Text style={styles.infoText}>{item.motorcycleModel}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialIcons name="credit-card" size={18} color="#534889" />
                    <Text style={styles.infoText}>{item.plateNumber}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>
                    Submitted: {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit'
                    })}
                </Text>
            </View>
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
                        <Text style={styles.emptyText}>No {filter !== 'all' ? filter : ''} driver applications found</Text>
                    </View>
                }
            />
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
        fontWeight: '600',
        color: '#666',
    },
    filterTextActive: {
        color: '#fff',
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
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
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
        marginBottom: 12,
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
    cardFooter: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    dateText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#999',
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
        textAlign: 'center',
    },
});
