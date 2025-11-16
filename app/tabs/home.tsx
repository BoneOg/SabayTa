import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';

export default function HomeScreen() {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 8.4822,
    longitude: 124.6472,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* User location marker (purple) */}
        <Marker coordinate={region}>
          <View style={styles.locationCircleOuter}>
            <View style={styles.locationCircleMid}>
              <View style={styles.locationCircleInner}>
                <Ionicons name="location" size={32} color="#fff" />
              </View>
            </View>
          </View>
        </Marker>
        <Circle
          center={region}
          radius={400}
          strokeWidth={0}
          fillColor="rgba(98,44,155,0.10)"
        />
      </MapView>
      {/* Hamburger menu */}
      <TouchableOpacity style={styles.menuButton} onPress={() => {/* open drawer/modal */}}>
        <MaterialIcons name="menu" size={30} color="#622C9B" />
      </TouchableOpacity>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color="#540383" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Where would you go?"
          placeholderTextColor="#D0D0D0"
        />
        <TouchableOpacity>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#540383" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }} />
      {/* Bottom Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={22} color="#540383" />
          <Text style={[styles.tabLabel, { color: '#540383' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="heart-outline" size={22} color="#B8B8B8" />
          <Text style={styles.tabLabel}>Favourite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome name="car" size={21} color="#B8B8B8" />
          <Text style={styles.tabLabel}>Offer a ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="time-outline" size={22} color="#B8B8B8" />
          <Text style={styles.tabLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={22} color="#B8B8B8" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 40 : 60 },
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 52 : 64,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    position: 'absolute',
    bottom: 78,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#F8F6FC',
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    elevation: 2,
    marginBottom: 0,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins',
    color: '#414141',
    fontSize: 17,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
  },
  searchIcon: { marginRight: 7 },
  arrowIcon: { marginLeft: 7 },
  locationCircleOuter: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#E5D6F9', alignItems: 'center', justifyContent: 'center'
  },
  locationCircleMid: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#CCB2F2', alignItems: 'center', justifyContent: 'center'
  },
  locationCircleInner: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#622C9B', alignItems: 'center', justifyContent: 'center'
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
    height: 68,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 7,
    shadowColor: '#CCB2F2',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#B8B8B8',
    marginTop: 4,
  },
});
