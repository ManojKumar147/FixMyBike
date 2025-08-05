import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../../constants/Constants';
import { Picker } from '@react-native-picker/picker';
import CustomModal from '../../../utils/Modals/CustomModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const { width, height } = Dimensions.get('window');

const ServiceBooking = () => {
  const route = useRoute();
  const { booking } = route.params;
  console.log(booking);
  //  const service_name = route.params?.service_name;
  //  const service_price = route.params?.service_price;

  const [totalPrice, setTotalPrice] = useState(booking.service_price);
  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [comments, setComments] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [bikeName, setBikeName] = useState('');
  const [bikeCompanyName, setBikeCompanyName] = useState('');
  const [bikeRegNumber, setBikeRegNumber] = useState('');
  const [chainLubricants, setChainLubricants] = useState('');
  const [tirePressure, setTirePressure] = useState('');
  const [headLightAdjustment, setHeadLightAdjustment] = useState('');
  const [breakCheck, setBreakCheck] = useState('');
  const [batteryCleaning, setBatteryCleaning] = useState('');
  const [mirrorAdjustment, setMirrorAdjustment] = useState('');
  const [dropoff, setDropOff] = useState('');
  const [status, setStatus] = useState('');
  const [nameError, setNameError] = useState('');
  const [cellError, setCellError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [bikeModelError, setBikeModelError] = useState('');
  const [bikeRegNumberError, setBikeRegNumberError] = useState('');

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('Signin');
          return;
        }

        const response = await axios.get(
          `${Base_Endpoint}/api/users/get-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const user = response.data.User;

        if (user && user.full_name) {
          setName(user.full_name);
        } else {
          console.log('Full Name Not Found In Response');
        }

        if (user && user.profile_image) {
          setImage(user.profile_image);
        } else {
          console.log('Profile Image not found in response');
        }

        if (user && user.role) {
          setRole(user.role);
        } else {
          console.log('Role Not Found In Response');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
        navigation.replace('Signin');
      }
    };

    fetchUserData();
  }, [navigation]);

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    if (booking?.additionalServices && Array.isArray(booking.additionalServices)) {
      setChainLubricants(
        booking.additionalServices.includes('Chain Lubrication') ? 'Chain Lubrication' : ''
      );
      setTirePressure(
        booking.additionalServices.includes('Tire Pressure Check') ? 'Tire Pressure Check' : ''
      );
      setHeadLightAdjustment(
        booking.additionalServices.includes('Headlight Adjustment') ? 'Headlight Adjustment' : ''
      );
      setBreakCheck(
        booking.additionalServices.includes('Brake Light Check') ? 'Brake Light Check' : ''
      );
      setBatteryCleaning(
        booking.additionalServices.includes('Battery Terminal Cleaning') ? 'Battery Terminal Cleaning' : ''
      );
      setMirrorAdjustment(
        booking.additionalServices.includes('Mirror Adjustment') ? 'Mirror Adjustment' : ''
      );

    }
  }, [booking]);



  const isValidInput = () => {
    const namePattern = /^[a-zA-Z\s]*$/;
    const cellPattern = /^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/;
    const addressPattern = /^House#\d+\sStreet#\d+\s[A-Za-z\s]+\s[A-Za-z\s]+$/;
    const isNameValid = namePattern.test(name);
    const isCellValid = cellPattern.test(cell);
    const isAddressValid = addressPattern.test(address);

    bikeModelError === '' &&
      bikeRegNumberError === '' &&
      bikeModel !== '' &&
      bikeRegNumber !== '';

    return isNameValid && isCellValid && isAddressValid;
  };

  const handleNameChange = value => {
    setName(value);
    if (value === '') {
      setNameError('Name is required');
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      setNameError('Only alphabets are allowed');
    } else {
      setNameError('');
    }
  };

  const handleCellChange = value => {
    setCell(value);
    if (value === '') {
      setCellError('Cell is required');
    } else if (!/^(\+92|92|0)(3\d{2}|\d{2})(\d{7})$/.test(value)) {
      setCellError('Invalid Cell Format');
    } else {
      setCellError('');
    }
  };

  const handleAddressChange = value => {
    setAddress(value);
    if (value === '') {
      setAddressError('Address is required');
    } else if (
      !/^House#\d+\sStreet#\d+\s[A-Za-z\s]+\s[A-Za-z\s]+$/.test(value)
    ) {
      setAddressError('Address must follow format');
    } else {
      setAddressError('');
    }
  };

  const renderAdditionalServices = (label, price, isSelected, onPress) => (
    <View style={styles.optionRow}>
      <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
        <View style={styles.checkbox}>
          {isSelected && <Text style={styles.checkmark}>&#10003;</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.optionTextContainer}>
        <Text
          style={[
            styles.optionText,
            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
          ]}>
          {label}
        </Text>
        <Text
          style={[
            styles.optionPrice,
            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
          ]}>
          {`(Rs.${price})`}
        </Text>
      </View>
    </View>
  );

  const calculateTotalPrice = updatedServiceState => {
    const basePrice = parseFloat(booking.service_price) || 0;
    let additionalCost = 0;

    const { chain, tire, headlight, brake, battery, mirror } =
      updatedServiceState;

    if (chain) { additionalCost += 50; }
    if (tire) { additionalCost += 30; }
    if (headlight) { additionalCost += 40; }
    if (brake) { additionalCost += 35; }
    if (battery) { additionalCost += 60; }
    if (mirror) { additionalCost += 25; }

    setTotalPrice(basePrice + additionalCost);
  };

  useEffect(() => {
    setIsButtonEnabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, cell, address, comments]);

  const handleServiceBooking = async () => {
    if (isButtonEnabled) {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('User token not found');
        }

        const bookingData = {
          serviceName: booking.serviceName,
          serviceBasePrice: booking.serviceBasePrice,
          name: booking.name,
          cell: booking.cell,
          address: booking.address,
          comments: booking.comments,
          bikeModel: booking.bikeModel,
          bikeName: booking.bikeName,
          bikeCompanyName: booking.bikeCompanyName,
          bikeRegNumber: booking.bikeRegNumber,
          additionalServices: [
            ...(chainLubricants ? ['Chain Lubrication'] : []),
            ...(tirePressure ? ['Tire Pressure Check'] : []),
            ...(headLightAdjustment ? ['Headlight Adjustment'] : []),
            ...(breakCheck ? ['Brake Light Check'] : []),
            ...(batteryCleaning ? ['Battery Terminal Cleaning'] : []),
            ...(mirrorAdjustment ? ['Mirror Adjustment'] : []),
          ],
          totalPrice: totalPrice,
          dropOff: dropoff,
          timestamp: Date.now(),
          status: 'pending',
        };
        console.log('services b',booking.additionalServices);
        console.log('booking data',bookingData);
        const response = await axios.post(
          `${Base_Endpoint}/api/service-booking`,
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 201) {
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 3000);

          setBatteryCleaning('');
          setChainLubricants('');
          setHeadLightAdjustment('');
          setTirePressure('');
          setBreakCheck('');
        }
      } catch (error) {
        console.error('Error submitting booking:', error);

        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 1000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDropOffChange = value => {
    setDropOff(value);
  };
const handleStatusChange = value => {
  setStatus(value);
}
  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Service Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={booking.serviceName}
              editable={false}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Service Base Price
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={booking.serviceBasePrice.toString()}
              editable={false}
            />
          </View>

          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              User Information!
            </Text>
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={name}
              // onChangeText={handleNameChange}
              editable={false}
            />
            {nameError && nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Cell
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Cell"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              keyboardType="number-pad"
              value={booking.cell}
              // onChangeText={handleCellChange}
              editable={false}
            />
            {cellError && cellError ? (
              <Text style={styles.errorText}>{cellError}</Text>
            ) : null}
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Address
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="House#123 Street#456 details"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={booking.address}
              // onChangeText={handleAddressChange}
              editable={false}
            />
            {addressError && addressError ? (
              <Text style={styles.errorText}>{addressError}</Text>
            ) : null}
          </View>

          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Vehicle Information!
            </Text>
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Bike Model
            </Text>
            <TextInput
              style={[
                styles.inputField,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}
              placeholder="Enter Bike Model"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={booking.bikeModel}
              // onChangeText={setBikeModel}
              editable={false}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Bike Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}
              placeholder="Enter Bike Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={booking.bikeName}
              // onChangeText={setBikeName}
              editable={false}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Bike Company Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}
              placeholder="Enter Bike Company Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={booking.bikeCompanyName}
              //onChangeText={setBikeCompanyName}
              editable={false}
            />
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Bike Registration Number
            </Text>
            <TextInput
              style={[
                styles.inputField,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}
              placeholder="Enter Registration Number"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={booking.bikeRegNumber}
              // onChangeText={setBikeRegNumber}
              editable={false}
            />
          </View>

          <View style={styles.extrasContainer}>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.titleText,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}>
                Additional Services!
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {renderAdditionalServices(
                'Chain Lubrication',
                50,
                booking.additionalServices.includes('Chain Lubrication'),
                () => {
                  const serviceName = 'Chain Lubrication';
                  let newState = [...booking.additionalServices];
                  if (newState.includes(serviceName)) {
                    newState = newState.filter(service => service !== serviceName);
                  } else {
                    newState.push(serviceName);
                  }
                  setChainLubricants(newState.includes(serviceName));
                  booking.additionalServices = newState;

                  calculateTotalPrice({
                    chain: newState.includes(serviceName),
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Tire Pressure Check',
                30,
                booking.additionalServices.includes('Tire Pressure Check'),
                () => {
                  const serviceName = 'Tire Pressure Check';
                  let newState = [...booking.additionalServices];
                  if (newState.includes(serviceName)) {
                    newState = newState.filter(service => service !== serviceName);
                  } else {
                    newState.push(serviceName);
                  }
                  setTirePressure(newState.includes(serviceName));
                  booking.additionalServices = newState;

                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: newState.includes(serviceName),
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Headlight Adjustment',
                40,
                booking.additionalServices.includes('Headlight Adjustment'),
                () => {
                  const serviceName = 'Headlight Adjustment';
                  let newState = [...booking.additionalServices];
                  if (newState.includes(serviceName)) {
                    newState = newState.filter(service => service !== serviceName);
                  } else {
                    newState.push(serviceName);
                  }
                  setHeadLightAdjustment(newState.includes(serviceName)); // Fixed to match boolean state logic
                  booking.additionalServices = newState;

                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: newState.includes(serviceName),
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Brake Light Check',
                35,
                booking.additionalServices.includes('Brake Light Check'),
                () => {
                  const serviceName = 'Brake Light Check';
                  let newState = [...booking.additionalServices];
                  if (newState.includes(serviceName)) {
                    newState = newState.filter(service => service !== serviceName);
                  } else {
                    newState.push(serviceName);
                  }
                  setBreakCheck(newState.includes(serviceName));
                  booking.additionalServices = newState;
                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: newState.includes(serviceName),
                    battery: batteryCleaning,
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Battery Terminal Cleaning',
                60,
                booking.additionalServices.includes('Battery Terminal Cleaning'),
                () => {
                  const serviceName = 'Battery Terminal Cleaning';
                  let newState = [...booking.additionalServices];
                  if (newState.includes(serviceName)) {
                    newState = newState.filter(service => service !== serviceName);
                  } else {
                    newState.push(serviceName);
                  }
                  setBatteryCleaning(newState.includes(serviceName));
                  booking.additionalServices = newState;

                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: newState.includes(serviceName),
                    mirror: mirrorAdjustment,
                  });
                },
              )}

              {renderAdditionalServices(
                'Mirror Adjustment',
                25,
                booking.additionalServices.includes('Mirror Adjustment'),
                () => {
                  const serviceName = 'Mirror Adjustment';
                  let newState = [...booking.additionalServices];
                  if (newState.includes(serviceName)) {
                    newState = newState.filter(service => service !== serviceName);
                  } else {
                    newState.push(serviceName);
                  }
                  setMirrorAdjustment(newState.includes(serviceName));
                  booking.additionalServices = newState;

                  calculateTotalPrice({
                    chain: chainLubricants,
                    tire: tirePressure,
                    headlight: headLightAdjustment,
                    brake: breakCheck,
                    battery: batteryCleaning,
                    mirror: newState.includes(serviceName),
                  });
                },
              )}
            </View>

          </View>

          <View style={styles.roleContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Drop Off Point
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={dropoff || booking.dropOff}
                style={[
                  styles.picker,
                  { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                ]}
                onValueChange={handleDropOffChange}>
                <Picker.Item label="Select Drop Off Point" value="" />
                <Picker.Item label="Home Service" value="Home Service" />
                <Picker.Item
                  label="Drop-off at a service center"
                  value="Drop-off at a service center"
                />
              </Picker>
            </View>
          </View>

          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Comments
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Anything else for our mechanic?"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              multiline={true}
              numberOfLines={6}
              value={booking.comments}
              onChangeText={setComments}
            />
          </View>

          <View style={styles.roleContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Status
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status || booking.status}
                style={[
                  styles.picker,
                  { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                ]}
                onValueChange={handleStatusChange}>
                <Picker.Item label="Booking Status" value="" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item
                  label="In Progress"
                  value="in progress"
                />
                <Picker.Item
                  label="Completed"
                  value="completed"
                />
              </Picker>
            </View>
          </View>


          <View style={styles.inputFieldContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Total Price
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.gray : COLORS.dark
              }
              value={`Rs. ${booking.totalPrice}`}
              editable={false}
            />
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={handleServiceBooking}
              style={[
                styles.bookBtn,
                {
                  backgroundColor: isButtonEnabled
                    ? COLORS.primary
                    : COLORS.gray,
                },
              ]}
              disabled={!isButtonEnabled}>
              <Text style={styles.bookText}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size={25} />
                ) : (
                  'Book Service'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Your service has been booked Successfully!"
        animationSource={require('../../../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <CustomModal
        visible={showErrorModal}
        title="Failure!"
        description="Error occured during booking!"
        animationSource={require('../../../../assets/animations/error.json')}
        onClose={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default ServiceBooking;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  formContainer: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.15,
    gap: height * 0.05,
  },

  imageContainer: {
    width: width * 0.9,
    height: height * 0.3,
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: height * 0.15,
    borderRadius: 10,
  },

  image: {
    width: width * 0.9,
    height: height * 0.9,
    resizeMode: 'cover',
  },

  label: {
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginBottom: height * 0.01,
  },

  inputField: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  pickerContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    height: height * 0.08,
    width: width * 0.9,
    color: COLORS.dark,
  },

  picker: {
    height: height * 0.06,
    width: width * 0.9,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  extrasContainer: {
    marginVertical: height * 0.001,
    paddingHorizontal: width * 0.02,
  },

  titleContainer: {
    marginBottom: height * 0.02,
  },

  titleText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },

  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.35,
    marginBottom: height * 0.02,
  },

  checkboxContainer: {
    marginRight: width * 0.02,
  },

  checkbox: {
    height: height * 0.036,
    width: width * 0.065,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    color: COLORS.primary,
  },

  optionTextContainer: {
    justifyContent: 'center',
    marginBottom: height * 0.01,
  },

  optionText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
  },

  optionPrice: {
    fontSize: width * 0.04,
    fontFamily: FONTS.semiBold,
  },

  btnContainer: {
    marginBottom: height * 0.02,
    width: '100%',
  },

  bookBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.024,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  bookText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.semiBold,
    paddingHorizontal: 5,
  },
});
