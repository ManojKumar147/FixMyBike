/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text, View, TouchableOpacity, FlatList, colorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../../constants/Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather'; // Import Feather icons
import BASE_URL from '../../../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;
const BookingManagement = ({ navigation }) => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [inProgressBookings, setInProgressBookings] = useState([]);

  const [showCompleted, setShowCompleted] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showInProgress, setShowInProgress] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('Signin');
          return;
        }

        const response = await axios.get(
          `${Base_Endpoint}/api/admin/getBookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookings = response.data.bookings;

        // Filter bookings based on status
        setCompletedBookings(bookings.filter(booking => booking.status === 'completed'));
        setPendingBookings(bookings.filter(booking => booking.status === 'pending'));
        setInProgressBookings(bookings.filter(booking => booking.status === 'in progress'));
      } catch (error) {
        console.log('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingName}>{item.name}</Text>
        {/* <Text style={styles.bookingStatus(item.status)}>{item.status.toUpperCase()}</Text> */}
      </View>
      <Text style={styles.bookingDetail}>
        <Feather name="tool" size={14} color={COLORS.primary} /> {item.serviceName}
      </Text>
      <Text style={styles.bookingDetail}>
        <Feather name="calendar" size={14} color={COLORS.primary} /> {new Date(item.scheduleDate).toLocaleDateString()}
      </Text>
      <Text style={styles.bookingDetail}>
        <Feather name="map-pin" size={14} color={COLORS.primary} /> {item.address}
      </Text>
      <Text style={styles.bookingPrice}>
        <Feather name="credit-card" size={14} color={COLORS.primary} /> {item.totalPrice}
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Left - Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>

        {/* Center - Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Bookings</Text>
        </View>

        {/* Right - Spacer */}
        <View style={styles.spacer} />
      </View>


      {/* Completed Bookings */}
      {!showPending && !showInProgress && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Completed Bookings</Text>
            <Feather
              name={showCompleted ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.cardDescription}>
            <Text style={styles.countText}>{completedBookings.length}</Text> bookings completed.
          </Text>
        </TouchableOpacity>
      )}
      {showCompleted && (
        <FlatList
          data={completedBookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBookingItem}
          numColumns={2} // Two-column layout
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.fullScreenList} // Full-screen styling
        />
      )}

      {/* Pending Bookings */}
      {!showCompleted && !showInProgress && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowPending(!showPending)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Pending Bookings</Text>
            <Feather
              name={showPending ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.cardDescription}>
            <Text style={styles.countText}>{pendingBookings.length}</Text> bookings pending.
          </Text>
        </TouchableOpacity>
      )}
      {showPending && (
        <FlatList
          data={pendingBookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBookingItem}
          numColumns={2} // Two-column layout
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.fullScreenList} // Full-screen styling
        />
      )}

      {/* In Progress Bookings */}
      {!showCompleted && !showPending && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowInProgress(!showInProgress)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>In Progress Bookings</Text>
            <Feather
              name={showInProgress ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.cardDescription}>
            <Text style={styles.countText}>{inProgressBookings.length}</Text> bookings in progress.
          </Text>
        </TouchableOpacity>
      )}
      {showInProgress && (
        <FlatList
          data={inProgressBookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBookingItem}
          numColumns={2} // Two-column layout
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.fullScreenList} // Full-screen styling
        />
      )}
    </View>
  );
};

export default BookingManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Screen background color
    padding: 16,
  },
  headerText: {
    fontSize: 28,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.primary, // Main tag background color
    borderRadius: 12,
    padding: 24, // Increased padding for height
    marginBottom: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: COLORS.white, // White text for contrast
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.white, // White text for contrast
    marginTop: 8,
  },
  countText: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    color: COLORS.warning, // Prominent color for count
  },
  bookingItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    width: '48%', // Fixed width for two-column layout
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  bookingName: {
    fontSize: 24,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    flexWrap: 'wrap', // Allow text to wrap to the next line
  },
  bookingStatus: status => ({
    fontSize: 14,
    fontFamily: FONTS.medium,
    color:
      status === 'completed'
        ? COLORS.success
        : status === 'pending'
          ? COLORS.warning
          : COLORS.primary,
    flexWrap: 'wrap', // Allow text to wrap to the next line
  }),
  bookingDetail: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow text to wrap to the next line
  },
  bookingPrice: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: COLORS.success,
    flexWrap: 'wrap', // Allow text to wrap to the next line
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fullScreenList: {
    flexGrow: 1, // Allow the list to take up the full screen
    paddingBottom: 16, // Add some padding at the bottom
  },
})