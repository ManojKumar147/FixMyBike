/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ServiceCard from './ServiceCard';
import Feather from 'react-native-vector-icons/Feather';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const { width, height } = Dimensions.get('window');

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);

  const navigation = useNavigation();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please sign in first.');
        navigation.replace('Signin');
        return;
      }

      const response = await axios.get(`${Base_Endpoint}/api/shop/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const servicesData = response.data.Services;

      if (!servicesData || servicesData.length === 0) {
        setServices([]);
      } else {
        setServices(servicesData);
        setFilteredServices(servicesData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  useEffect(() => {
    let updatedServices = [...services];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      updatedServices = updatedServices.filter(service => {
        const name = typeof service?.service_name === 'string' ? service.service_name.toLowerCase() : '';
        const price = typeof service?.service_price === 'string' ? service.service_price : service?.service_price?.toString() || '';

        const nameMatches = name.includes(searchQuery.toLowerCase());
        const priceMatches = price.includes(searchQuery);

        return nameMatches || priceMatches;
      });
    }

    // Apply sort
    if (sortOrder === 'asc') {
      updatedServices.sort((a, b) => (parseFloat(a.service_price) || 0) - (parseFloat(b.service_price) || 0));
    } else if (sortOrder === 'desc') {
      updatedServices.sort((a, b) => (parseFloat(b.service_price) || 0) - (parseFloat(a.service_price) || 0));
    }

    setFilteredServices(updatedServices);
  }, [services, searchQuery, sortOrder]);

  const handleSearch = text => {
    setSearchQuery(text);
  };

  const handleEdit = service => {
    navigation.navigate('Edit_Service', { service });
  };

  const handleDelete = async serviceId => {
    Alert.alert('Confirm', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              Alert.alert('Authentication Error', 'Please sign in first.');
              navigation.replace('Signin');
              return;
            }
            await axios.delete(`${Base_Endpoint}/api/shop/services/${serviceId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setServices(prevServices => prevServices.filter(service => service._id !== serviceId));
            Alert.alert('Success', 'Service deleted successfully!');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete service.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Feather name="chevron-left" size={30} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.header}>Service</Text>

        <TouchableOpacity style={styles.addServiceButton} onPress={() => navigation.navigate('Add_Service')}>
          <Feather name="plus" size={20} color={COLORS.white} />
          <Text style={styles.addServiceText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBarContainer, { borderColor: searchBorderColor }]}>
          <Feather name="search" size={width * 0.045} color={COLORS.dark} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInputField, { color: COLORS.dark }]}
            placeholder="Search!"
            placeholderTextColor={COLORS.lightGray}
            onFocus={() => setSearchBorderColor(COLORS.primary)}
            onBlur={() => setSearchBorderColor(COLORS.lightGray)}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.radioButton} onPress={() => setSortOrder('asc')}>
          <View style={styles.radioCircle}>{sortOrder === 'asc' && <View style={styles.selectedRb} />}</View>
          <Text style={styles.radioText}>Lowest to Highest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioButton} onPress={() => setSortOrder('desc')}>
          <View style={styles.radioCircle}>{sortOrder === 'desc' && <View style={styles.selectedRb} />}</View>
          <Text style={styles.radioText}>Highest to Lowest</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : filteredServices.length === 0 ? (
        <Text style={styles.noServiceText}>No services yet.</Text>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => <ServiceCard service={item} onEdit={handleEdit} onDelete={handleDelete} />}
          contentContainerStyle={styles.serviceContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 5,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.white, // Add a background color for better contrast
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    elevation: 3, // Add shadow for a modern look
  },
  iconButton: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: COLORS.white, // Add a background for the back button
    elevation: 2,
  },
  header: {
    fontSize: width * 0.06,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 3, // Add shadow for a button pop effect
  },
  addServiceText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginLeft: 5, // Add spacing between the icon and text
  },
  searchContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
    width: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
  },
  searchInputField: {
    paddingHorizontal: width * 0.03,
    fontFamily: FONTS.semiBold,
    width: width * 0.65,
  },
  searchIcon: {
    marginRight: width * 0.01,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  noServiceText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
});

export default ServiceDashboard;