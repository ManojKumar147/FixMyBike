/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import StarRatingDisplay from "react-native-star-rating-widget";
import BASE_URL from "../../../constants/BASE_URL";
const { Base_Endpoint } = BASE_URL;
const { width } = Dimensions.get("window");

const ShopsDashboard = ({ route }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { role } = route.params;
  // Fetch sellers with ratings
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please sign in first.");
        return;
      }

      const response = await axios.get(
        `${Base_Endpoint}/api/users/get-${role}'s-ratings`, // Corrected endpoint
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(response.data.sellers); // Use "sellers" as returned by API
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error);
      Alert.alert("Error", `Failed to fetch ${role}s. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch data initially when the page loads
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers(); // Re-fetch data when navigating back
    }, [])
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>
        {role === "seller" ? "Product Shops" : "Mechanic Shops"}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => {
            const shopRating = item.averageRating || 0;

            return (
              <TouchableOpacity
                style={styles.userCard}
                onPress={() =>
                  navigation.navigate("ShopItem", {
                    user: item._id,
                    name: item.full_name,
                    email: item.email,
                    role: role,
                    rating: shopRating,
                  })
                }
              >
                <View style={styles.textContainer}>
                  <Text style={styles.userName}>
                    {item.full_name}  {role === "seller" ? "Product Shops" : "Mechanic Shops"}
                  </Text>
                  <Text style={styles.userEmail}>{item.email}</Text>

                  {/* Display rating below email */}
                  <View style={styles.ratingContainer}>
                    <StarRatingDisplay rating={shopRating} starSize={20} color={COLORS.primary} onChange={() => {}} />
                    <Text style={styles.ratingText}>
                      {shopRating ? `${shopRating.toFixed(1)} / 5` : "No Ratings Yet"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  header: {
    fontSize: width * 0.06,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 4,
    borderColor: COLORS.primary,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: width * 0.045,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    textAlign: "center",
  },
  userEmail: {
    fontSize: width * 0.04,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    textAlign: "center",
  },
  ratingContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    fontSize: width * 0.035,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginTop: 5,
  },
});

export default ShopsDashboard;
