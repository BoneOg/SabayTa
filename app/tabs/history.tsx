import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SideMenu from './side_menu';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RideEntry {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  role: 'Driver' | 'Passenger';
  status?: 'Cancelled';
}

const rideData: { [key: string]: RideEntry[] } = {
  upcoming: [
    { id: '1', date: 'Oct 5, 2025', pickup: 'Bulua', dropoff: 'Main Campus', role: 'Driver' },
    { id: '2', date: 'Oct 5, 2025', pickup: 'Main Campus', dropoff: 'Carmen', role: 'Passenger' },
    { id: '3', date: 'Oct 5, 2025', pickup: 'Carmen', dropoff: 'Campus', role: 'Passenger' },
  ],
  completed: [
    { id: '4', date: 'Oct 7, 2025', pickup: 'Starbright Kauswagan', dropoff: 'Main Campus', role: 'Passenger' },
    { id: '5', date: 'Oct 1, 2025', pickup: 'Kauswagan', dropoff: 'Downtown', role: 'Passenger' },
    { id: '6', date: 'Sept 17, 2025', pickup: 'Bulua', dropoff: 'Main Campus', role: 'Driver' },
    { id: '7', date: 'Sept 13, 2025', pickup: 'Carmen', dropoff: 'Main Campus', role: 'Driver' },
    { id: '8', date: 'Sept 7, 2025', pickup: 'Cugman', dropoff: 'Main Campus', role: 'Passenger' },
  ],
  cancelled: [
    { id: '9', date: 'Oct 5, 2025', pickup: 'Starbright Kauswagan', dropoff: 'Main Campus', role: 'Driver', status: 'Cancelled' },
    { id: '10', date: 'Oct 2, 2025', pickup: 'Carmen', dropoff: 'Main Campus', role: 'Passenger', status: 'Cancelled' },
  ],
};

export default function HistoryScreen() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Active top tab state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  
  // Animation for sliding indicator
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const tabs = ['upcoming', 'completed', 'cancelled'];
  
  const handleTabPress = (tab: 'upcoming' | 'completed' | 'cancelled') => {
    const tabIndex = tabs.indexOf(tab);
    const tabWidth = tabContainerWidth / tabs.length;
    const newPosition = tabIndex * tabWidth;
    
    Animated.timing(slideAnim, {
      toValue: newPosition,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setActiveTab(tab);
  };

  // Initialize position when container width is measured
  useEffect(() => {
    if (tabContainerWidth > 0) {
      const tabIndex = tabs.indexOf(activeTab);
      const tabWidth = tabContainerWidth / tabs.length;
      slideAnim.setValue(tabIndex * tabWidth);
    }
  }, [tabContainerWidth]);

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
      <View style={styles.topTabsContainer}>
        <View 
          style={styles.topTabs}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setTabContainerWidth(width);
          }}
        >
          {/* Animated sliding indicator */}
          {tabContainerWidth > 0 && (
            <Animated.View
              style={[
                styles.slidingIndicator,
                {
                  width: tabContainerWidth / tabs.length,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            />
          )}
          
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab as 'upcoming' | 'completed' | 'cancelled')}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {rideData[activeTab].length > 0 ? (
          <View style={styles.ridesContainer}>
            {rideData[activeTab].map((ride) => (
              <View key={ride.id} style={styles.rideCard}>
                <View style={styles.rideContent}>
                  <View style={styles.rideInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={18} color="#414141" />
                      <Text style={styles.rideInfoText}>{ride.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="location" size={18} color="#4CAF50" />
                      <Text style={styles.rideInfoText}>{ride.pickup}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="location" size={18} color="#F44336" />
                      <Text style={styles.rideInfoText}>{ride.dropoff}</Text>
                    </View>
                  </View>
                  <View style={styles.rideMeta}>
                    <Text style={styles.roleText}>{ride.role}</Text>
                    {ride.status && (
                      <Text style={styles.statusText}>{ride.status}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.centeredContent}>
            <Text style={styles.infoText}>
              {activeTab === 'upcoming' && 'Your upcoming rides will be shown here.'}
              {activeTab === 'completed' && 'Your completed rides will be shown here.'}
              {activeTab === 'cancelled' && 'Your cancelled rides will be shown here.'}
            </Text>
          </View>
        )}
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
    fontWeight: 'bold',
  },

  topTabsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },

  topTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(198,185,229,0.3)',
    borderRadius: 12,
    position: 'relative',
  },

  slidingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#534889',
    borderRadius: 8,
    zIndex: 0,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  ridesContainer: {
    gap: 12,
  },

  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(198,185,229,0.5)',
    padding: 15,
  },

  rideContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  rideInfo: {
    flex: 1,
    gap: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  rideInfoText: {
    fontSize: 14,
    color: '#414141',
    fontFamily: 'Poppins',
  },

  infoText: {
    fontSize: 16,
    color: '#414141',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },

  rideMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },

  roleText: {
    fontSize: 14,
    color: '#414141',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },

  statusText: {
    fontSize: 14,
    color: '#F44336',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },

  centeredContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
});
