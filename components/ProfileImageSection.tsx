import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileImageSectionProps {
    profileImage: string;
    name: string;
    uploading: boolean;
    onUpdatePhoto: () => void;
}

export default function ProfileImageSection({
    profileImage,
    name,
    uploading,
    onUpdatePhoto
}: ProfileImageSectionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.profileImageContainer}>
                <Image
                    source={profileImage ? { uri: profileImage } : require('@/assets/images/cat5.jpg')}
                    style={styles.profileImage}
                />
                <TouchableOpacity
                    style={styles.updatePhotoButton}
                    onPress={onUpdatePhoto}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <MaterialIcons name="camera-alt" size={20} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#D0D0D0',
    },
    updatePhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#534889',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        fontFamily: 'Poppins',
    },
});
