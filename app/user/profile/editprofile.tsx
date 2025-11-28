import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function EditProfileScreen() {
    const router = useRouter();

    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.backButtonContainer}>
                    <BackButton onPress={() => router.back()} />
                </View>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Centered Content */}
                <View style={styles.centeredContent}>
                    <Image
                        source={require('@/assets/images/cat5.jpg')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>{name}</Text>

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#D0D0D0"
                        keyboardType="email-address"
                    />

                    <View style={styles.rowInput}>
                        <View style={styles.countryCodeBox}>
                            <Text style={styles.countryCode}>🇵🇭 +63</Text>
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Phone Number"
                            placeholderTextColor="#D0D0D0"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        value={gender}
                        onChangeText={setGender}
                        placeholder="Gender"
                        placeholderTextColor="#D0D0D0"
                    />

                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Address"
                        placeholderTextColor="#D0D0D0"
                        multiline
                    />

                    <Button
                        label="Save Changes"
                        onPress={() => router.back()}
                        style={{ marginTop: 30, marginBottom: 30, backgroundColor: '#622C9B' }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 20 : 20
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        flexDirection: 'row',
    },
    backButtonContainer: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 20,
        color: '#000000',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    centeredContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        backgroundColor: '#D0D0D0',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        fontFamily: 'Poppins',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#414141',
        backgroundColor: '#F8F8F8',
        fontFamily: 'Poppins',
        marginBottom: 15,
    },
    rowInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    countryCodeBox: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginRight: 8,
        backgroundColor: '#fff',
    },
    countryCode: {
        fontFamily: 'Poppins',
        color: '#414141',
        fontSize: 15,
    },
    phoneInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#414141',
        backgroundColor: '#F8F8F8',
        fontFamily: 'Poppins',
    },
});
