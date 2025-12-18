import { BASE_URL } from '@/config';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [userRole, setUserRole] = useState<string>('user');



  // 🔥 NEW STATE FOR LOGOUT MODAL
  const [logoutVisible, setLogoutVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
    checkVerificationStatus();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserRole(user.role || 'user');

      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const checkVerificationStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${BASE_URL}/api/student-verification/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const requestData = data.request || data.verification;
        if (
          requestData &&
          requestData.verificationStatus === 'verified'
        ) {
          setIsVerified(true);
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  const menuItems = [
    {
      icon: 'edit',
      text: 'Edit Profile',
      library: MaterialIcons,
      route: '/user/profile/editprofile',
    },
    {
      icon: 'verified-user',
      text: 'Student Verification',
      library: MaterialIcons,
      route: '/user/profile/studentverification',
    },
    {
      icon: 'info-outline',
      text: 'About Us',
      library: MaterialIcons,
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
      library: MaterialIcons,
      route: '/user/profile/helpandsupport',
    },
    {
      icon: 'sports-motorsports',
      text: 'Apply as Driver',
      library: MaterialIcons,
      route: '/user/profile/apply_as_driver',
      color: '#534889',
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

  // 🔥 UPDATED HANDLEPRESS FOR LOGOUT CONFIRMATION
  const handlePress = (route?: string, replace?: boolean) => {
    if (!route) return;

    if (route === '/auth/Welcome') {
      setLogoutVisible(true);
      return;
    }

    if (replace) {
      router.replace(route as any);
    } else {
      router.push(route as any);
    }
  };

  // 🔥 LOGOUT FUNCTION
  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.replace('/auth/Welcome');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Unable to logout');
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
            <ActivityIndicator
              size="large"
              color="#534889"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <>
              <View style={styles.profileImageContainer}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require('@/assets/images/cat5.jpg')
                  }
                  style={styles.profileImage}
                />
              </View>

              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>

              {/* Verified Badge */}
              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color="#534889" />
                  <Text style={styles.verifiedText}>Verified Student</Text>
                </View>
              )}

              <Text style={styles.subText}>{email}</Text>
              <Text style={styles.subText}>{phone}</Text>
            </>
          )}


        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems
            .filter(item =>
              item.text === 'Apply as Driver' ? isVerified : true
            )
            .map((item, idx) => {
              const IconComponent = item.library;

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.menuItem}
                  onPress={() =>
                    handlePress(item.route, item.replace)
                  }
                >
                  <View
                    style={[
                      styles.iconContainer,
                      item.color
                        ? { backgroundColor: item.color + '10' }
                        : {},
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

                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#D0D0D0"
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>

      {/* 🔥 LOGOUT CONFIRMATION MODAL */}
      {logoutVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.logoutBtn]}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },

  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    position: 'relative',
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

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1e8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    gap: 5,
  },

  verifiedText: {
    fontSize: 13,
    color: '#534889',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },



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

  /* 🔥 MODAL STYLES */
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },

  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 15,
    color: '#444',
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },

  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },

  cancelBtn: {
    backgroundColor: '#E5E5E5',
    marginRight: 10,
  },

  logoutBtn: {
    backgroundColor: '#FF3B30',
    marginLeft: 10,
  },

  cancelText: {
    color: '#333',
    fontFamily: 'Poppins',
    fontSize: 15,
  },

  logoutText: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontSize: 15,
  },
});
