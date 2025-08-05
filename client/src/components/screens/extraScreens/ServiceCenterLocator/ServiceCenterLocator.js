/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Animated,
  colorScheme
} from 'react-native';
import { COLORS, FONTS } from '../../../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const { width } = Dimensions.get('window');

const ServiceCenterLocator = ({ navigation }) => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [drawerVisible, setDrawerVisible] = useState(false); // State to toggle drawer visibility
  const drawerAnimation = useState(new Animated.Value(-width * 0.4))[0]; // Animation for drawer

  useEffect(() => {
    getMechanics();
  }, []);

  const getMechanics = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please sign in first.');
        return;
      }

      const url = `${Base_Endpoint}/api/users/get-mechanics-with-location`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mechanicsData = response.data.mechanics || [];
      setMechanics(mechanicsData);

      // Set the map region to the first mechanic's location if available
      if (mechanicsData.length > 0) {
        setMapRegion({
          latitude: mechanicsData[0].latitude || 37.78825,
          longitude: mechanicsData[0].longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    if (drawerVisible) {
      // Hide the drawer
      Animated.timing(drawerAnimation, {
        toValue: -width * 0.4,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      // Show the drawer
      setDrawerVisible(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const goToLocation = (latitude, longitude) => {
    setMapRegion({
      latitude: latitude || 30.1575, // Default latitude
      longitude: longitude || 71.5249, // Default longitude
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };


  const renderMechanicItem = ({ item }) => (
    <View style={styles.mechanicRow}>
      <View style={styles.mechanicInfo}>
        <Text style={styles.mechanicName}>{item.full_name}</Text>
        <Text style={styles.mechanicEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => goToLocation(item.latitude, item.longitude)}
      >
        <Feather name="arrow-right" size={20} color={COLORS.lightGray} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Service Center Locator</Text>
        <View />
      </View>


      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <View style={styles.contentContainer}>
          {/* Drawer */}
          <Animated.View
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: drawerAnimation }] },
            ]}
          >
            <FlatList
              data={mechanics}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMechanicItem}
            />
          </Animated.View>

          {/* Map */}
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
          >
            {mechanics.map((mechanic, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: mechanic.latitude || 30.1575, // Default latitude
                  longitude: mechanic.longitude || 71.5249, // Default longitude
                }}
                title={mechanic.full_name}
                description={mechanic.service_name}
              />
            ))}
          </MapView>

          {/* Toggle Drawer Button */}
          <TouchableOpacity
            style={[
              styles.drawerToggle,
              { left: drawerVisible ? '40%' : 0 }, // Adjust position based on drawer visibility
            ]}
            onPress={toggleDrawer}
          >
            <Feather
              name={drawerVisible ? 'chevron-left' : 'chevron-right'}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    backgroundColor: COLORS.primary,
    padding: 10,
    zIndex: 1,
  },
  mechanicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.warning,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  mechanicEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  arrowButton: {
    padding: 5,
  },
  map: {
    flex: 1,
  },
  drawerToggle: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});

export default ServiceCenterLocator;