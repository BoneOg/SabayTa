import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  profilePicture?: ImageSourcePropType;
  gmail?: string;
}

const defaultProfile = require('@/assets/images/cat5.jpg');

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, profilePicture = defaultProfile }) => {
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -width * 0.75,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const resolvedImage = profilePicture || defaultProfile;

  const menuItems: {
    icon: string;
    text: string;
    library: typeof FontAwesome | typeof MaterialIcons | typeof Ionicons;
    route?: Href;
    replace?: boolean;
  }[] = [
      {
        icon: 'exclamation-triangle',
        text: 'Complain',
        library: FontAwesome,
        route: '/user/sidebar/complain',
      },
      { icon: 'info-outline', text: 'About Us', library: MaterialIcons, route: '/user/sidebar/aboutus' },
      {
        icon: 'settings',
        text: 'Settings',
        library: MaterialIcons,
        route: '/user/sidebar/settings',
      },
      {
        icon: 'help-outline',
        text: 'Help and Support',
        library: MaterialIcons,
        route: '/user/sidebar/helpandsupport',
      },
      {
        icon: 'logout',
        text: 'Logout',
        library: MaterialIcons,
        route: '/auth/Welcome',
        replace: true,
      },
    ];

  const handlePress = (route?: Href, replace?: boolean) => {
    onClose();
    if (route) {
      if (replace) {
        router.replace(route);
      } else {
        router.push(route);
      }
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Semi-transparent background */}
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />

      {/* Sliding menu */}
      <Animated.View style={[styles.menu, { left: slideAnim }]}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#414141" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Profile section */}
        <View style={styles.profileSection}>
          <Image source={resolvedImage} style={styles.profilePicture} resizeMode="cover" />
        </View>

        {/* Menu Items */}
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.menuItem}
            onPress={() => handlePress(item.route, item.replace)}
          >
            <View style={styles.iconContainer}>
              <item.library name={item.icon as any} size={20} color="#414141" />
            </View>
            <Text style={styles.menuText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: width * 0.75,
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D0D0D0',
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
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    flex: 1,
  },
});

export default SideMenu;
