import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('John Doe');

  const [selectedRole, setSelectedRole] = useState<'rider' | 'driver'>('rider');

  const menuItems = [
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
      library: Ionicons,
      route: '/user/profile/aboutus',
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
      library: Ionicons,
      route: '/user/profile/helpandsupport',
    },
    {
      icon: 'car-repair',
      text: 'Apply as Driver',
      library: MaterialIcons,
      route: '/driver/apply_as_driver',
      color: '#622C9B',
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

  const handlePress = (route?: Href, replace?: boolean) => {
    if (route) {
      replace ? router.replace(route) : router.push(route);
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

          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {/* Role Toggle Buttons */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedRole === 'rider' ? styles.activeToggle : {},
              ]}
              onPress={() => setSelectedRole('rider')}
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
            // ⭐ FIX: Assign the component (item.library) to a variable that starts with a capital letter
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
                  {/* ⭐ FIX APPLIED HERE: Using the capitalized variable as a component tag */}
                  <IconComponent
                    name={item.icon}
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

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins',
    marginBottom: 10,
  },

  /* ⭐ ROLE TOGGLE BUTTONS ⭐ */
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
    backgroundColor: '#622C9B',
  },

  toggleText: {
    fontSize: 15,
    color: '#622C9B',
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