/* eslint-disable no-undef */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../../constants/Constants";

const { width, height } = Dimensions.get("window");

const ServiceCard = ({ service, onEdit, onDelete, service_image }) => {
  console.log('service image', service.Img)
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={
            service.Img
              ? { uri: service.Img }
              : require('./../../../../assets/shop/default_img.png')
          }
          style={styles.image}
          onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
        />
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.serviceName}>
          {service.service_name}
        </Text>
        <Text style={styles.servicePrice}>
          Price: {service.service_price}
        </Text>
        <Text style={styles.serviceDescription}>
          Description: {service.service_description}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(service)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(service._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  card: {
    width: width * 0.83,
    borderRadius: 12,
    padding: width * 0.0205,
    shadowColor: COLORS.white,
    shadowOffset: { width: width * 0.012, height: height * 0.012 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.008,
    elevation: 2,
    backgroundColor: COLORS.lightDark,
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.30,
    overflow: 'hidden',
    borderRadius: width * 0.02,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productDetails: {
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
  serviceName: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    marginTop: height * 0.01,
    textAlign: 'center',
    color: COLORS.white,
  },
  servicePrice: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: width * 0.035,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: width * 0.15,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: COLORS.errorColor,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
  },
});

export default ServiceCard;