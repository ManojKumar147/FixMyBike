/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, Image, colorScheme
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather'; // Import Feather icons
import { COLORS, FONTS } from '../../../constants/Constants';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const UserManagement = ({ navigation }) => {
  const [mechanics, setMechanics] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);

  const [showMechanics, setShowMechanics] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [showSellers, setShowSellers] = useState(false);

 const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Signin');
        return;
      }
      const response = await axios.get(
        `${Base_Endpoint}/api/users/admin/get-Users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const users = response.data.users;
      setMechanics(users.filter(user => user.role === 'mechanic'));
      setCustomers(users.filter(user => user.role === 'customer'));
      setSellers(users.filter(user => user.role === 'seller'));
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 const handleBlockUnblock = async (user) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = `${Base_Endpoint}/api/users/${user.blocked ? 'unblock-user' : 'block-user'}/${user._id}`;
      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh users after block/unblock
      fetchUsers();
    } catch (error) {
      console.log('Error blocking/unblocking user:', error);
    }
  };

const renderUserItem = ({ item }) => {
    return (
      <View style={styles.userItem}>
        <Image
          source={
            item.profile_image
              ? { uri: item.profile_image }
              : require('../../../../assets/png/user.png')
          }
          style={styles.userImage}
        />
        <Text style={styles.userName}>{item.full_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {(item.role === 'mechanic' || item.role === 'seller') && (
          <Text style={styles.userRating}>
            <Feather name="star" size={14} color={COLORS.warning} /> {item.averageRating?.toFixed(1)}
          </Text>
        )}
        <TouchableOpacity
          style={{
            marginTop: 8,
            backgroundColor: item.blocked ? COLORS.warning : COLORS.primary,
            padding: 8,
            borderRadius: 6,
          }}
          onPress={() => handleBlockUnblock(item)}
        >
          <Text style={{ color: COLORS.white, textAlign: 'center' }}>
            {item.blocked ? 'Unblock' : 'Block'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
          <Text style={styles.headerText}>User Management</Text>
        </View>

        {/* Right - Spacer */}
        <View style={styles.spacer} />
      </View>


      {/* Mechanics */}
      {!showCustomers && !showSellers && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowMechanics(!showMechanics)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mechanics</Text>
            <Feather
              name={showMechanics ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.cardDescription}>
            <Text style={styles.countText}>{mechanics.length}</Text> mechanics registered.
          </Text>
        </TouchableOpacity>
      )}
      {showMechanics && (
        <FlatList
          data={mechanics}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderUserItem}
          numColumns={2} // Two-column layout
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.fullScreenList} // Full-screen styling
        />
      )}

      {/* Customers */}
      {!showMechanics && !showSellers && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowCustomers(!showCustomers)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Customers</Text>
            <Feather
              name={showCustomers ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.cardDescription}>
            <Text style={styles.countText}>{customers.length}</Text> customers registered.
          </Text>
        </TouchableOpacity>
      )}
      {showCustomers && (
        <FlatList
          data={customers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderUserItem}
          numColumns={2} // Two-column layout
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.fullScreenList} // Full-screen styling
        />
      )}

      {/* Sellers */}
      {!showMechanics && !showCustomers && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowSellers(!showSellers)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sellers</Text>
            <Feather
              name={showSellers ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.cardDescription}>
            <Text style={styles.countText}>{sellers.length}</Text> sellers registered.
          </Text>
        </TouchableOpacity>
      )}
      {showSellers && (
        <FlatList
          data={sellers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderUserItem}
          numColumns={2} // Two-column layout
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.fullScreenList} // Full-screen styling
        />
      )}
    </View>
  );
};

export default UserManagement;

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
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 24,
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
  cardTitle: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    marginTop: 8,
  },
  countText: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    color: COLORS.warning,
  },
  userItem: {
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
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    alignSelf: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.darkColor,
    textAlign: 'center',
    marginTop: 4,
  },
  userRating: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.warning,
    textAlign: 'center',
    marginTop: 4,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fullScreenList: {
    flexGrow: 1, // Allow the list to take up the full screen
    paddingBottom: 16, // Add some padding at the bottom
  },
});