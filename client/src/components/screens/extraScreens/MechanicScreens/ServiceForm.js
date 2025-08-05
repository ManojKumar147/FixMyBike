import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ImagePicker from "react-native-image-crop-picker";
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const { width } = Dimensions.get('window');

const ServiceForm = ({ onSubmit }) => {
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceModel, setServiceModel] = useState('');
  const [enginePower, setEnginePower] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [image, setImage] = useState(null); // State to hold the selected image
  const navigation = useNavigation();

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
      formData.append('engine_power', parseFloat(enginePower));
      formData.append('service_description', serviceDescription);
      if (image) {
        // Appending image to FormData
        formData.append("service_image", {
          uri: image.path,
          type: image.mime,
          name: image.filename || "product.jpg", // Add a default filename if missing
        });
      }
      console.log("FormData:", formData); // Log FormData for debugging

      const response = await axios.post(`${Base_Endpoint}/api/shop/services`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

     if (response.status === 201) {
       // Alert.alert('Success', 'Service added successfully!');
       // setServiceName('');
       // setServicePrice('');
        //setServiceModel('');
       // setEnginePower('');
        //setServiceDescription('');
       // navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding service:', error);
      Alert.alert('Error', 'Failed to add service. Please try again.');
    }
  };
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
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service Form</Text>

      <TextInput placeholder="Service Name" value={serviceName} onChangeText={setServiceName} style={styles.input} />
      <TextInput placeholder="Service Price" value={servicePrice} onChangeText={setServicePrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Model/Company" value={serviceModel} onChangeText={setServiceModel} style={styles.input} />
      <TextInput placeholder="Engine Power (CC)" value={enginePower} onChangeText={setEnginePower} keyboardType="numeric" style={styles.input} />
      <TextInput
        placeholder="Service Description"
        value={serviceDescription}
        onChangeText={setServiceDescription}
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
      <TouchableOpacity style={styles.addService} onPress={handleSubmit}>
        <Text style={styles.serviceText}>Add Service</Text>
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
  addService: {
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

export default ServiceForm;
