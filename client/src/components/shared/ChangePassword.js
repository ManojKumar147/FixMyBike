/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, FONTS} from '../constants/Constants';
import CustomModal from '../utils/Modals/CustomModal';
import BASE_URL from '../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;

const {width, height} = Dimensions.get('window');

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword1, setHidePassword1] = useState(true);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${Base_Endpoint}/api/users/get-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setEmail(response.data.User.email);
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  };

  useEffect(() => {
    setIsButtonEnabled(isValidInput());
  }, [currentPassword, newPassword]);

  const isValidInput = () => {
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    const isCurrentPasswordValid = passwordPattern.test(currentPassword);
    const isNewPasswordValid = passwordPattern.test(newPassword);

    return isCurrentPasswordValid && isNewPasswordValid;
  };

  const handleCurrentPasswordChange = value => {
    setCurrentPassword(value);
    const currentPasswordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (value && !currentPasswordPattern.test(value)) {
      setCurrentPasswordError('Password must be 8 characters long');
    } else {
      setCurrentPasswordError('');
    }
  };

  const handleNewPasswordChange = value => {
    setNewPassword(value);
    const newPasswordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (value && !newPasswordPattern.test(value)) {
      setNewPasswordError('Password must be 8 characters long');
    } else {
      setNewPasswordError('');
    }
  };

  const validateCurrentPassword = () => {
    if (!currentPassword) {
      return 'Current Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(currentPassword)) {
      return 'Current Password must contain at least 6 characters including a number, a special character, and both upper and lowercase letters';
    }
    return '';
  };

  const validateNewPassword = () => {
    if (!newPassword) {
      return 'New Password is required';
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return 'New Password must contain at least 6 characters including a number, a special character, and both upper and lowercase letters';
    }
    return '';
  };

  const handleChangePassword = async () => {
    setLoading(true);

    const currentPasswordError = validateCurrentPassword();
    const newPasswordError = validateNewPassword();

    if (currentPasswordError || newPasswordError) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${Base_Endpoint}/api/users/reset-password`,
        {
          email,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setShowSuccessModal(true);

      setTimeout(async () => {
        setShowSuccessModal(false);
        setLoading(false);

        // Clear user token from AsyncStorage
        await AsyncStorage.removeItem('token');

        // Reset the navigation stack and navigate to SignIn
        navigation.reset({
          index: 0,
          routes: [{name: 'Signin'}],
        });
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setShowErrorModal(true);
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
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Change Password
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Change your account password from here.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.passwordContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            Current Password
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[
                styles.inputField,
                {
                  flex: 1,
                  paddingRight: 40,
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your Current Password"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={currentPassword}
              secureTextEntry={hidePassword}
              onChangeText={handleCurrentPasswordChange}
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
          {currentPasswordError && currentPasswordError ? (
            <Text style={styles.errorText}>{currentPasswordError}</Text>
          ) : null}
        </View>

        <View style={styles.passwordContainer}>
          <Text
            style={[
              styles.label,
              {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
            ]}>
            New Password
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[
                styles.inputField,
                {
                  flex: 1,
                  paddingRight: 40,
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              placeholder="Enter Your New Password"
              placeholderTextColor={
                colorScheme === 'dark' ? COLORS.white : COLORS.dark
              }
              value={newPassword}
              secureTextEntry={hidePassword1}
              onChangeText={handleNewPasswordChange}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setHidePassword1(!hidePassword1)}>
              <Feather
                name={hidePassword1 ? 'eye-off' : 'eye'}
                size={25}
                color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
              />
            </TouchableOpacity>
          </View>
          {newPasswordError && newPasswordError ? (
            <Text style={styles.errorText}>{newPasswordError}</Text>
          ) : null}
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={handleChangePassword}
            style={[
              styles.changePasswordBtn,
              {
                backgroundColor: isButtonEnabled ? COLORS.primary : COLORS.gray,
              },
            ]}
            disabled={!isButtonEnabled}>
            <Text style={styles.ChangePasswordText}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} size={25} />
              ) : (
                'Change Password'
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please Wait While We're Changing Your Account Password."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Your Account Password Has Been Changed Successfully Next Time Login With Your New Password"
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
    </SafeAreaView>
  );
};

export default ChangePassword;

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

  headerTextContainer: {
    marginTop: height * 0.15,
    marginLeft: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  formContainer: {
    marginTop: height * 0.05,
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
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    fontSize: width * 0.045,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },

  eyeIconContainer: {
    position: 'absolute',
    right: width * 0.03,
  },

  btnContainer: {
    position: 'absolute',
    top: height * 0.3,
    width: '100%',
  },

  changePasswordBtn: {
    width: '100%',
    alignItems: 'center',
    padding: height * 0.015,
    top: height * 0.035,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  ChangePasswordText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },

  errorText: {
    position: 'absolute',
    bottom: -25,
    fontSize: width * 0.04,
    color: COLORS.errorColor,
    fontFamily: FONTS.regular,
    paddingHorizontal: 5,
  },
});
