/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ImagePicker from "react-native-image-crop-picker"; // Make sure you installed this
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const { width } = Dimensions.get('window');

const ServiceForm = ({ route }) => {
  const navigation = useNavigation();
  const service = route.params?.service;

  if (!service) {
    Alert.alert('Error', 'No service data provided!');
    navigation.goBack();
    return null;
  }

  const [serviceName, setServiceName] = useState(service.service_name);
  const [servicePrice, setServicePrice] = useState(service.service_price.toString());
  const [serviceModel, setServiceModel] = useState(service.service_model);
  const [enginePower, setEnginePower] = useState(service.engine_power.toString());
  const [serviceDescription, setServiceDescription] = useState(service.service_description);
const [serviceImage, setServiceImage] = useState(service.Img || "");


const handleSelectImage = () => {
  ImagePicker.openPicker({
    width: 300,
    height: 300,
    cropping: true,
  }).then((image) => {
    setServiceImage(image.path);  // Set the selected image path
  });
};


  const handleSubmit = async () => {
    if (!serviceName || !servicePrice || !serviceModel || !enginePower || !serviceDescription) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please sign in first.');
        navigation.replace('Signin');
        return;
      }

      const formData = new FormData();
      formData.append('service_name', serviceName);
      formData.append('service_price', parseFloat(servicePrice));
      formData.append('service_model', serviceModel);
      formData.append('engine_power', enginePower);
      formData.append('service_description', serviceDescription);
      if (serviceImage && !serviceImage.includes('http')) {
        formData.append('service_image', {
          uri: serviceImage,
          type: 'image/jpeg',
          name: 'service.jpg',
        });
      } else if (serviceImage && serviceImage.includes('http')) {
        formData.append('service_image', serviceImage);
      }
      const response = await axios.put(`${Base_Endpoint}/api/shop/services/${service._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` ,
      'Content-Type': 'multipart/form-data',
      },
        
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Service updated successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Error', 'Failed to update service. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Service</Text>
  
      <TextInput placeholder="Service Name" value={serviceName} onChangeText={setServiceName} style={styles.input} />
      <TextInput placeholder="Service Price" value={servicePrice} onChangeText={setServicePrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Model/Company" value={serviceModel} onChangeText={setServiceModel} style={styles.input} />
      <TextInput placeholder="Engine Power (CC)" value={enginePower} onChangeText={setEnginePower} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Service Description" value={serviceDescription} onChangeText={setServiceDescription} multiline numberOfLines={4} style={styles.input} />
  
      {/* Select Image Button */}
      <TouchableOpacity style={styles.selectImageButton} onPress={handleSelectImage}>
        <Text style={styles.selectImageText}>Select Image</Text>
      </TouchableOpacity>
  
      {/* Image Preview */}
      <Image
        source={
          serviceImage && serviceImage !== "default_img.png"
            ? { uri: serviceImage }
            : require("./../../../../assets/shop/default_img.png") // adjust path if needed
        }
        style={{ width: 200, height: 200, borderRadius: 10, alignSelf: "center", marginBottom: 10 }}
        resizeMode="cover"
        onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
      />
  
      <TouchableOpacity style={styles.updateService} onPress={handleSubmit}>
        <Text style={styles.serviceText}>Update Service</Text>
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
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  updateService: {
    backgroundColor: COLORS.primary,
    margin: 10,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  serviceText: {
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

export default ServiceForm;
