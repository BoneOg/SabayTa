import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SideMenu from './side_menu'; // Adjust path

export default function HistoryScreen() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Active top tab state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

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
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {/* Top Tabs */}
      <View style={styles.topTabs}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as 'upcoming' | 'completed' | 'cancelled')}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.centeredContent}>
          {activeTab === 'upcoming' && (
            <Text style={styles.infoText}>Your upcoming rides will be shown here.</Text>
          )}
          {activeTab === 'completed' && (
            <Text style={styles.infoText}>Your completed rides will be shown here.</Text>
          )}
          {activeTab === 'cancelled' && (
            <Text style={styles.infoText}>Your cancelled rides will be shown here.</Text>
          )}
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
    color: '#000',
    fontFamily: 'Poppins',
  },

  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },

  activeTab: {
    backgroundColor: '#534889', // active tab color
  },

  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#414141',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
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
