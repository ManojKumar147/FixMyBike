/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation } from "@react-navigation/native";
import ImagePicker from "react-native-image-crop-picker"; // Make sure you installed this
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";
const { Base_Endpoint } = BASE_URL;
const { width } = Dimensions.get("window");

const ProductForm = ({ route }) => {
  const navigation = useNavigation();

  const product = route.params?.product;

  if (!product) {
    Alert.alert("Error", "No product data provided!");
    navigation.goBack();
    return null;
  }

  const [productName, setProductName] = useState(product.product_name);
  const [productPrice, setProductPrice] = useState(product.product_price.toString());
  const [productCompanyName, setProductCompanyName] = useState(product.product_company_name);
  const [productDescription, setProductDescription] = useState(product.product_description);
  const [productImage, setProductImage] = useState(product.img || "");

const handleSelectImage = () => {
  ImagePicker.openPicker({
    width: 300,
    height: 300,
    cropping: true,
  }).then((image) => {
    setProductImage(image.path);  // Set the selected image path
  });
};

const handleSubmit = async () => {
  if (!productName || !productPrice || !productCompanyName || !productDescription) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Authentication Error", "Please sign in first.");
      navigation.replace("Signin");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("product_price", parseFloat(productPrice));
    formData.append("product_company_name", productCompanyName);
    formData.append("product_description", productDescription);

    if (productImage && !productImage.includes("http")) { // Checking if it's not an existing URL
      formData.append("product_image", {
        uri: productImage,
        type: "image/jpeg",
        name: "product.jpg", // You can change the name here
      });
    } else if (productImage && productImage.includes("http")) {
      // If there's an existing image URL, just send it without uploading
      formData.append("product_image", productImage);  // You can send it as a URL
    }

    // Make the API request to add the product
    const response = await axios.patch(`${Base_Endpoint}/api/update-product/${product._id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      Alert.alert("Success", "Product added successfully!");
      setProductName("");
      setProductPrice("");
      setProductCompanyName("");
      setProductDescription("");
      setProductImage(null); // Clear the image after submission
      navigation.goBack();
    }
  } catch (error) {
    console.error("Error updating product:", error);
    Alert.alert("Error", "Failed to add product. Please try again.");
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Product</Text>

      <TextInput
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TextInput placeholder="Price" value={productPrice} onChangeText={setProductPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Company Name" value={productCompanyName} onChangeText={setProductCompanyName} style={styles.input} />
      <TextInput placeholder="Product Description" value={productDescription} onChangeText={setProductDescription} multiline numberOfLines={4} style={styles.input} />
      <TouchableOpacity onPress={handleSelectImage} style={styles.selectImageButton}>
  <Text style={styles.selectImageText}>Select Image</Text>
</TouchableOpacity>
      <Image
    source={
      productImage
        ? { uri: productImage }
        : require("./../../../../assets/shop/default_img.png") // Update path if necessary
    }
    style={{ width: 200, height: 200, borderRadius: 10, alignSelf: "center", marginBottom: 10 }}
    resizeMode="cover"
    onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
  />
      <TouchableOpacity style={styles.addProduct} onPress={handleSubmit}>
        <Text style={styles.productText}>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    paddingVertical: 10,
    color: COLORS.primary,
    fontSize: width * 0.055,
    fontFamily: FONTS.bold,
    textAlign: "center",
  },
  label: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  addProduct: {
    backgroundColor: COLORS.primary,
    margin: 10,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  productText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },
  selectImageButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  selectImageText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ProductForm;
