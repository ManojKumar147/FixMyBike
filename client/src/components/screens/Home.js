/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../constants/Constants';
import Feather from 'react-native-vector-icons/Feather';
import imgPlaceHolder from '../../assets/placeholders/default-avatar.png';
import ServicesContainer from '../utils/ServicesCard/ServicesCard';
import ScheduleCard from '../utils/SheduleCard/SheduleCard';
import SellerDashboard from './extraScreens/SellerScreens/SellerDashboard';
import { requestUserPermission, getFcmToken } from './../../../notificationService';

import { getMessaging, onMessage, onBackgroundMessage } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import AdminDashboard from './extraScreens/AdminDashboard/AdminDashboard';
import BASE_URL from '../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const { width, height } = Dimensions.get('window');

const Home = ({ setUser: updateUser }) => {

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [user, setUser] = useState('');
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [notSchedule, setNotSchedule] = useState(0);
  const [customServices, setCustomServices] = useState([]);
  const [rating, setRating] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [filteredServices, setFilteredServices] = useState([]);
  //notification

  useEffect(() => {
    requestUserPermission();
    getFcmToken(); // Call the function to get the FCM token
    //notificationListener(); //listener but without this full working

  }, []);
  const messaging = getMessaging(getApp());


  useEffect(() => {
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      console.log('FCM Message Data:', remoteMessage);

      // Handle the notification here
      Alert.alert(
        remoteMessage.notification?.title || 'New FCM Message',
        remoteMessage.notification?.body || JSON.stringify(remoteMessage)
      );
    });

    return () => {
      // Clean up the foreground message listener
      unsubscribe();
    };
  }, []);



  //end notification
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('Signin');
          return;
        }

        const response = await axios.get(
          `${Base_Endpoint}/api/users/get-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const user = response.data.User;
        const ratingData = user.rating[0].rating;
        if (ratingData) {
          setRating(parseFloat(user.rating[0].rating).toFixed(2));
        }
        if (user && user.full_name) {
          setName(user.full_name);
        } else {
          console.log('Full Name Not Found In Response');
        }

        if (user && user.profile_image) {
          setImage(user.profile_image);
        } else {
          console.log('Profile Image not found in response');
        }

        if (user && user.role) {
          setRole(user.role);
          updateUser(user.role);
          if (user.role === 'customer') {
            // oilChange();
            getAllServices();
          }
        } else {
          console.log('Role Not Found In Response');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
        navigation.replace('Signin');
      }
    };

    fetchUserData();
  }, [navigation]);



  const getAllServices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('jwt token', token);
        navigation.replace('Signin');
        return;
      }

      const response = await axios.get(
        `${Base_Endpoint}/api/shop/all/services`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomServices(response.data.Items);
    } catch (error) {
      console.log('Error fetching  change data:', error);
    }
  };

  useEffect(() => {
    const fetchScheduleRequests = async () => {
      if (role && role === 'mechanic') {
        try {
          const token = await AsyncStorage.getItem('token');

          const response = await axios.get(`${Base_Endpoint}/api/to-schedule`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const resData = response.data;
          setNotSchedule(resData.count);
          setLoading(false);
        } catch (error) {
          console.error('Error -fetching schedule requests:', error);
        }
      }
    };

    fetchScheduleRequests();
    const intervalId = setInterval(() => {
      fetchScheduleRequests();
    }, 9000);

    return () => {
      clearInterval(intervalId);
    };
  }, [role]);


  const services = [
    {
      id: '1',
      Img:
        'https://cdn.dealerspike.com/imglib/seo/stock/ps/ps_bike_mechanic_a.jpg',
      service_name: 'Basic Inspection and Safety Checks',
      service_description:
        'Quick inspection of essential parts, fluid levels, and tire pressure adjustment.',
      service_price: '200',
      custom: false,
    },
    {
      id: '2',
      Img:
        'https://th.bing.com/th/id/R.2a777d5b415a819f3ac3542922df3df1?rik=sc1oKFyTje2e9A&pid=ImgRaw&r=0',
      service_name: 'Battery and Electrical System Check',
      service_description:
        'Battery testing and replacement, terminal cleaning, headlight, taillight, and indicator check.',
      service_price: '250',
      custom: false,
    },
    {
      id: '3',
      Img:
        'https://th.bing.com/th/id/OIP.JR8YkKNYvBdN7kpm4R_xqQHaEK?rs=1&pid=ImgDetMain',
      service_name: 'Cleaning and Detailing Services',
      service_description:
        'Full bike wash, detailing, polishing, waxing, rust removal, and prevention.',
      service_price: '300',
      custom: false,
    },
    {
      id: '4',
      Img:
        'https://th.bing.com/th/id/R.f4362e6fb570750fc1e8d1aba6d0be8b?rik=wL6028BFJxJ2Vw&pid=ImgRaw&r=0&sres=1&sresct=1',
      service_name: 'Pre-ride Inspection for Long Trips',
      service_description:
        'Comprehensive check for long journeys, including fluids, brakes, and lighting.',
      service_price: '300',
      custom: false,
    },
    {
      id: '5',
      Img:
        'https://th.bing.com/th/id/OIP.DT5JvbSS2XEp46EAgEImkQHaE6?rs=1&pid=ImgDetMain',
      service_name: 'Chain and Sprocket Maintenance',
      service_description:
        'Chain cleaning, lubrication, tension adjustment, and sprocket inspection.',
      service_price: '300',
      custom: false,
    },
    {
      id: '6',
      Img:
        'https://th.bing.com/th/id/R.30ccb893250467820b3a0816c7a5324d?rik=te4wHb5Hez4yzg&pid=ImgRaw&r=0',
      service_name: 'Fuel System Services',
      service_description:
        'Fuel filter replacement, carburetor cleaning, fuel line inspection for leaks or clogs.',
      service_price: '400',
      custom: false,
    },
    {
      id: '7',
      Img:
        'https://m.media-amazon.com/images/I/81SFFJHpEVL.jpg',
      service_name: 'Exhaust System Check',
      service_description:
        'Exhaust pipe inspection for leaks, cleaning, rust prevention, muffler servicing.',
      service_price: '350',
      custom: false,
    },
    {
      id: '8',
      Img:
        'https://th.bing.com/th/id/OIP.2YZjkYJ1EghXIfybOX3pzQHaEK?rs=1&pid=ImgDetMain',
      service_name: 'Engine Maintenance',
      service_description:
        'Oil change, oil filter replacement, spark plug replacement, air filter cleaning.',
      service_price: '600',
      custom: false,
    },
    {
      id: '9',
      Img:
        'https://th.bing.com/th/id/OIP.iSSb2EXFkzfmD5XoqQrHMQHaE8?rs=1&pid=ImgDetMain',
      service_name: 'Tire and Wheel Services',
      service_description:
        'Tire replacement and balancing, puncture repair, tread depth check, wheel alignment.',
      service_price: '500',
      custom: false,
    },
    {
      id: '10',
      Img:
        'https://thumbs.dreamstime.com/b/motorbike-mechanic-replacing-cooling-radiator-replacement-radiator-maintenance-motorbike-mechanic-replacing-cooling-154095399.jpg',
      service_name: 'Cooling System Maintenance',
      service_description:
        'Radiator and coolant check, coolant flush, and hose inspection.',
      service_price: '450',
      custom: false,
    },
    {
      id: '11',
      Img:
        'https://th.bing.com/th/id/OIP.ToBKyziCrwl5w02R3h0mrgHaE5?rs=1&pid=ImgDetMain',
      service_name: 'Suspension Services',
      service_description:
        'Front and rear suspension adjustment, fork oil change, shock absorber inspection.',
      service_price: '800',
      custom: false,
    },
    {
      id: '12',
      Img:
        'https://th.bing.com/th/id/OIP.7_xsLQ5V0sm4zZI93GwdIQHaFi?rs=1&pid=ImgDetMain',
      service_name: 'Comprehensive Diagnostic Check',
      service_description:
        'Full diagnostics for engine, brakes, exhaust, and electrical systems.',
      service_price: '1000',
      custom: false,
    },
    {
      id: '13',
      Img:
        'https://th.bing.com/th/id/OIP.Y59CgLVJSoFNM3D6OEzumQHaD4?rs=1&pid=ImgDetMain',
      service_name: 'Customization and Upgrades',
      service_description:
        'Accessory installation, performance upgrades, paint and decal services.',
      service_price: '1500',
      custom: false,
    },
    {
      id: '14',
      Img:
        'https://th.bing.com/th/id/R.7a88474dcfc940971ae72abf742f6d00?rik=0Aiexy0aFKgo8w&riu=http%3a%2f%2fwww.johnmason.com%2fwp-content%2fuploads%2f2011%2f06%2fmotorbike-004.jpg&ehk=aFTtFonUMU2Ag4OyLjB2eyOxtbRRAjv0N5j8joENbgk%3d&risl=&pid=ImgRaw&r=0',
      service_name: 'Winterization and Storage Preparation',
      service_description:
        'Fuel stabilizer application, battery storage prep, and full cover for off-season storage.',
      service_price: '550',
      custom: false,
    },
  ];
  //
  const combinedServices = useMemo(
    () => [...services, ...customServices],
    [services, customServices]
  );

  useEffect(() => {
    let tempServices = [...combinedServices];

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
  }, [searchQuery, sortOrder, customServices]);

  const handleSearch = text => {
    setSearchQuery(text);
  };
  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.greetingContainer}>
              <Text
                style={[
                  styles.greeting,
                  { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                ]}>
                Hello,
              </Text>
              <Text
                style={[
                  styles.name,
                  { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                ]}>
                {name}
              </Text>
            </View>
            <Text
              style={[
                styles.description,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Have A Nice Day!
            </Text>
            <Text
              style={[
                styles.description,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              ({role})  {rating && (role === 'mechanic' || role === 'seller') ? <Text style={styles.ratingText}>Rating: {rating}</Text> : null}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { role })}>
            <View style={styles.rightContainer}>
              <View style={styles.imgContainer}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.img} />
                ) : (
                  <Image source={imgPlaceHolder} style={styles.img} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {
          role === 'mechanic' ? (
            notSchedule === undefined || notSchedule === null ? (
              <Text>Loading  not schedule...</Text> // Show a loading message or spinner
            ) : (
              <>
                <ScheduleCard notSchedule={notSchedule} navigation={navigation} />
                <View style={[styles.card, { height: height * 0.63 }]}>
                  {/* <ServiceDashboard /> */}
                  <TouchableOpacity
                    style={styles.gotoDashboard}
                    onPress={() => navigation.navigate('ServiceDashboard')}>
                    <Text style={styles.cardText}>Go to Service Dashboard</Text>
                  </TouchableOpacity>
                </View>
              </>
            )
          )
            : role === 'customer' ? (
              <>
                <View style={styles.searchContainer}>
                  <View
                    style={[
                      styles.searchBarContainer,
                      { borderColor: searchBorderColor },
                    ]}>
                    <Feather
                      name="search"
                      size={width * 0.045}
                      color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={[
                        styles.searchInputField,
                        { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                      ]}
                      placeholder="Search!"
                      placeholderTextColor={
                        colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
                      }
                      onFocus={() => setSearchBorderColor(COLORS.primary)}
                      onBlur={() => setSearchBorderColor(COLORS.lightGray)}
                      value={searchQuery}
                      onChangeText={handleSearch}
                    />
                  </View>
                </View>

                <View style={styles.sortContainer}>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setSortOrder('asc')}>
                    <View style={styles.radioCircle}>
                      {sortOrder === 'asc' && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={styles.radioText}>Lowest to Highest</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setSortOrder('desc')}>
                    <View style={styles.radioCircle}>
                      {sortOrder === 'desc' && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={styles.radioText}>Highest to Lowest</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.homeContainer}>
                  <View style={styles.serviceContainer}>
                    {isSearching ? (
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator
                          size="large"
                          color={
                            colorScheme === 'dark' ? COLORS.white : COLORS.darkColor
                          }
                        />
                      </View>
                    ) : filteredServices.length > 0 ? (<>
                      <FlatList
                        data={filteredServices}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                          return (
                            <ServicesContainer
                              service_image={item.Img}
                              service_name={item.service_name}
                              service_description={item.service_description}
                              service_price={item.service_price.toString()}
                              shop_owner={item.shop_owner}
                              service_id={item._id}
                            />
                          );
                        }}
                        contentContainerStyle={styles.serviceContainer}
                      />

                      {/* <Text style={{ marginTop: -70, marginBottom: 20, textAlign: 'center', color: 'black', fontSize: 40, fontWeight: 'bold' }}>Custom Services</Text>
                      <FlatList
                        data={customServices}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                          return (
                            <ServicesContainer
                              service_id={item._id}
                              service_image={item.Img}
                              service_name={item.service_name}
                              service_description={item.service_description}
                              service_price={String(item.service_price)}
                            />
                          );
                        }}
                        contentContainerStyle={styles.serviceContainer}
                      />  */}

                    </>
                    ) : (
                      <View style={styles.noServiceContainer}>
                        <Text
                          style={[
                            styles.noServiceText,
                            {
                              color:
                                colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                            },
                          ]}>
                          No Service Available!
                        </Text>
                      </View>
                    )
                    }
                  </View>
                </View>
              </>
            ) : role === 'seller' ? (
              <View><SellerDashboard /></View>
            ) : (
              role === 'admin' && (
                <AdminDashboard />
              )
            )
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollViewContainer: {
    marginTop: height * 0.004,
  },

  headerContainer: {
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
  },

  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },

  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },

  greeting: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  name: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  description: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginTop: width * 0.01,
  },
  ratingText: {
    color: COLORS.warning,
  },
  rightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgContainer: {
    marginTop: height * 0.02,
    width: width * 0.17,
    height: width * 0.17,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  searchContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
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

  homeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  home: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.05,
  },

  serviceContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    // marginLeft: height * 0.01,
  },

  noServiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.25,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.25,
  },

  noServiceText: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff', // White background
    borderRadius: 10, // Rounded corners
    padding: 20, // Internal padding
    margin: 10, // Space around the card
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    elevation: 3, // Shadow for Android
  },
  cardText: {
    fontSize: 16, // Text size
    color: COLORS.white, // Text color
    textAlign: 'center', // Center text
  },
  gotoDashboard: {
    backgroundColor: COLORS.primary, // Primary color from COLORS
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
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

});