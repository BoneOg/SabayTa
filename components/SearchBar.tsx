import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    fromLocation: any;
    toLocation: any;
    onPress: () => void;
}

export const SearchBar = ({ fromLocation, toLocation, onPress }: SearchBarProps) => {
    return (
        <TouchableOpacity style={styles.destinationContainer} onPress={onPress}>
            <View style={styles.destinationInputWrapper}>
                <Ionicons name="search" size={20} color="#534889" />
                <Text style={styles.destinationPlaceholder} numberOfLines={1} ellipsizeMode="tail">
                    {fromLocation && toLocation
                        ? `${fromLocation.name} to ${toLocation.name}`
                        : 'Where would you like to go?'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    destinationContainer: {
        position: 'absolute',
        bottom: 80,
        left: 12,
        right: 12,
        borderRadius: 14,
        backgroundColor: '#F8F6FC',
        borderWidth: 1.5,
        borderColor: '#D0D0D0',
        height: 55,
        justifyContent: 'center',
        elevation: 2,
        paddingHorizontal: 16
    },
    destinationInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    destinationPlaceholder: {
        color: '#a2a2a2ff',
        fontSize: 16,
        marginLeft: 8,
        flex: 1
    },
});
