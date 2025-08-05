import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { COLORS, FONTS } from "../../../constants/Constants";
import BASE_URL from "../../../constants/BASE_URL";
const { Base_Endpoint } = BASE_URL;

const { width } = Dimensions.get("window");

const ProductCard = ({ product }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: `${Base_Endpoint}/src/assets/shop/${product.product_name}.jpg` }} 
        style={styles.productImage} 
        resizeMode="cover"
      />

      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text style={styles.productPrice}>Price: ${product.product_price}</Text>
        <Text style={styles.productCompany}>Company: {product.product_company_name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", 
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    elevation: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary, 
  },
  productImage: {
    width: width * 0.25, 
    height: width * 0.25, 
    borderRadius: 8,
    marginRight: 15, 
  },
  productDetails: {
    flex: 1, 
  },
  productName: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  productPrice: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  productCompany: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.bold,
  },
});

export default ProductCard;
