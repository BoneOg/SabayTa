import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CustomDrawerContent(props: any) {
    const router = useRouter();

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
            <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>SabayTa Admin</Text>
                <Text style={styles.drawerSubtitle}>Management Panel</Text>
            </View>

            <DrawerItemList {...props} />

            <View style={styles.separator} />

            <DrawerItem
                label="Switch to User View"
                icon={({ color, size }) => <MaterialIcons name="person" size={size} color={color} />}
                onPress={() => router.replace('/user/profile')}
                labelStyle={styles.drawerLabel}
                activeTintColor="#622C9B"
                inactiveTintColor="#333"
            />
        </DrawerContentScrollView>
    );
}

export default function AdminLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#fff',
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#F0F0F0',
                    },
                    headerTintColor: '#622C9B',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontFamily: 'Poppins',
                    },
                    drawerActiveTintColor: '#622C9B',
                    drawerInactiveTintColor: '#555',
                    drawerLabelStyle: {
                        fontFamily: 'Poppins',
                        fontSize: 15,
                    },
                    drawerItemStyle: {
                        paddingLeft: 10,
                    },
                    drawerType: 'front',
                }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'Dashboard',
                        title: 'Dashboard',
                        drawerIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
                    }}
                />
                <Drawer.Screen
                    name="users"
                    options={{
                        drawerLabel: 'Users',
                        title: 'Manage Users',
                        drawerIcon: ({ color, size }) => <MaterialIcons name="people" size={size} color={color} />,
                    }}
                />
                <Drawer.Screen
                    name="rides"
                    options={{
                        drawerLabel: 'Rides',
                        title: 'Manage Rides',
                        drawerIcon: ({ color, size }) => <MaterialIcons name="two-wheeler" size={size} color={color} />,
                    }}
                />
                <Drawer.Screen
                    name="complaints"
                    options={{
                        drawerLabel: 'Complaints',
                        title: 'Manage Complaints',
                        drawerIcon: ({ color, size }) => <MaterialIcons name="report-problem" size={size} color={color} />,
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 10,
    },
    drawerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#622C9B',
        fontFamily: 'Poppins',
    },
    drawerSubtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    drawerLabel: {
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
