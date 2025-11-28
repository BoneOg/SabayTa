import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Users', value: '1,234', icon: 'people', color: '#4A90E2', description: 'Riders + Drivers' },
        { label: 'Active Drivers', value: '150', icon: 'two-wheeler', color: '#2ECC71', description: 'Currently active' },
        { label: 'Completed Rides', value: '5,678', icon: 'check-circle', color: '#9B59B6', description: 'All time' },
        { label: 'Complaints', value: '12', icon: 'report-problem', color: '#E74C3C', description: 'Pending review' },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Admin Dashboard</Text>
                <Text style={styles.subGreeting}>Quick overview of your system</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
                {stats.map((stat, index) => (
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

            {/* System Status */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>System Status</Text>
                <View style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <MaterialIcons name="check-circle" size={20} color="#2ECC71" />
                        <Text style={styles.statusText}>All systems operational</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <MaterialIcons name="update" size={20} color="#3498DB" />
                        <Text style={styles.statusText}>Last updated: Just now</Text>
                    </View>
                </View>
            </View>

            {/* Quick Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Management Sections</Text>
                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <MaterialIcons name="people" size={20} color="#4A90E2" />
                        <Text style={styles.infoText}>Users: Manage riders and drivers</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialIcons name="two-wheeler" size={20} color="#2ECC71" />
                        <Text style={styles.infoText}>Rides: Monitor motorcycle rides</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialIcons name="report-problem" size={20} color="#E74C3C" />
                        <Text style={styles.infoText}>Complaints: Handle user complaints</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
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
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
        fontFamily: 'Poppins',
    },
    statusCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        elevation: 2,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 14,
        color: '#34495E',
        fontFamily: 'Poppins',
        marginLeft: 10,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        elevation: 2,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#34495E',
        fontFamily: 'Poppins',
        marginLeft: 12,
    },
});
