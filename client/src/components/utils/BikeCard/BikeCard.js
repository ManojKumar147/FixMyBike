/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../constants/Constants';
import DeleteBikeModal from '../Modals/DeleteBikeModal';

const { width, height } = Dimensions.get('window');

const BikeCard = ({ bike, onDelete, onCheckboxChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteBikeModal, setShowDeleteBikeModal] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  const handleDeleteBikeModal = () => {
    setShowDeleteBikeModal(true);
  };

  const handleDeleteBike = async bikeId => {
    await onDelete(bikeId);
    setShowDeleteBikeModal(false);
  };

  const handleViewBikeDetails = () => {
    navigation.navigate('Bike_Detailed', { bike });
  };

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <TouchableOpacity
        style={[
          styles.vehicleCard,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}
        onPress={toggleExpand}>
        <View style={styles.vehicleContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="motorbike"
                size={25}
                style={[
                  styles.icon,
                  {
                    color:
                      colorScheme === 'dark' ? COLORS.white : COLORS.primary,
                  },
                ]}
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.bikeName,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}>
                {bike.bike_name}
              </Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
          <View style={[styles.checkbox, { marginRight: width * 0.05}]}>
            <CheckBox
              value={bike.isSelected}
              onValueChange={value => onCheckboxChange(bike._id, 'true')}
            />
          </View>
            <View style={styles.iconContainer}>
              <Feather
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={30}
                color={COLORS.primary}
              />
            </View>
          </View>
        </View>
        {expanded && (
          <View style={styles.infoContainer}>
            <View style={[styles.bikeDetails]}>
              <Text
                style={[
                  styles.bikeInfo,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}>
                Company: {bike.bike_company_name}
              </Text>
              <Text
                style={[
                  styles.bikeInfo,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}>
                Model: {bike.bike_model}
              </Text>
              <Text
                style={[
                  styles.bikeInfo,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}>
                Registration Number: {bike.bike_registration_number}
              </Text>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleDeleteBikeModal}>
                <Feather
                  name={'trash'}
                  size={25}
                  color={
                    colorScheme === 'dark'
                      ? COLORS.errorColor
                      : COLORS.errorColor
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleViewBikeDetails}>
                <Feather
                  name={'eye'}
                  size={25}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <DeleteBikeModal
        visible={showDeleteBikeModal}
        onClose={() => setShowDeleteBikeModal(false)}
        title="Delete Bike!"
        description="Are you sure you want to delete this bike?"
        bikeId={bike._id}
        onDelete={handleDeleteBike}
      />
    </SafeAreaView>
  );
};

export default BikeCard;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  vehicleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
    gap: 20,
  },

  vehicleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  infoContainer: {
    flexDirection: 'row',
  },

  bikeDetails: {
    paddingTop: height * 0.01,
    paddingBottom: height * 0.01,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    borderRadius: 8,
    marginTop: height * 0.02,
  },

  bikeName: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    marginLeft: width * 0.02,
  },

  bikeInfo: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
    marginLeft: width * 0.02,
    marginTop: height * 0.01,
    color: COLORS.dark,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
  },

  icon: {
    color: COLORS.primary,
  },
  checkbox: {
    alignSelf: 'center',
    marginRight: width * 0.02,
  },
});
