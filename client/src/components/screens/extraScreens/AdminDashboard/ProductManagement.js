/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet, Text, View, FlatList,
  Image, TouchableOpacity, colorScheme
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../../constants/Constants';
import Feather from 'react-native-vector-icons/Feather'; // Import Feather icons
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const ProductManagement = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('Signin');
          return;
        }

        const response = await axios.get(
          `${Base_Endpoint}/api/admin/get-products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const products = response.data.products;
        setProducts(products);
      } catch (error) {
        console.log('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image
        source={
          item.img
            ? { uri: item.img }
            : require('../../../../assets/shop/default_img.png') // Default product image
        }
        style={styles.productImage}
      />
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productCompany}>{item.product_company_name}</Text>
      <Text style={styles.productPrice}>${item.product_price}</Text>
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
          <Text style={styles.headerText}>Products</Text>
        </View>

        {/* Right - Spacer */}
        <View style={styles.spacer} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProductItem}
        numColumns={2} // Two-column layout
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.fullScreenList} // Full-screen styling
      />
    </View>
  );
};

export default ProductManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Screen background color
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  backButton: {
    alignItems: 'flex-start', // Align back button to the far left
  },
  titleContainer: {
    flex: 1, // Take up remaining space to center the title
    alignItems: 'center',
  },
  spacer: {
    width: 40, // Spacer to balance layout
  },
  headerText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  productItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    width: '48%', // Fixed width for two-column layout
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  productCompany: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.success,
    textAlign: 'center',
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