import FieldEditModal from '@/components/FieldEditModal';
import ProfileFormFields from '@/components/ProfileFormFields';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileImageSection from '@/components/ProfileImageSection';
import SaveButton from '@/components/SaveButton';
import { BASE_URL } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function DriverEditProfileScreen() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [street, setStreet] = useState('');
    const [barangay, setBarangay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const [vehicleType, setVehicleType] = useState('');
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [modalValue, setModalValue] = useState('');

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
                setName(data.profile.name || '');
                setEmail(data.profile.email || '');
                const phoneNumber = data.profile.phone || '';
                setPhone(phoneNumber.startsWith('+63') ? phoneNumber.substring(3) : phoneNumber);
                setGender(data.profile.gender || '');
                setStreet(data.profile.street || '');
                setBarangay(data.profile.barangay || '');
                setCity(data.profile.city || '');
                setProvince(data.profile.province || '');
                setPostalCode(data.profile.postalCode || '');
                setProfileImage(data.profile.profileImage || '');
                setVehicleType(data.profile.vehicleType || '');
                setVehiclePlateNumber(data.profile.vehiclePlateNumber || '');
                setLicenseNumber(data.profile.licenseNumber || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'Failed to load profile');
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

    const handleSaveChanges = async () => {
        try {
            if (!name || !email || !phone) {
                Alert.alert('Error', 'Name, email, and phone are required');
                return;
            }

            setSaving(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found');
                setSaving(false);
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', `+63${phone}`);
            formData.append('street', street);
            formData.append('barangay', barangay);
            formData.append('city', city);
            formData.append('province', province);
            formData.append('postalCode', postalCode);
            formData.append('vehicleType', vehicleType);
            formData.append('vehiclePlateNumber', vehiclePlateNumber);
            formData.append('licenseNumber', licenseNumber);

            const response = await fetch(`${BASE_URL}/api/driver/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully');
                router.back();
            } else {
                Alert.alert('Error', data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const openFieldModal = (key: string, value: string) => {
        setFocusedField(key);
        setModalValue(value);
    };

    const closeFieldModal = () => {
        setFocusedField(null);
        setModalValue('');
    };

    const saveFieldValue = () => {
        if (focusedField) {
            const setters: { [key: string]: (value: string) => void } = {
                name: setName,
                email: setEmail,
                phone: setPhone,
                gender: setGender,
                street: setStreet,
                barangay: setBarangay,
                city: setCity,
                province: setProvince,
                postalCode: setPostalCode,
                vehicleType: setVehicleType,
                vehiclePlateNumber: (val) => setVehiclePlateNumber(val.toUpperCase()),
                licenseNumber: setLicenseNumber,
            };
            setters[focusedField]?.(modalValue);
        }
        closeFieldModal();
    };

    const getFieldLabel = (key: string) => {
        const labels: { [key: string]: string } = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone Number',
            gender: 'Gender',
            street: 'Street',
            barangay: 'Barangay',
            city: 'City',
            province: 'Province',
            postalCode: 'Postal Code',
            vehicleType: 'Vehicle Type',
            vehiclePlateNumber: 'Plate Number',
            licenseNumber: 'License Number',
        };
        return labels[key] || key;
    };

    const getKeyboardType = (key: string) => {
        if (key === 'email') return 'email-address';
        if (key === 'phone' || key === 'postalCode') return 'phone-pad';
        return 'default';
    };

    const getAutoCapitalize = (key: string) => {
        if (key === 'vehiclePlateNumber') return 'characters';
        return 'sentences';
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#534889" />
            </View>
        );
    }

    const formFields = [
        { key: 'name', label: 'Name', value: name },
        { key: 'email', label: 'Email', value: email },
        { key: 'phone', label: 'Phone Number', value: phone },
        { key: 'gender', label: 'Gender', value: gender },
        { key: 'street', label: 'Street', value: street },
        { key: 'barangay', label: 'Barangay', value: barangay },
        { key: 'city', label: 'City', value: city },
        { key: 'province', label: 'Province', value: province },
        { key: 'postalCode', label: 'Postal Code', value: postalCode },
        { key: 'vehicleType', label: 'Vehicle Type', value: vehicleType },
        { key: 'vehiclePlateNumber', label: 'Plate Number', value: vehiclePlateNumber },
        { key: 'licenseNumber', label: 'License Number', value: licenseNumber },
    ];

    const sections = [
        {
            title: 'Personal Information',
            fieldKeys: ['name', 'email', 'phone', 'gender'],
        },
        {
            title: 'Address',
            fieldKeys: ['street', 'barangay', 'city', 'province', 'postalCode'],
        },
        {
            title: 'Driver Information',
            fieldKeys: ['vehicleType', 'vehiclePlateNumber', 'licenseNumber'],
        },
    ];

    return (
        <View style={styles.container}>
            <ProfileHeader onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.centeredContent}>
                    <ProfileImageSection
                        profileImage={profileImage}
                        name={name}
                        uploading={uploading}
                        onUpdatePhoto={handleUpdatePhoto}
                    />

                    <ProfileFormFields
                        fields={formFields}
                        onFieldPress={openFieldModal}
                        sections={sections}
                    />

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            <SaveButton
                onPress={handleSaveChanges}
                loading={saving}
            />

            <FieldEditModal
                visible={focusedField !== null}
                fieldLabel={focusedField ? getFieldLabel(focusedField) : ''}
                value={modalValue}
                onChangeText={setModalValue}
                onClose={closeFieldModal}
                onSave={saveFieldValue}
                keyboardType={focusedField ? getKeyboardType(focusedField) : 'default'}
                autoCapitalize={focusedField ? getAutoCapitalize(focusedField) : 'sentences'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 20 : 20
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    centeredContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
});
