/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../../constants/Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather'; // Import Feather icons
import ServicesContainer from '../../../utils/ServicesCard/ServicesCard';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const ServiceManagement = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('Signin');
          return;
        }

        const response = await axios.get(
          `${Base_Endpoint}/api/shop/all/services`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const services = response.data.Items;
        setServices(services);
        setFilteredServices(services);
      } catch (error) {
        console.log('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let tempServices = [...services];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      tempServices = tempServices.filter(service =>
        service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parseFloat(service.service_price) <= parseFloat(searchQuery)
      );
    }

    // Apply sorting
    if (sortOrder === 'asc') {
      tempServices.sort((a, b) => parseFloat(a.service_price) - parseFloat(b.service_price));
    } else if (sortOrder === 'desc') {
      tempServices.sort((a, b) => parseFloat(b.service_price) - parseFloat(a.service_price));
    }

    setFilteredServices(tempServices);
  }, [searchQuery, sortOrder, services]);

  const handleSearch = text => {
    setSearchQuery(text);
  };

  const renderServiceItem = ({ item }) => (
    <ServicesContainer
      service_image={item.Img}
      service_name={item.service_name}
      service_description={item.service_description}
      service_price={item.service_price.toString()}
      isTouchable={false}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather
            name="chevron-left"
            size={30}
            color={COLORS.dark}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Services</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Feather
            name="search"
            size={20}
            color={COLORS.dark}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInputField}
            placeholder="Search services..."
            placeholderTextColor={COLORS.lightGray}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Sorting Options */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSortOrder('asc')}
        >
          <View style={styles.radioCircle}>
            {sortOrder === 'asc' && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Lowest to Highest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSortOrder('desc')}
        >
          <View style={styles.radioCircle}>
            {sortOrder === 'desc' && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Highest to Lowest</Text>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      <View style={styles.serviceContainer}>
        {isSearching ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.dark} />
          </View>
        ) : (
          <FlatList
          data={filteredServices}
          keyExtractor={item => item.id}
          renderItem={renderServiceItem}
          contentContainerStyle={styles.fullScreenList} // Full-screen styling
        />
        )}
      </View>
    </View>
  );
};

export default ServiceManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 40,
  },
  headerText: {
    fontSize: 28,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },
  serviceContainer: {
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fullScreenList: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});