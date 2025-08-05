import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import logoutAnimation from '../../../assets/animations/logout.json';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import CustomModal from './CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;

const {width, height} = Dimensions.get('window');

const LogoutModal = ({visible, title, description, onClose}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await axios.post(
          `${Base_Endpoint}/api/users/logout`,
          {},
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
      }
      await AsyncStorage.removeItem('token');
      setShowSuccessModal(true);
      setTimeout(() => {
        navigation.replace('Signin');
      }, 1500);
    } catch (error) {
      console.log('Error during logout:', error);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <LottieView
              source={logoutAnimation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.modalText}>{title}</Text>
            <Text style={styles.descriptionText}>{description}</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={onClose}>
                <View style={styles.cancelContainer}>
                  <Feather name="x-circle" size={25} color={COLORS.white} />
                  <Text style={styles.cancelText}>Cancel</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <View style={styles.proceedContainer}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator size={25} color={COLORS.white} />
                    ) : (
                      <>
                        <View style={styles.icon}>
                          <Feather
                            name="check-circle"
                            size={25}
                            color={COLORS.white}
                          />
                        </View>
                        <Text style={styles.proceedText}>Proceed</Text>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../../assets/animations/success.json')}
        title="Logout Successful!"
        description="You have been logged out successfully."
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../../assets/animations/error.json')}
        title="Logout Failed"
        description="There was an error during the logout."
      />
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
    maxHeight: height * 0.7,
  },

  animation: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 15,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: width * 0.05,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  descriptionText: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontFamily: FONTS.bold,
    fontSize: width * 0.04,
    marginBottom: 20,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 30,
    width: '100%',
  },

  cancelContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  proceedContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  cancelText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  proceedText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },

  icon: {
    top: 2,
  },
});
