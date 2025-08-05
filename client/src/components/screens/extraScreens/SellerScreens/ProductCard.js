import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { COLORS, FONTS } from "../../../constants/Constants";

const { width } = Dimensions.get("window");

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <Image
        source={
          product.img
            ? { uri: product.img }
            : require("./../../../../assets/shop/default_img.png")
        }
        style={styles.productImage}
        resizeMode="cover"
        onError={(e) =>
          console.log("Image Load Error:", e.nativeEvent.error)
        }
      />

      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text style={styles.productPrice}>Price: {product.product_price}</Text>
        <Text style={styles.productCompany}>
          Company: {product.product_company_name}
        </Text>
        <Text style={styles.productDescription}>
          {product.product_description}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(product)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(product._id)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // flexDirection: "row",
    backgroundColor: COLORS.lightDark,
    padding: 15,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: "flex-start",
  },
  productImage: {
    width: width * 0.72,
    height: width * 0.52,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: COLORS.dark,
    borderWidth: 1,
    borderColor: COLORS.gray,
    alignSelf: "center",
  },
  productDetails: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  productName: {
    fontSize: width * 0.060,
    fontFamily: FONTS.extraBold,
    color: COLORS.white,
    marginBottom: 7,
    alignSelf: 'center',
  },
  productPrice: {
    fontSize: width * 0.04,
    fontFamily: FONTS.bold,
    color: COLORS.warning,
    marginBottom: 2,
  },
  productCompany: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginBottom: 2,
  },
  productDescription: {
    fontSize: width * 0.04,
    fontFamily: FONTS.regular,
    color: COLORS.lightGray,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Ensures buttons are spaced apart
    alignItems: "center",
    marginTop: 10,
    width: "100%", // Ensures the buttons take up the full width of the container
},
editButton: {
  backgroundColor: COLORS.primary,
  paddingVertical: 6,
  paddingHorizontal: 16,
  borderRadius: 6,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
  flex: 1, // Makes the button take equal space
  marginRight: 10, // Adds spacing between the buttons
},
deleteButton: {
  backgroundColor: COLORS.errorColor,
  paddingVertical: 6,
  paddingHorizontal: 16,
  borderRadius: 6,
  shadowColor: COLORS.errorColor,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
  flex: 1, // Makes the button take equal space
},
  buttonText: {
    color: "#fff",
    fontSize: width * 0.038,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
});

export default ProductCard;
