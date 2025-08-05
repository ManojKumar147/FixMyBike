/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, Dimensions,
  colorScheme, ActivityIndicator, Alert, TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProductCard from "./ProductCard"; // Adjust the path based on your file structure
import Feather from 'react-native-vector-icons/Feather';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const { width, height } = Dimensions.get('window');

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // "asc" for low to high, "desc" for high to low
  const navigation = useNavigation();
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please sign in first.");
        navigation.replace("Signin");
        return;
      }

      const response = await axios.get(`${Base_Endpoint}/api/get-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.Products);
      setFilteredProducts(response.data.Products); // Initialize filtered products
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Filter and sort products based on search query and sort order
  useEffect(() => {
    let updatedProducts = [...products];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      updatedProducts = updatedProducts.filter(product => {
        const nameMatches = product?.product_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const priceMatches = !isNaN(parseFloat(searchQuery)) && parseFloat(product?.product_price) <= parseFloat(searchQuery);
        console.log("Name Matches:", nameMatches, "Price Matches:", priceMatches);
        return nameMatches || priceMatches;
      });
    }

    // Apply sort
    if (sortOrder === "asc") {
      updatedProducts.sort((a, b) => parseFloat(a.product_price) - parseFloat(b.product_price));
    } else if (sortOrder === "desc") {
      updatedProducts.sort((a, b) => parseFloat(b.product_price) - parseFloat(a.product_price));
    }

    setFilteredProducts(updatedProducts);
  }, [products, searchQuery, sortOrder]);

  const handleEdit = (product) => {
    navigation.navigate("Edit_Product", { product });
  };
  const handleSearch = text => {
    setSearchQuery(text);
  }
  const handleDelete = async (productId) => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Authentication Error", "Please sign in first.");
              navigation.replace("Signin");
              return;
            }
            await axios.delete(`${Base_Endpoint}/api/remove-product/${productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            Alert.alert("Success", "Product deleted successfully!");
            fetchProducts();
          } catch (error) {
            console.error("Delete failed:", error);
            Alert.alert("Error", "Failed to delete product.");
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Seller Dashboard</Text>
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

      <TouchableOpacity style={styles.addProduct} onPress={() => navigation.navigate("Add_Product")}>
          <Text style={styles.productText}>Add Product</Text>
        </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) =>
            <ProductCard product={item}
              onEdit={handleEdit} onDelete={handleDelete}
            />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.03,
  },
  header: {
    fontSize: width * 0.06,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: "center",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    padding: 5,
    fontSize: width * 0.04,
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  sortButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeSortButton: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    color: COLORS.dark,
    fontSize: width * 0.04,
  },
  listContainer: {
    paddingBottom: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  searchContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
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
  addProduct: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  productText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },
});

export default SellerDashboard;