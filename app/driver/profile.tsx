import { BASE_URL } from '@/config';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DriverProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [selectedRole, setSelectedRole] = useState<'rider' | 'driver'>('driver');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch(`${BASE_URL}/api/driver/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.profile) {
                setName(data.profile.name || 'John Doe');
                setEmail(data.profile.email || '');
                setPhone(data.profile.phone || '');
                setProfileImage(data.profile.profileImage || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need camera roll permissions to update your photo');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setUploading(true);
                const imageUri = result.assets[0].uri;

                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'No authentication token found');
                    setUploading(false);
                    return;
                }

                const formData = new FormData();
                formData.append('profileImage', {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: 'profile.jpg',
                } as any);

                const response = await fetch(`${BASE_URL}/api/driver/profile/photo`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    setProfileImage(data.profileImage);
                    Alert.alert('Success', 'Profile photo updated successfully');
                } else {
                    Alert.alert('Error', data.message || 'Failed to update photo');
                }
            }
        } catch (error) {
            console.error('Error updating photo:', error);
            Alert.alert('Error', 'Failed to update photo');
        } finally {
            setUploading(false);
        }
    };

    const menuItems = [
        {
            icon: 'edit',
            text: 'Edit Profile',
            library: MaterialIcons,
            route: '/driver/profile/editprofile', // Assuming driver specific edit
        },
        {
            icon: 'settings',
            text: 'Settings',
            library: MaterialIcons,
            route: '/driver/profile/settings',
        },
        {
            icon: 'logout',
            text: 'Logout',
            library: MaterialIcons,
            route: '/auth/Welcome',
            replace: true,
            color: '#FF3B30',
        },
    ];

    const handlePress = (route?: string, replace?: boolean) => {
        if (route) {
            // Cast route to Href<string> or any to satisfy the type checker if needed, 
            // but string usually works with router.push if it matches a valid route.
            replace ? router.replace(route as Href) : router.push(route as Href);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Profile Info */}
                <View style={styles.profileSection}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#534889" style={{ marginVertical: 20 }} />
                    ) : (
                        <>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={profileImage ? { uri: profileImage } : require('@/assets/images/cat5.jpg')}
                                    style={styles.profileImage}
                                />
                                <TouchableOpacity
                                    style={styles.updatePhotoButton}
                                    onPress={handleUpdatePhoto}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <MaterialIcons name="camera-alt" size={20} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.name} numberOfLines={1}>
                                {name}
                            </Text>

                            {/* Email and Phone Subtext */}
                            <Text style={styles.subText}>{email}</Text>
                            <Text style={styles.subText}>{phone}</Text>
                        </>
                    )}

                    {/* Role Toggle Buttons */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedRole === 'rider' ? styles.activeToggle : {},
                            ]}
                            onPress={() => {
                                setSelectedRole('rider');
                                router.push("/user/home"); // Navigate to user home
                            }}
                        >
                            <Text
                                style={[
                                    styles.toggleText,
                                    selectedRole === 'rider' ? styles.activeToggleText : {},
                                ]}
                            >
                                Rider
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedRole === 'driver' ? styles.activeToggle : {},
                            ]}
                            onPress={() => setSelectedRole('driver')}
                        >
                            <Text
                                style={[
                                    styles.toggleText,
                                    selectedRole === 'driver' ? styles.activeToggleText : {},
                                ]}
                            >
                                Driver
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, idx) => {
                        const IconComponent = item.library;

                        return (
                            <TouchableOpacity
                                key={idx}
                                style={styles.menuItem}
                                onPress={() => handlePress(item.route, item.replace)}
                            >
                                <View
                                    style={[
                                        styles.iconContainer,
                                        item.color ? { backgroundColor: item.color + '10' } : {},
                                    ]}
                                >
                                    <IconComponent
                                        name={item.icon as any}
                                        size={22}
                                        color={item.color || '#414141'}
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.menuText,
                                        item.color ? { color: item.color } : {},
                                    ]}
                                >
                                    {item.text}
                                </Text>

                                <MaterialIcons name="chevron-right" size={24} color="#D0D0D0" />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 20 : 20,
    },

    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },

    headerTitle: {
        fontSize: 19,
        color: '#000',
        fontFamily: 'Poppins',
    },

    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 100,
    },

    profileSection: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    profileImageContainer: {
        position: 'relative',
        marginBottom: 12,
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    updatePhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#534889',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },

    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Poppins',
        marginBottom: 5,
    },

    subText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins',
        marginBottom: 3,
    },

    /* ROLE TOGGLE BUTTONS */
    toggleContainer: {
        flexDirection: 'row',
        marginTop: 5,
        backgroundColor: '#f1e8ff',
        padding: 5,
        borderRadius: 25,
    },

    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 60,
        borderRadius: 20,
    },

    activeToggle: {
        backgroundColor: '#534889',
    },

    toggleText: {
        fontSize: 15,
        color: '#534889',
        fontFamily: 'Poppins',
    },

    activeToggleText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    /* MENU */
    menuContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },

    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins',
    },
});
