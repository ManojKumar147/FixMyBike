import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {COLORS, FONTS} from '../../../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../../../utils/Modals/CustomModal';
import axios from 'axios';
import BASE_URL from '../../../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;
const {width, height} = Dimensions.get('window');

const AddBikes = () => {
  const [bikeModel, setBikeModel] = useState('');
  const [bikeName, setBikeName] = useState('');
  const [bikeCompanyName, setBikeCompanyName] = useState('');
  const [bikeRegNumber, setBikeRegNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [bikeModelError, setBikeModelError] = useState('');
  const [bikeNameError, setBikeNameError] = useState('');
  const [bikeCompanyNameError, setBikeCompanyNameError] = useState('');
  const [bikeRegNumberError, setBikeRegNumberError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const colorScheme = useColorScheme();

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [bikeModel, bikeName, bikeCompanyName, bikeRegNumber]);

  const isValidInput = () => {
    return (
      bikeModelError === '' &&
      bikeNameError === '' &&
      bikeCompanyNameError === '' &&
      bikeRegNumberError === '' &&
      bikeModel !== '' &&
      bikeName !== '' &&
      bikeCompanyName !== '' &&
      bikeRegNumber !== ''
    );
  };

  const handleBikeModelChange = value => {
    setBikeModel(value);
    const modelPattern = /^[a-zA-Z0-9\s]+$/;
    if (!modelPattern.test(value)) {
      setBikeModelError(
        'Bike model should only contain alphanumeric characters.',
      );
    } else {
      setBikeModelError('');
    }
  };

  const handleBikeNameChange = value => {
    setBikeName(value);
    const namePattern = /^[a-zA-Z0-9\s]+$/;
    if (!namePattern.test(value)) {
      setBikeNameError('Bike name should only contain alphabetic characters.');
    } else {
      setBikeNameError('');
    }
  };

  const handleBikeCompanyNameChange = value => {
    setBikeCompanyName(value);
    const companyPattern = /^[a-zA-Z\s]+$/;
    if (!companyPattern.test(value)) {
      setBikeCompanyNameError(
        'Bike company name should only contain alphabetic characters.',
      );
    } else {
      setBikeCompanyNameError('');
    }
  };

  const handleBikeRegNumberChange = value => {
    setBikeRegNumber(value);
    const regNumberPattern = /^[A-Z]{2,3}[0-9]{3,4}$/;
    if (!regNumberPattern.test(value)) {
      setBikeRegNumberError('Registration number should be in format ABC123.');
    } else {
      setBikeRegNumberError('');
    }
  };

  const handleAddBike = async () => {
    if (!isValidInput()) return;

    setLoading(true);
    const bikeData = {
      bike_model: bikeModel,
      bike_name: bikeName,
      bike_company_name: bikeCompanyName,
      bike_registration_number: bikeRegNumber,
    };

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        `${Base_Endpoint}/api/bikes/add-bike`,
        bikeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);

        setBikeModel('');
        setBikeName('');
        setBikeCompanyName('');
        setBikeRegNumber('');
      }
    } catch (error) {
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Model
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Enter Bike Model"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={bikeModel}
              onChangeText={handleBikeModelChange}
            />
            {bikeModelError && (
              <Text style={styles.errorText}>{bikeModelError}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Enter Bike Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={bikeName}
              onChangeText={handleBikeNameChange}
            />
            {bikeNameError && (
              <Text style={styles.errorText}>{bikeNameError}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Company Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Enter Bike Company Name"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={bikeCompanyName}
              onChangeText={handleBikeCompanyNameChange}
            />
            {bikeCompanyNameError && (
              <Text style={styles.errorText}>{bikeCompanyNameError}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Registration Number
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}
              placeholder="Enter Registration Number"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={bikeRegNumber}
              onChangeText={handleBikeRegNumberChange}
            />
            {bikeRegNumberError && (
              <Text style={styles.errorText}>{bikeRegNumberError}</Text>
            )}
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                {
                  backgroundColor: isButtonEnabled
                    ? COLORS.primary
                    : COLORS.gray,
                },
              ]}
              disabled={!isButtonEnabled}
              onPress={handleAddBike}>
              <Text style={styles.submitText}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size={25} />
                ) : (
                  'Add Bike'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Bike Added Successfully"
        animationSource={require('../../../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <CustomModal
        visible={showErrorModal}
        title="Failure!"
        description="Error Adding Bike!"
        animationSource={require('../../../../assets/animations/error.json')}
        onClose={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default AddBikes;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  formContainer: {
    marginTop: height * 0.08,
    marginHorizontal: width * 0.05,
    gap: 35,
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
    height: height * 0.06,
  },

  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitBtn: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },

  submitText: {
    fontSize: width * 0.05,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  errorText: {
    color: COLORS.errorColor,
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.035,
    left: width * 0.015,
  },
});
