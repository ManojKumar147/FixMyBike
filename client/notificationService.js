/* eslint-disable quotes */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import { getMessaging, getToken, deleteToken } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

const messaging = getMessaging(getApp());

/**
 * Requests user notification permission and gets the FCM token if granted.
 */
export const requestUserPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "This app needs access to send you notifications.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await getFcmToken();
        return true;
      } else {
        console.log("Notification permission denied");
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    // No permission required on older Android or iOS
    console.log('No need to request permission on this platform');
    await getFcmToken();
    return true;
  }
};

/**
 * Gets FCM token and stores it in AsyncStorage if not already stored.
 */
export const getFcmToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('fcmToken');
    console.log('Token in AsyncStorage:', storedToken);

    if (!storedToken) {
      const newToken = await getToken(messaging);
      if (newToken) {
        console.log('Generated new FCM token:', newToken);
        await AsyncStorage.setItem('fcmToken', newToken);
      }
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

/**
 * Deletes old FCM token, gets a new one, and updates AsyncStorage.
 */
export const getNewFcmToken = async () => {
  try {
    const currentToken = await AsyncStorage.getItem('fcmToken');
    if (currentToken) {
      console.log('Deleting old FCM token:', currentToken);
      await deleteToken(messaging);
      await AsyncStorage.removeItem('fcmToken');
    }

    const newToken = await getToken(messaging);
    if (newToken) {
      console.log('New FCM token:', newToken);
      await AsyncStorage.setItem('fcmToken', newToken);
      return newToken;
    } else {
      console.warn('Failed to get new FCM token');
      return null;
    }
  } catch (error) {
    console.error('Error refreshing FCM token:', error);
    return null;
  }
};
