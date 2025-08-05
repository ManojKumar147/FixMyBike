/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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
  Image,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import CustomModal from '../utils/Modals/CustomModal';
import axios from 'axios';
import BASE_URL from '../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const { width, height } = Dimensions.get('window');
// ...existing code...
const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  });

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [email, password]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '784005146357-l7cjdvqs488cpa32qi9id0ap5gdqvtnk.apps.googleusercontent.com',
    });
  }, []);

  const isValidInput = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = passwordPattern.test(password);

    return isEmailValid && isPasswordValid;
  };

  const handleEmailChange = value => {
    setEmail(value);
    if (value === '') {
      setEmailError('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = value => {
    setPassword(value);
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (value === '') {
      setPasswordError('Password is required');
    } else if (!passwordPattern.test(value)) {
      setPasswordError('Password must be 8 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const validateEmail = () => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = () => {
    if (!password) {
      return 'Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be 8 characters long.';
    }
    return '';
  };

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      const response = await axios.post(
        `${Base_Endpoint}/api/social-auth/google-signin`,
        {
          idToken,
        },
      );

      const { token, user } = response.data;
      console.log('Login successful:', token, user);
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    const emailError = validateEmail();
    const passwordError = validatePassword();

    if (emailError || passwordError) {
      setLoading(false);
      return;
    }

    setShowAuthModal(true);

    // --- FCM TOKEN LOGIC START ---
    let fcmToken = null;
    try {
      fcmToken = await AsyncStorage.getItem('fcmToken');
      if (fcmToken) {
        console.log('FCM token retrieved from AsyncStorage:', fcmToken);
      } else {
        console.log('No FCM token found in AsyncStorage.');
      }
    } catch (fcmError) {
      console.log('Could not get FCM token:', fcmError);
    }
    // --- FCM TOKEN LOGIC END ---

    const data = {
      email: email,
      password: password,
      fcm_token: fcmToken, // send FCM token to backend
    };

    try {
      const response = await axios.post(
        `${Base_Endpoint}/api/users/signin`,
        data,
      );

      if (response.status === 200 || response.status === 201) {
        const token = response.data.token;

        await AsyncStorage.setItem('token', token);

        console.log('Login successful. Token:', token);
        setShowAuthModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('Main');
        }, 2000);
      }
    } catch (error) {
      console.error('Error during login:', error);

      setShowAuthModal(false);

      // Debug: log the error message
      const backendMsg = error?.response?.data?.message;
      console.log('Login error message:', backendMsg);

      if (
        backendMsg &&
        backendMsg.toLowerCase().includes("blocked")
      ) {
        setShowBlockedModal(true);
      } else {
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
      }
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

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.welcomeContainer}>
          <Text
            style={[
              styles.welcomeTitleText,
              { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
            ]}>
            Welcome Back
          </Text>
          <Text
            style={[
              styles.welcomeDescriptionText,
              { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
            ]}>
            Please fill up the form to login.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.emailContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Email"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              keyboardType="email-address"
              value={email}
              onChangeText={handleEmailChange}
            />
            {emailError && emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.passwordContainer}>
            <Text
              style={[
                styles.label,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Password
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    flex: 1,
                    paddingRight: 40,
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}
                placeholder="Enter Your Password(Abc@1234)"
                placeholderTextColor={
                  colorScheme === 'dark' ? COLORS.white : COLORS.dark
                }
                value={password}
                secureTextEntry={hidePassword}
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setHidePassword(!hidePassword)}>
                <Feather
                  name={hidePassword ? 'eye-off' : 'eye'}
                  size={25}
                  color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                />
              </TouchableOpacity>
            </View>
            {passwordError && passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Forgot_Password')}>
              <Text
                style={[
                  styles.forgotPasswordText,
                  {
                    color:
                      colorScheme === 'dark' ? COLORS.white : COLORS.primary,
                  },
                ]}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.authButtonContainer}>
            <TouchableOpacity
              onPress={handleGoogleSignin}
              style={[
                styles.googleButtonContainer,
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? COLORS.googleButton
                      : COLORS.googleButton,
                },
              ]}>
              {googleLoading ? (
                <ActivityIndicator size={25} color={COLORS.dark} />
              ) : (
                <>
                  <Image
                    source={require('../../assets/png/google-icon.png')}
                    style={styles.icon}
                  />

                  <Text
                    style={[
                      styles.googleButtonText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.dark : COLORS.dark,
                      },
                    ]}>
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[
                styles.signinBtn,
                {
                  backgroundColor: isButtonEnabled
                    ? COLORS.primary
                    : COLORS.gray,
                },
              ]}
              disabled={!isButtonEnabled}
              onPress={handleLogin}>
              <Text style={styles.signinText}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size={25} />
                ) : (
                  'Sign In'
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.extraContainer}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                fontFamily: FONTS.bold,
              }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.extraText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please Wait While Logging In Your Account."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showGoogleAuthModal}
        onClose={() => setShowGoogleAuthModal(false)}
        animationSource={require('../../assets/animations/google.json')}
        title="Trying To Login!"
        description="Please Wait While We're Trying To Login With Your Google Account."
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Login Successfully"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <CustomModal
        visible={showErrorModal}
        title="Failure!"
        description="Something Went Wrong"
        animationSource={require('../../assets/animations/error.json')}
        onClose={() => setShowErrorModal(false)}
      />

      <CustomModal
        visible={showBlockedModal}
        title="User Blocked"
        description="Your account is blocked. Please contact support."
        animationSource={require('../../assets/animations/error.json')}
        onClose={() => setShowBlockedModal(false)}
      />

    </SafeAreaView>
  );
};

export default Signin;

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

  scrollViewContainer: {
    paddingVertical: height * 0.03,
    marginTop: height * 0.005,
  },

  welcomeContainer: {
    marginTop: height * 0.1,
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
    marginTop: height * 0.02,
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
    color: COLORS.dark,
  },

  eyeIconContainer: {
    position: 'absolute',
    right: width * 0.03,
  },

  forgotPasswordContainer: {
    top: height * 0.01,
  },

  forgotPasswordText: {
    fontSize: width * 0.035,
    textAlign: 'right',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },

  authButtonContainer: {
    flexDirection: 'column',
    paddingHorizontal: width * 0.02,
    gap: height * 0.02,
    marginTop: height * 0.02,
  },

  googleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: height * 0.018,
    width: '100%',
    gap: 10,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  googleButtonText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.bold,
  },

  icon: {
    resizeMode: 'contain',
    width: width * 0.12,
    height: height * 0.045,
    top: 2,
  },

  btnContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },

  signinBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.015,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  signinText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    top: height * 0.065,
    padding: height * 0.05,
    gap: 20,
  },

  extraText: {
    fontSize: width * 0.045,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
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