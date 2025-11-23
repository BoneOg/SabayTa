import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  profilePicture: string;
  gmail: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, profilePicture, gmail }) => {
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current; // start off-screen

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Slide out
      Animated.timing(slideAnim, {
        toValue: -width * 0.6,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Semi-transparent background */}
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />

      {/* Sliding menu */}
      <Animated.View style={[styles.menu, { left: slideAnim }]}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color="#414141" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Profile section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          <Text style={styles.gmail}>{gmail}</Text>
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <FontAwesome name="exclamation-triangle" size={20} color="#414141" />
          </View>
          <Text style={styles.menuText}>Complain</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="info-outline" size={20} color="#414141" />
          </View>
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="settings" size={20} color="#414141" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="help-outline" size={20} color="#414141" />
          </View>
          <Text style={styles.menuText}>Help and Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="logout" size={20} color="#414141" />
          </View>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    flexDirection: 'row',
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: width * 0.6,
    backgroundColor: '#fff',
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#D0D0D0',
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
    color: '#414141',
    marginLeft: 10,
    fontFamily: 'Poppins',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  gmail: {
    fontSize: 14,
    color: '#414141',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    color: '#414141',
    marginLeft: 15,
    fontFamily: 'Poppins',
  },
});

export default SideMenu;
