import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/Constants';

const { width, height } = Dimensions.get('window');

const ServicesContainer = ({
  shop_owner,
  service_image,
  service_name,
  service_description,
  service_price,
  service_id,
  isTouchable = true,
}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const handleServicePress = () => {
  if (isTouchable) {
    const params = {
      service_image,
      service_name,
      service_description,
      service_price,
      service_id,
    };
    if (shop_owner !== undefined) {
      params.shop_owner = shop_owner;
    }
    if (service_id !== undefined) {
      params.shop_owner = shop_owner;
    }
    navigation.navigate('Service_Booking', params);
  }
};
  return (
    <SafeAreaView style={styles.primaryContainer}>
      <TouchableOpacity
        onPress={handleServicePress}
        style={[
          styles.serviceContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.lightDark,
          },
        ]}>
        <View style={styles.imageContainer}>
          <Image
            source={
              service_image
                ? { uri: service_image }
                : require('./../../../assets/shop/default_img.png')
            }
            style={styles.image}
          />
        </View>

        {service_name && (
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.serviceText,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.white },
              ]}>
              {service_name}
            </Text>
            <Text
              style={[
                styles.descriptionText,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.white },
              ]}>
              {service_description}
            </Text>
            <Text
              style={[
                styles.priceText,
                { color: colorScheme === 'dark' ? COLORS.primary : COLORS.white },
              ]}>
              Starting from Rs.{service_price}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ServicesContainer;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: height * 0.05,
  },

  serviceContainer: {
    width: width * 0.9,
    borderRadius: 12,
    padding: 10,
    shadowColor: COLORS.white,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  imageContainer: {
    width: '100%',
    height: height * 0.30,
    overflow: 'hidden',
    borderRadius: 8,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  textContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.015,
    gap: height * 0.008,
  },

  serviceText: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    marginTop: height * 0.01,
    textAlign: 'center',
  },

  descriptionText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
  },

  priceText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    textAlign: 'center',
  },
});
