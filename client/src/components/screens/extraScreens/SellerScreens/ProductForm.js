/* eslint-disable quotes */
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ImagePicker from "react-native-image-crop-picker"; // Make sure you installed this
import BASE_URL from "../../../constants/BASE_URL";
const { Base__ } = BASE_URL;
const { width } = Dimensions.get("window");

const ProductForm = ({ onSubmit }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCompanyName, setProductCompanyName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [image, setImage] = useState(null); // State to hold the selected image
  const navigation = useNavigation();

  const handlePickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      console.log("Selected image:", image);
      setImage(image); // Set the selected image
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

      if (image) {
        // Appending image to FormData
        formData.append("product_image", {
          uri: image.path,
          type: image.mime,
          name: image.filename || "product.jpg", // Add a default filename if missing
        });
      }
      console.log("FormData:", formData); // Log FormData for debugging
      const response = await axios.post("${Base_}/api/add-product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Product added successfully!");
        setProductName("");
        setProductPrice("");
        setProductCompanyName("");
        setProductDescription("");
        setImage(null); // Clear image after submission
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Form</Text>
      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Company Name"
        value={productCompanyName}
        onChangeText={setProductCompanyName}
        style={styles.input}
      />
      <TextInput
        placeholder="Product Description"
        value={productDescription}
        onChangeText={setProductDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {/* Image Picker Button */}
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        <Text style={styles.imagePickerText}>
          {image ? "Change Image" : "Select Product Image"}
        </Text>
      </TouchableOpacity>

      {/* Image Preview */}
      {image && <Image source={{ uri: image.path }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.addProduct} onPress={handleSubmit}>
        <Text style={styles.productText}>Add Product</Text>
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
  imagePicker: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  imagePickerText: {
    color: COLORS.white,
    fontSize: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default ProductForm;
