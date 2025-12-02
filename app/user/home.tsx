import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const { height, width } = Dimensions.get('window');

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

interface SelectedLocation {
  lat: number;
  lon: number;
  name: string;
}

const CDO_COORDS = {
  latitude: 8.4590,
  longitude: 124.6322,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
const MINDANAO_BBOX = {
  minLon: 121.5, // West
  minLat: 5.0,   // South
  maxLon: 127.5, // East
  maxLat: 9.5    // North
};

export default function HomeScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<any>(null);
  const [draggedRegion, setDraggedRegion] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const pinSelectionAnim = useRef(new Animated.Value(height)).current;
  const mapRef = useRef<MapView>(null);

  const toFieldRef = useRef<TextInput>(null);
  const fromFieldRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const isManualSearch = useRef(false);

  const [fromText, setFromText] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<NominatimResult[]>([]);
  const [toText, setToText] = useState('');
  const [toSuggestions, setToSuggestions] = useState<NominatimResult[]>([]);
  const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(null);
  const [toLocation, setToLocation] = useState<SelectedLocation | null>(null);
  const [isModalFull, setIsModalFull] = useState(false);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [tripDetails, setTripDetails] = useState<{ distance: string; duration: string } | null>(null);
  const [selectingLocation, setSelectingLocation] = useState<'from' | 'to' | null>(null);

  // New Search Modal State
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState<'from' | 'to' | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<NominatimResult[]>([]);
  const searchInputRef = useRef<TextInput>(null);

  // Force refresh


  // ====================================================================
  // LOCATION TRACKING
  // ====================================================================
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied. Defaulting to Cagayan de Oro.');
        setRegion(CDO_COORDS);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        const initialRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(initialRegion);

        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 1 },
          (location) => {
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        );
      } catch (e) {
        console.error("Could not get current position, staying at default region.", e);
      }
    };

    startLocationTracking();
    return () => subscription?.remove();
  }, []);

  // ====================================================================
  // HELPER FUNCTIONS
  // ====================================================================
  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data?.display_name ?? 'Unknown Location';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unknown Location';
    }
  };

  // ====================================================================
  // LOCATION SEARCH FUNCTIONS
  // ====================================================================
  const fetchSuggestions = async (
    text: string,
    setSuggestions: React.Dispatch<React.SetStateAction<NominatimResult[]>>
  ) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${text}&limit=10&viewbox=${MINDANAO_BBOX.minLon},${MINDANAO_BBOX.maxLat},${MINDANAO_BBOX.maxLon},${MINDANAO_BBOX.minLat}&bounded=1`;

      const response = await fetch(url);
      const data: NominatimResult[] = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    (text: string, setSuggestions: React.Dispatch<React.SetStateAction<NominatimResult[]>>) => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      searchTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(text, setSuggestions);
      }, 500);
    },
    []
  );

  const checkAndShrinkModal = (from: SelectedLocation | null, to: SelectedLocation | null) => {
    if (from && to) {
      Animated.timing(slideAnim, {
        toValue: height * 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsModalFull(false));
    }
  };

  const handleFromTextChange = (text: string) => {
    setFromText(text);
    setFromLocation(null);
    debouncedFetchSuggestions(text, setFromSuggestions);
  };

  const selectFromLocation = (item: NominatimResult) => {
    const selected = {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      name: item.display_name,
    };
    setFromLocation(selected);
    setFromText(item.display_name);
    setFromSuggestions([]);
    checkAndShrinkModal(selected, toLocation);
    toFieldRef.current?.focus();
  };

  const handleToTextChange = (text: string) => {
    setToText(text);
    setToLocation(null);
    debouncedFetchSuggestions(text, setToSuggestions);
  };

  const selectToLocation = (item: NominatimResult) => {
    const selected = {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      name: item.display_name,
    };
    setToLocation(selected);
    setToText(item.display_name);
    setToSuggestions([]);
    checkAndShrinkModal(fromLocation, selected);
  };

  const openSearchModal = (type: 'from' | 'to') => {
    setActiveSearchField(type);
    setSearchText(type === 'from' ? fromText : toText);
    setSearchSuggestions([]); // Clear previous suggestions or fetch new ones if needed
    setSearchModalVisible(true);
    // Focus happens automatically via autoFocus on the TextInput in the new modal
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    debouncedFetchSuggestions(text, setSearchSuggestions);
  };

  const clearSearchText = () => {
    setSearchText('');
    setSearchSuggestions([]);
    searchInputRef.current?.focus();
  };

  const selectLocationFromSearch = (item: NominatimResult) => {
    const selected = {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      name: item.display_name,
    };

    if (activeSearchField === 'from') {
      setFromLocation(selected);
      setFromText(item.display_name);
      checkAndShrinkModal(selected, toLocation);
    } else {
      setToLocation(selected);
      setToText(item.display_name);
      checkAndShrinkModal(fromLocation, selected);
    }

    setSearchModalVisible(false);
    setActiveSearchField(null);
  };

  const useCurrentLocation = async () => {
    if (!region) return;
    const address = await getAddressFromCoords(region.latitude, region.longitude);
    const selected = { lat: region.latitude, lon: region.longitude, name: address };

    if (activeSearchField === 'from') {
      setFromLocation(selected);
      setFromText(address);
      checkAndShrinkModal(selected, toLocation);
    } else {
      setToLocation(selected);
      setToText(address);
      checkAndShrinkModal(fromLocation, selected);
    }
    setSearchModalVisible(false);
    setActiveSearchField(null);
  };

  const openDropPin = () => {
    if (!activeSearchField) return;

    setSearchModalVisible(false);
    // Close the main modal temporarily to show map
    setModalVisible(false);

    setSelectingLocation(activeSearchField);

    // Animate pin selection UI up
    Animated.timing(pinSelectionAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const cancelDropPin = () => {
    closePinSelection(() => {
      // Re-open search modal
      setModalVisible(true); // Ensure main modal is technically "open" (background)
      setSearchModalVisible(true);
    });
  };

  const handleInputFocus = (type: 'from' | 'to') => {
    // Instead of focusing directly, open the new search modal
    openSearchModal(type);
  };

  const closePinSelection = (callback?: () => void) => {
    Animated.timing(pinSelectionAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSelectingLocation(null);
      if (callback) callback();
    });
  };

  const confirmPinLocation = async () => {
    if (!selectingLocation || !draggedRegion) return;

    const address = await getAddressFromCoords(draggedRegion.latitude, draggedRegion.longitude);
    const selected = { lat: draggedRegion.latitude, lon: draggedRegion.longitude, name: address };

    if (selectingLocation === 'from') {
      setFromLocation(selected);
      setFromText(address);
    } else {
      setToLocation(selected);
      setToText(address);
    }

    closePinSelection(() => {
      setModalVisible(true);
    });
  };

  const switchToManualSearch = () => {
    // This function is effectively replaced by cancelDropPin but kept for safety or if needed elsewhere
    cancelDropPin();
  };

  const fetchRoute = useCallback(async (start: SelectedLocation, end: SelectedLocation) => {
    try {
      const response = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRouteCoords(coordinates);

        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
            animated: true,
          });
        }

        // Calculate distance and duration
        const distKm = (data.routes[0].distance / 1000).toFixed(1);
        const durMins = Math.round(data.routes[0].duration / 60);
        setTripDetails({
          distance: `${distKm} km`,
          duration: `${durMins} mins`
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      // Fallback to straight line if API fails
      setRouteCoords([
        { latitude: start.lat, longitude: start.lon },
        { latitude: end.lat, longitude: end.lon }
      ]);
    }
  }, []);

  useEffect(() => {
    if (fromLocation && toLocation) {
      fetchRoute(fromLocation, toLocation);
    }
  }, [fromLocation, toLocation, fetchRoute]);

  const handleConfirmLocation = () => {
    if (fromLocation && toLocation) {
      console.log("Confirmed Trip Details:", fromLocation, toLocation);
      fetchRoute(fromLocation, toLocation);
      closeModal();

      // Navigate to b
      router.push({
        pathname: '/user/booking-details',
        params: {
          from: fromLocation.name,
          to: toLocation.name,
          fromLat: fromLocation.lat,
          fromLon: fromLocation.lon,
          toLat: toLocation.lat,
          toLon: toLocation.lon,
          distance: tripDetails?.distance || '0 km',
          time: tripDetails?.duration || '0 mins'
        }
      });
    } else {
      alert("Please select both From and To locations.");
    }
  };

  // ====================================================================
  // MODAL ANIMATIONS
  // ====================================================================
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsModalFull(false));
  };

  const slideToTop = () => {
    Animated.timing(slideAnim, {
      toValue: height * 0.2,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsModalFull(true));
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setModalVisible(false);
      setIsModalFull(false);
      setFromSuggestions([]);
      setToSuggestions([]);
    });
  };

  const centerOnLocation = () => {
    if (mapRef.current && region) {
      mapRef.current.animateToRegion(
        { ...region, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        300
      );
    }
  };

  if (!region) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Fetching location, defaulting to Mindanao...</Text>
      </SafeAreaView>
    );
  }

  // ====================================================================
  // RENDER
  // ====================================================================
  return (
    <View style={{ flex: 1 }}>

      <SafeAreaView style={styles.container}>
        {/* MAP */}
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={region} // <-- only sets initial position
          showsMyLocationButton={false}
          onRegionChangeComplete={(r) => setDraggedRegion(r)}
          userInterfaceStyle="light"
        >
          {/* User location marker - Hide if From location is selected */}
          {!fromLocation && (
            <Marker coordinate={region}>
              <View style={styles.userMarker}>
                <Ionicons name="location-sharp" size={24} color="#fff" />
              </View>
            </Marker>
          )}

          {/* FROM/TO route Polyline */}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#534889" // line color
              strokeWidth={5}       // line thickness
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Optional: Markers for FROM and TO */}
          {fromLocation && (
            <Marker coordinate={{ latitude: fromLocation.lat, longitude: fromLocation.lon }} title="From">
              <View style={[styles.userMarker, { backgroundColor: "#534889" }]}>
                <Ionicons name="location-sharp" size={24} color="#fff" />
              </View>
            </Marker>
          )}
          {toLocation && (
            <Marker coordinate={{ latitude: toLocation.lat, longitude: toLocation.lon }} title="To">
              <View style={[styles.userMarker, { backgroundColor: "#EA4335" }]}>
                <Ionicons name="location-sharp" size={24} color="#fff" />
              </View>
            </Marker>
          )}
        </MapView>

        {/* CENTER PIN FOR SELECTION */}
        {selectingLocation && (
          <View style={styles.centerPinContainer} pointerEvents="none">
            <Ionicons name="location-sharp" size={40} color={selectingLocation === 'from' ? "#534889" : "#EA4335"} />
          </View>
        )}

        {/* PIN SELECTION UI (Slide Up) */}
        {selectingLocation && (
          <Animated.View style={[styles.pinSelectionContainer, { transform: [{ translateY: pinSelectionAnim }] }]}>
            <Text style={styles.pinSelectionText}>
              Drag map to select {selectingLocation === 'from' ? "Pickup" : "Drop-off"} Location
            </Text>
            <View style={styles.pinSelectionButtons}>
              <TouchableOpacity style={styles.secondaryButton} onPress={cancelDropPin}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={confirmPinLocation}>
                <Text style={styles.primaryButtonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* BUTTONS */}
        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/user/notification')}>
          <Ionicons name="notifications-outline" size={24} color="#000000ff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.locationButton, selectingLocation && { bottom: 200 }]}
          onPress={centerOnLocation}
        >
          <Ionicons name="locate" size={24} color="#534889" />
        </TouchableOpacity>

        {/* SEARCH BAR */}
        {/* SEARCH BAR */}
        {!selectingLocation && (
          <TouchableOpacity style={styles.destinationContainer} onPress={openModal}>
            <View style={styles.destinationInputWrapper}>
              <Ionicons name="search" size={20} color="#534889" />
              <Text style={styles.destinationPlaceholder} numberOfLines={1} ellipsizeMode="tail">
                {fromLocation && toLocation ? `${fromLocation.name} to ${toLocation.name}` : 'Where would you like to go?'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* MODAL */}
        {modalVisible && (
          <View style={StyleSheet.absoluteFill}>
            <TouchableOpacity style={styles.dimBackground} activeOpacity={1} onPress={closeModal} />
            <Animated.View style={[styles.modalContainer, { top: slideAnim }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Address</Text>
                <TouchableOpacity onPress={closeModal}>
                  <FontAwesome name="close" size={22} color="#414141" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* FROM INPUT */}
                <View style={{ position: 'relative', marginBottom: 10 }}>
                  <TouchableOpacity style={styles.inputWithIcon} onPress={() => openSearchModal('from')}>
                    <MaterialIcons name="my-location" size={20} color="#494949ff" style={{ marginRight: 8 }} />
                    <Text style={[styles.input, { paddingVertical: 12 }]}>
                      {fromText || "From"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* TO INPUT */}
                <View style={{ position: 'relative', marginTop: 10 }}>
                  <TouchableOpacity style={styles.inputWithIcon} onPress={() => openSearchModal('to')}>
                    <Ionicons name="location-outline" size={20} color="#494949ff" style={{ marginRight: 8 }} />
                    <Text style={[styles.input, { paddingVertical: 12 }]}>
                      {toText || "To"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {!isModalFull && fromLocation && toLocation && (
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                  <Text style={styles.confirmButtonText}>Confirm Location</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
        )}

        {/* NEW SEARCH MODAL */}
        {searchModalVisible && (
          <View style={styles.fullScreenModal}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.searchModalHeader}>
                <TouchableOpacity onPress={() => setSearchModalVisible(false)} style={styles.closeSearchButton}>
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.searchModalTitle}>
                  {activeSearchField === 'from' ? "Set Pickup Location" : "Set Drop Off Location"}
                </Text>
              </View>

              <View style={styles.searchInputContainer}>
                <View style={styles.searchInputWrapper}>
                  <Ionicons name="search" size={20} color="#534889" style={{ marginRight: 8 }} />
                  <TextInput
                    ref={searchInputRef}
                    style={styles.searchInput}
                    placeholder="Search location"
                    value={searchText}
                    onChangeText={handleSearchTextChange}
                    autoFocus={true}
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity onPress={clearSearchText}>
                      <Ionicons name="close-circle" size={20} color="#a2a2a2" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.currentLocationRow} onPress={useCurrentLocation}>
                <View style={styles.currentLocationIcon}>
                  <MaterialIcons name="my-location" size={22} color="#534889" />
                </View>
                <Text style={styles.currentLocationText}>Use my current location</Text>
              </TouchableOpacity>

              <ScrollView style={styles.searchResultsList} keyboardShouldPersistTaps="handled">
                {searchSuggestions.map((item) => (
                  <TouchableOpacity key={item.place_id} style={styles.searchResultItem} onPress={() => selectLocationFromSearch(item)}>
                    <View style={styles.searchResultIcon}>
                      <Ionicons name="location-outline" size={20} color="#414141" />
                    </View>
                    <Text style={styles.searchResultText}>{item.display_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
              >
                <TouchableOpacity style={styles.chooseMapButton} onPress={openDropPin}>
                  <Ionicons name="map-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.chooseMapText}>Choose from map</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  notificationButton: { position: 'absolute', right: 20, top: 30, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(198,185,229,0.5)', alignItems: 'center', justifyContent: 'center' },
  userMarker: {
    backgroundColor: "#534889",
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  locationButton: { position: 'absolute', bottom: 150, right: 12, width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8F6FC', borderWidth: 1.5, borderColor: '#D0D0D0', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  destinationContainer: { position: 'absolute', bottom: 80, left: 12, right: 12, borderRadius: 14, backgroundColor: '#F8F6FC', borderWidth: 1.5, borderColor: '#D0D0D0', height: 55, justifyContent: 'center', elevation: 2, paddingHorizontal: 16 },
  destinationInputWrapper: { flexDirection: 'row', alignItems: 'center' },
  destinationPlaceholder: { color: '#a2a2a2ff', fontSize: 16, marginLeft: 8, flex: 1 },
  dimBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  modalContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 15, paddingBottom: 20, zIndex: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 15 },
  modalTitle: { fontSize: 18, textAlign: 'center', flex: 1, marginTop: 8 },
  input: { flex: 1, fontSize: 16, color: '#414141', paddingVertical: 8 },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 10, paddingHorizontal: 12, height: 45, backgroundColor: '#F8F8F8' },
  myLocationButton: { marginLeft: 8, padding: 5 },
  suggestionsContainer: { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 5 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#ebebeb', backgroundColor: '#fff' },
  suggestionText: { fontSize: 14, color: '#414141', flex: 1 },
  confirmButton: { backgroundColor: '#534889', padding: 14, borderRadius: 14, marginHorizontal: 0, marginBottom: 10, alignItems: 'center', justifyContent: 'center', bottom: 70 },
  confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  centerPinContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  pinSelectionContainer: { position: 'absolute', bottom: 80, left: 12, right: 12, backgroundColor: 'white', padding: 15, borderRadius: 14, elevation: 10, alignItems: 'center', zIndex: 1000, borderWidth: 1.5, borderColor: '#D0D0D0' },
  pinSelectionText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  pinSelectionButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 10 },
  primaryButton: { flex: 1, backgroundColor: '#534889', padding: 12, borderRadius: 10, alignItems: 'center' },
  primaryButtonText: { color: 'white', fontWeight: 'bold' },
  secondaryButton: { flex: 1, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 10, alignItems: 'center' },
  secondaryButtonText: { color: '#333', fontWeight: 'bold' },
  fullScreenModal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 2000 },
  searchModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeSearchButton: { padding: 5 },
  searchModalTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  searchInputContainer: { padding: 15, paddingBottom: 10 },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 12, height: 45 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  currentLocationRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  currentLocationIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8F6FC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  currentLocationText: { fontSize: 16, color: '#333', fontWeight: '500' },
  searchResultsList: { flex: 1 },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  searchResultIcon: { marginRight: 12 },
  searchResultText: { fontSize: 15, color: '#333' },
  keyboardAvoidingContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  chooseMapButton: { flexDirection: 'row', backgroundColor: '#534889', padding: 15, alignItems: 'center', justifyContent: 'center', margin: 15, borderRadius: 12 },
  chooseMapText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
