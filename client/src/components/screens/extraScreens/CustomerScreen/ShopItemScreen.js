/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Dimensions, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get("window");
import { useRoute } from "@react-navigation/native";
import ProductCard from "./ProductCard";
import ServiceCard from "./ItemCard";
import StarRating,{ StarRatingDisplay } from 'react-native-star-rating-widget';
import Feather from 'react-native-vector-icons/Feather';
import { Tooltip } from "react-native-elements";
import BASE_URL from "../../../constants/BASE_URL";
const { Base_Endpoint } = BASE_URL;

const ShopItemScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const userId = route.params?.user;
  const name = route.params?.name;
  const email = route.params?.email;
  const role = route.params?.role;
  const shopRating = route.params?.rating;

  const things = role === 'seller' ? 'get-products' : 'shop/get-services';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(shopRating);

  const handleRating = async (newRating) => {
    setRating(newRating);
    console.log(`User rated: ${newRating}`);

    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            Alert.alert("Authentication Error", "Please sign in first.");
            navigation.replace("Signin");
            return;
        }

        const response = await axios.post(
            `${Base_Endpoint}/api/save-rating`,
            {
                shop_owner: userId, // Correct field name
                rating: newRating,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response.data.message);
    } catch (error) {
        console.error("Error saving rating:", error);
    }
};


  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please sign in first.");
        navigation.replace("Signin");
        return;
      }
      const response = await axios.get(`${Base_Endpoint}/api/${things}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data.Items);
    } catch (error) {
      console.error("Error fetching itemss:", error);
      Alert.alert("Error", "Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  },[]);

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text style={styles.userName}>
          {name} Auto Spare Parts Shop..
        </Text>
        <Text style={styles.userEmail}>{email}</Text>
        <View style={styles.ratingContainer}>
          <View style={styles.rateUsContainer}>
            <Text style={styles.ratingLabel}>Rate Us</Text>
            <TouchableOpacity onPress={() => Alert.alert('Rating Info", "Rate the shop based on your experience from 1 to 5 stars.')}>
              <Feather name="arrow-right" size={18} color={COLORS.primary} style={styles.infoIcon} />
            </TouchableOpacity>
          </View>
          <StarRating
            rating={rating}
            onChange={handleRating}
            enableSwiping={true}
          />
        </View>
      </View>

      {/* Check if items are empty */}
      {items.length === 0 ? (
        <Text style={styles.noItemsText}>No items available yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) =>
            role === 'seller' ? (
              <ProductCard product={item} />
            ) : (
              <ServiceCard service={item} />
            )
          }
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
  textContainer: {
    marginLeft: 10,
    paddingVertical: 10,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  rateUsContainer: {
    flexDirection: "row", // "Rate Us" and icon in one row
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginRight: 5, // Space between text & icon
  },
  infoIcon: {
    marginLeft: 5, // Adjust spacing
  },
  noItemsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ShopItemScreen;
