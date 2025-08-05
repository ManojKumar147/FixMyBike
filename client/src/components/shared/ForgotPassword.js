/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import CustomModal from '../utils/Modals/CustomModal';
import axios from 'axios'; // Import Axios
import BASE_URL from '../constants/BASE_URL'; // Import your base URL
const {Base_Endpoint} = BASE_URL; // Extract the base endpoint from the URL

const {width, height} = Dimensions.get('window');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailBorderColor, setEmailBorderColor] = useState(COLORS.dark);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [email]);

  const isValidInput = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = value => {
    setEmail(value);
    setEmailBorderColor(COLORS.dark);
  };

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Error email format';
    }
    return '';
  };

  const emailError = submitted ? validateEmail() : '';

  const handleForgotPassword = async () => {
    setSubmitted(true);
    if (!isButtonEnabled) return;

    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${Base_Endpoint}/api/users/forgot-password`,
        {
          email,
        },
      );
      console.log(response.data); // Log the response data
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      console.error(error.response.data); // Log the error response
      setShowErrorModal(true); // Show error modal
    } finally {
      setLoading(false); // Stop loading
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
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack('Auth')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeContainer}>
        <Text
          style={[
            styles.welcomeTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Not to Worry!
        </Text>
        <Text
          style={[
            styles.welcomeDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          We will send you instructions to recover it.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.emailContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.inputField,
              {
                borderColor: emailBorderColor,
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
              },
            ]}
            placeholder="Enter Your Email"
            placeholderTextColor={
              colorScheme === 'dark' ? COLORS.gray : COLORS.dark
            }
            keyboardType="email-address"
            value={email}
            onFocus={() => setEmailBorderColor(COLORS.primary)}
            onBlur={() => {
              if (submitted && validateEmail()) {
                setEmailBorderColor(COLORS.errorColor);
              } else {
                setEmailBorderColor(COLORS.dark);
              }
            }}
            onChangeText={handleEmailChange}
          />
          {submitted && emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.forgotPasswordBtnContainer}>
          <TouchableOpacity
            style={[
              styles.forgotPasswordBtn,
              {
                backgroundColor: isButtonEnabled ? COLORS.primary : COLORS.gray,
              },
            ]}
            disabled={!isButtonEnabled}
            onPress={handleForgotPassword} // Trigger password reset
          >
            <Text style={styles.forgotPasswordText}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} size={25} />
              ) : (
                'Send Email'
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="Success!"
        description="We've Sent An Email For Resetting Your Password. Kindly Check Your Inbox To Initiate The Password Recovery Process."
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../assets/animations/error.json')}
        title="Failure!"
        description="The Given Email Does Not Exist In Our Database!"
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  welcomeContainer: {
    marginTop: height * 0.15,
    marginLeft: width * 0.05,
  },

  welcomeTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  welcomeDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  formContainer: {
    marginTop: height * 0.05,
    marginHorizontal: width * 0.05,
    gap: 20,
  },

  label: {
    fontSize: width * 0.05,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginBottom: height * 0.01,
  },

  inputField: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.02,
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  forgotPasswordBtnContainer: {
    width: '100%',
  },

  forgotPasswordBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.015,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  forgotPasswordText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  errorText: {
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.regular,
    paddingHorizontal: 5,
    top: 5,
  },
});
