import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {COLORS, FONTS} from '../../constants/Constants';

const {width, height} = Dimensions.get('window');

const CustomModal = ({
  visible,
  onClose,
  title,
  description,
  animationSource,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {animationSource && (
              <LottieView
                source={animationSource}
                autoPlay
                loop
                style={styles.animation}
              />
            )}
            {title && <Text style={styles.modalText}>{title}</Text>}
            {description && (
              <Text style={styles.descriptionText}>{description}</Text>
            )}
            <View style={styles.buttonContainer}>
              {primaryButtonText && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onPrimaryButtonPress}>
                  <Text style={styles.primaryButtonText}>
                    {primaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
              {secondaryButtonText && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onSecondaryButtonPress}>
                  <Text style={styles.secondaryButtonText}>
                    {secondaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;

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
    maxHeight: height * 0.8,
  },

  animation: {
    width: width * 0.5,
    height: width * 0.5,
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
    color: COLORS.dark,
    fontFamily: FONTS.bold,
    fontSize: width * 0.04,
  },

  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: width * 0.04,
  },

  secondaryButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: width * 0.04,
  },
});
