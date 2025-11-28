import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('John Doe');

  const menuItems: {
    icon: string;
    text: string;
    library: typeof FontAwesome | typeof MaterialIcons | typeof Ionicons;
    route?: Href;
    replace?: boolean;
    color?: string;
  }[] = [
      {
        icon: 'edit',
        text: 'Edit Profile',
        library: MaterialIcons,
        route: '/user/profile/editprofile',
      },
      {
        icon: 'exclamation-triangle',
        text: 'Complain',
        library: FontAwesome,
        route: '/user/profile/complain',
      },
      {
        icon: 'info-outline',
        text: 'About Us',
        library: MaterialIcons,
        route: '/user/profile/aboutus'
      },
      {
        icon: 'settings',
        text: 'Settings',
        library: MaterialIcons,
        route: '/user/profile/settings',
      },
      {
        icon: 'help-outline',
        text: 'Help and Support',
        library: MaterialIcons,
        route: '/user/profile/helpandsupport',
      },
      {
        icon: 'logout',
        text: 'Logout',
        library: MaterialIcons,
        route: '/auth/Welcome',
        replace: true,
        color: '#FF3B30', // Red color for logout
      },
    ];

  const handlePress = (route?: Href, replace?: boolean) => {
    if (route) {
      if (replace) {
        router.replace(route);
      } else {
        router.push(route);
      }
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
          <Image
            source={require('@/assets/images/cat5.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              onPress={() => handlePress(item.route, item.replace)}
            >
              <View style={[styles.iconContainer, item.color ? { backgroundColor: item.color + '10' } : {}]}>
                <item.library name={item.icon as any} size={22} color={item.color || "#414141"} />
              </View>
              <Text style={[styles.menuText, item.color ? { color: item.color } : {}]}>{item.text}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D0D0D0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 10 : 20
  },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#D0D0D0',
  },
  nameContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20, // Added padding to prevent text cutoff
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
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
