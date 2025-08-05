/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Alert, TextInput, Keyboard,
  colorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COLORS } from '../../../constants/Constants';
import MapView, { Marker } from 'react-native-maps';
import Feather from 'react-native-vector-icons/Feather';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_LAT = 28.46254;
const INITIAL_LNG = -81.397272;
const INITIAL_POSITION = {
  latitude: INITIAL_LAT,
  longitude: INITIAL_LNG,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const Map = ({ navigation }) => {
    
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const map = useRef();

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log(latitude,longitude,'current location selected');
    setSelectedLocation({ latitude, longitude });
  };

  const saveShopLocation = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map first.');
      return;
    }

    const { latitude, longitude } = selectedLocation;
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please sign in first.');
        navigation.replace('Signin');
        return;
      }

      const response = await axios.put(
        `${Base_Endpoint}/api/shop/set-coordinates`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', response.data.message);
    } catch (error) {
      console.error('Error saving coordinates:', error);
      Alert.alert('Error', 'Failed to save coordinates.');
    }
  };

  const searchPlaces = async () => {
    if (!searchText.trim().length) return;
  
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText.trim())}`;
  
    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'FixMyBikeApp/1.0 (arshad300390@gmail.com)', // Replace with your app name and email
        },
      });
  
      // Check if the response is valid JSON
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
  
      const json = await resp.json();
  
      if (json && json.length > 0) {
        const firstResult = json[0];
        const latitude = parseFloat(firstResult.lat);
        const longitude = parseFloat(firstResult.lon);
  
        setSelectedLocation({
          latitude,
          longitude,
          title: firstResult.display_name,
        });
  
        map.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          1000
        );
  
        Keyboard.dismiss();
      } else {
        Alert.alert('No Results', 'No matching location found.');
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      Alert.alert('Error', 'Failed to fetch location data. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Back Button and Search */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchText}
          value={searchText}
          autoCapitalize='sentences'
          placeholder="Search location..."
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchPlaces}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Map */}
      <MapView
        ref={map}
        style={styles.map}
        initialRegion={INITIAL_POSITION}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={selectedLocation.title}
            description={searchText}
          />
        )}
      </MapView>

      {/* Bottom Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveShopLocation}>
          <Text style={styles.saveButtonText}>Save Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 3,
  },
  saveButton: {
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
