import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../../constants/Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
import ServiceHistoryCard from '../../../utils/ServiceHistoryCard/ServiceHistoryCard';



const Services = () => {
  console.log('Services screen rendered');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [role, setRole] = useState();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: `${Base_Endpoint}/api/users/get-users`,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setRole(response.data.User.role);
      } catch (error) {
        console.error('Error fetching user role:', error.message);
      }
    };
    fetchUser();
  }, []);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: `${Base_Endpoint}/api/reviews/get-all-reviews`, // Adjust endpoint as needed
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserReviews(response.data); // Adjust according to your API response
      } catch (error) {
        console.error('Error fetching user reviews:', error.message);
        setUserReviews([]);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      console.log('Fetching services for role:', role);
      if (!role) { return; }
      const url =
        role === 'mechanic'
          ? `${Base_Endpoint}/api/history`
          : `${Base_Endpoint}/api/service-History`;
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: url,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const bookings = response.data.Bookings;
        if (bookings && bookings.length > 0) {
          setServices(bookings);
        } else {
          console.log('No booking history yet.');
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services history:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [role]);



  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
          ]}>
          {
            role === 'mechanic' ? 'Bookings' : 'My Booking History'
          }
        </Text>
      </View>
      {
        loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.white} />
          </View>
        ) : services.length === 0 ? (
          <View style={styles.noBookingsContainer}>
            <Text style={styles.noBookingsText}>No History available</Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <ServiceHistoryCard
                item={item}
                role={role}
                onShowInProgress={(id, status, userId) => {
                  // Optional: handle in-progress logic
                }}
                onComplete={(id, status, userId) => {
                  // Optional: handle complete logic
                }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={false}
          />


        )
      }
    </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
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

  headerTextContainer: {
    marginTop: height * 0.12,
    marginLeft: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.06,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  bookingContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: 10,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  noBookingsText: {
    fontSize: width * 0.09,
    color: COLORS.text,
    textAlign: 'center',
  },
});
