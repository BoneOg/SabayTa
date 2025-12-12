import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BASE_URL } from '../../config';

interface DashboardStats {
    totalUsers: number;
    activeDrivers: number;
    completedRides: number;
    pendingComplaints: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                setLoading(false);
                Alert.alert('Error', 'No authentication token found');
                return;
            }

            console.log('Fetching dashboard stats...');
            const response = await fetch(`${BASE_URL}/api/profile/admin/dashboard/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            console.log('Dashboard stats response:', data);

            if (response.ok) {
                setStats(data);
            } else {
                console.error('Dashboard stats error:', data);
                Alert.alert('Error', data.message || 'Failed to fetch dashboard stats');
            }
        } catch (error) {
            console.error('Fetch stats error:', error);
            Alert.alert('Error', 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchStats();
        }, [fetchStats])
    );

    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    const statsData = stats ? [
        { label: 'Total Users', value: formatNumber(stats.totalUsers), icon: 'people', color: '#4A90E2', description: 'Riders + Drivers' },
        { label: 'Approved Drivers', value: formatNumber(stats.activeDrivers), icon: 'two-wheeler', color: '#2ECC71', description: 'Verified drivers' },
        { label: 'Completed Rides', value: formatNumber(stats.completedRides), icon: 'check-circle', color: '#9B59B6', description: 'All time' },
        { label: 'Pending Complaints', value: formatNumber(stats.pendingComplaints), icon: 'report-problem', color: '#E74C3C', description: 'Awaiting review' },
    ] : [];

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#534889" />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Admin Dashboard</Text>
                <Text style={styles.subGreeting}>Quick overview of your system</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
                {statsData.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: stat.color + '20' }]}>
                            <MaterialIcons name={stat.icon as any} size={28} color={stat.color} />
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={styles.statDescription}>{stat.description}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
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
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 25,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        fontFamily: 'Poppins',
    },
    subGreeting: {
        fontSize: 16,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
        marginTop: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        alignItems: 'center',
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50',
        fontFamily: 'Poppins',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#2C3E50',
        fontFamily: 'Poppins',
        textAlign: 'center',
        fontWeight: '600',
    },
    statDescription: {
        fontSize: 11,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginTop: 4,
    },
});
