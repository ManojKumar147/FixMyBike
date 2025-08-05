import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  Image,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ServiceCenterLocator = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // State for modal visibility and selected marker details
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Marker coordinates
  const markers = [
    { id: 1, name: 'Multan FIX MY BIKE Service Center', latitude: 30.1575, longitude: 71.5249, timing: '9:00 AM - 6:00 PM', phone: '+9x 3xx 1234567' },
    { id: 2, name: 'Lahore FIX MY BIKE Service Center', latitude: 31.5204, longitude: 74.3587, timing: '10:00 AM - 7:00 PM', phone: '+9x 3xx 7654321' },
    { id: 3, name: 'Karachi FIX MY BIKE Service Center', latitude: 24.8607, longitude: 67.0011, timing: '9:00 AM - 6:00 PM', phone: '+9x 3xx 2345678' },
    { id: 4, name: 'Islamabad FIX MY BIKE Service Center', latitude: 33.6844, longitude: 73.0479, timing: '10:00 AM - 8:00 PM', phone: '+9x 3xx 8765432' },
    { id: 5, name: 'Peshawar FIX MY BIKE Service Center', latitude: 34.0151, longitude: 71.5249, timing: '8:00 AM - 5:00 PM', phone: '+9x 3xx 3456789' },
    { id: 6, name: 'Quetta FIX MY BIKE Service Center', latitude: 30.1798, longitude: 66.9750, timing: '9:30 AM - 6:30 PM', phone: '+9x 3xx 9876543' },
    { id: 7, name: 'Faisalabad FIX MY BIKE Service Center', latitude: 31.4504, longitude: 73.1350, timing: '9:00 AM - 7:00 PM', phone: '+9x 3xx 4567890' },
    { id: 8, name: 'Hyderabad FIX MY BIKE Service Center', latitude: 25.3960, longitude: 68.3578, timing: '9:00 AM - 6:00 PM', phone: '+9x 3xx 6543210' },
    { id: 9, name: 'Sialkot FIX MY BIKE Service Center', latitude: 32.4945, longitude: 74.5229, timing: '10:00 AM - 6:00 PM', phone: '+9x 3xx 5678901' },
    { id: 10, name: 'Rawalpindi FIX MY BIKE Service Center', latitude: 33.6007, longitude: 73.0679, timing: '9:00 AM - 6:00 PM', phone: '+9x 3xx 0987654' },
  ];
  

  const openModal = (marker) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMarker(null);
  };

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: 30.3753,
            longitude: 69.3451,
            latitudeDelta: 6,
            longitudeDelta: 6,
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              onPress={() => openModal(marker)}
            >
              <View style={styles.markerWrapper}>
                <View style={styles.markerCircle}>
                  <Image
                    source={require('../../../../assets/png/mechanic.png')} // Replace with your custom image path
                    style={styles.markerIcon}
                  />
                </View>
                <Text style={styles.markerText}>{marker.name}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Modal */}
      {selectedMarker && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedMarker.name}</Text>
              <Text style={styles.modalText}>Timing: {selectedMarker.timing}</Text>
              <Text style={styles.modalText}>Phone: {selectedMarker.phone}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
};

export default ServiceCenterLocator;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },
  modalContainer: {
   
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },


  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  markerText: {
    marginBottom: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
