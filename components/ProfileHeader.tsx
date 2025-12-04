import BackButton from '@/components/ui/BackButton';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileHeaderProps {
    onBack: () => void;
    title?: string;
}

export default function ProfileHeader({ onBack, title = 'Edit Profile' }: ProfileHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.backButtonContainer}>
                <BackButton onPress={onBack} />
            </View>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        position: 'relative',
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
        marginTop: -20,
    },
});
