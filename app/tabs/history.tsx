import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header - Fixed at the top */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuContainer}>
          <MaterialIcons name="menu" size={30} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main Content */}
        <View style={styles.centeredContent}>
          <Text style={styles.infoText}>
            This is your History page. You can display past rides or activities here.
          </Text>
          {/* You can add more UI components here to show history items */}
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
    justifyContent: 'center', // vertically center the text
    alignItems: 'center',     // horizontally center the text
    position: 'relative',
  },

  menuContainer: {
    position: 'absolute',
    left: 20,
    transform: [{ translateY: -22 }],  // Center vertically (half of height 44)
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
