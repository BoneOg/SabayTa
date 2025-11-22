import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SideMenu from './side_menu'; // Adjust path if needed

export default function FavoritesScreen() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Side menu state

  return (
    <View style={styles.container}>
      {/* Side Menu */}
      <SideMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        profilePicture="https://example.com/pic.jpg"
        gmail="user@gmail.com"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuContainer} 
          onPress={() => setIsMenuVisible(true)}
        >
          <MaterialIcons name="menu" size={30} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourite</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.centeredContent}>
          <Text style={styles.infoText}>
            This is your Favourite page. You can display the list of favorite items here.
          </Text>
          {/* Add favorite items here */}
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
  },
  menuContainer: {
    position: 'absolute',
    left: 20,
    transform: [{ translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(198,185,229,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
  },
  headerTitle: {
    fontSize: 24,
    color: '#000000',
    fontFamily: 'Poppins',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  centeredContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#414141',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
});
