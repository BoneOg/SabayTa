import { BASE_URL } from '@/config';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DriverDetailsProps {
    onClose?: () => void;
    // Optional props can still be passed to override fetched data
    driverName?: string;
    rating?: number;
    totalRatings?: number;
    phone?: string;
    email?: string;
    vehicleType?: string;
    plateNumber?: string;
    color?: string;
    profileImage?: string;
}

export const DriverDetails = ({
    onClose,
    driverName: propDriverName,
    rating: propRating,
    totalRatings: propTotalRatings,
    phone: propPhone,
    email: propEmail,
    vehicleType: propVehicleType,
    plateNumber: propPlateNumber,
    color: propColor,
    profileImage: propProfileImage
}: DriverDetailsProps) => {
    const router = useRouter();

    // State for fetched details
    const [fetchedProfile, setFetchedProfile] = useState<any>(null);

    useEffect(() => {
        // Fetch profile to populate missing data
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${BASE_URL}/api/driver/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.profile) {
                        setFetchedProfile(data.profile);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch driver details:", error);
            }
        };
        fetchProfile();
    }, []);

    // Derived values: Props > Fetched > Default
    const name = propDriverName ?? fetchedProfile?.name ?? "Your Driver";
    const rating = propRating ?? fetchedProfile?.averageRating ?? 5.0;
    const totalRatings = propTotalRatings ?? fetchedProfile?.totalRatings ?? 0;
    const phone = propPhone ?? fetchedProfile?.phone ?? "N/A";
    const email = propEmail ?? fetchedProfile?.email ?? "N/A";
    const vehicleType = propVehicleType ?? fetchedProfile?.vehicleType ?? "Motorcycle";
    const plateNumber = propPlateNumber ?? fetchedProfile?.vehiclePlateNumber ?? "N/A";
    const color = propColor ?? fetchedProfile?.vehicleColor ?? "N/A";
    const profileImage = propProfileImage ?? fetchedProfile?.profileImage;

    const handleBack = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Driver Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Driver Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('@/assets/images/icon.png')}
                        style={styles.driverImage}
                    />
                    <Text style={styles.driverName}>{name}</Text>
                    <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={16} color="#FFC107" />
                        <Text style={styles.ratingText}>{typeof rating === 'number' ? rating.toFixed(1) : rating} ({totalRatings} reviews)</Text>
                    </View>
                </View>

                {/* Vehicle Information Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome name="motorcycle" size={24} color="#622C9B" />
                        <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    </View>

                    <View style={styles.vehicleDetailsCard}>
                        <View style={styles.vehicleInfoContainer}>
                            <View style={styles.vehicleInfoRow}>
                                <Text style={styles.vehicleLabel}>Vehicle Type:</Text>
                                <Text style={styles.vehicleValue}>{vehicleType}</Text>
                            </View>
                            <View style={styles.vehicleInfoRow}>
                                <Text style={styles.vehicleLabel}>Color:</Text>
                                <Text style={styles.vehicleValue}>{color}</Text>
                            </View>
                            <View style={styles.vehicleInfoRow}>
                                <Text style={styles.vehicleLabel}>Plate Number:</Text>
                                <Text style={styles.vehicleValue}>{plateNumber}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Contact Information Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="phone" size={24} color="#622C9B" />
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                    </View>

                    {/* Email */}
                    <TouchableOpacity style={styles.contactCard}>
                        <View style={styles.contactIconContainer}>
                            <MaterialCommunityIcons name="email" size={20} color="#622C9B" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Email</Text>
                            <Text style={styles.contactValue}>{email}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>

                    {/* Phone */}
                    <TouchableOpacity style={styles.contactCard}>
                        <View style={styles.contactIconContainer}>
                            <MaterialCommunityIcons name="phone" size={20} color="#622C9B" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Phone</Text>
                            <Text style={styles.contactValue}>{phone}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Statistics Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        {/* We use fetched 'totalRatings' as a proxy for completed rides for now if 'completedRides' is missing */}
                        <Text style={styles.statNumber}>{totalRatings || 0}</Text>
                        <Text style={styles.statLabel}>Completed Rides</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>100%</Text>
                        <Text style={styles.statLabel}>Acceptance Rate</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{typeof rating === 'number' ? rating.toFixed(1) : rating}</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Report Driver Button */}
                <TouchableOpacity style={styles.reportButton}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#E35A5A" />
                    <Text style={styles.reportButtonText}>Report Driver</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f5f5f5',
        zIndex: 1000,
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'android' ? 15 : 10,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    backButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    profileSection: {
        backgroundColor: '#fff',
        paddingVertical: 30,
        alignItems: 'center',
        marginBottom: 15,
    },
    driverImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#622C9B',
    },
    driverName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    sectionContainer: {
        marginBottom: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    vehicleDetailsCard: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
    },
    vehicleInfoContainer: {
        padding: 15,
    },
    vehicleInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    vehicleLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    vehicleValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
    },
    contactCard: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    contactIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0e6f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#622C9B',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    reportButton: {
        marginHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#E35A5A',
    },
    reportButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E35A5A',
    },
});
