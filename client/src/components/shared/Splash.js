import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  useColorScheme,
  Text,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, FONTS} from '../constants/Constants';
import BASE_URL from '../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;

const {width} = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );

    const checkLoginStatus = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const token = await AsyncStorage.getItem('token');

        if (token) {
          const response = await axios.get(
            `${Base_Endpoint}/api/users/get-users`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.status === 200) {
            navigation.replace('Main');
          } else {
            navigation.replace('Signin');
          }
        } else {
          navigation.replace('Signin');
        }
      } catch (error) {
        console.log('Error Checking Login Status:', error);
        navigation.replace('Signin');
      }
    };

    checkLoginStatus();
  }, [colorScheme, navigation]);

  const dynamicStyles = styles(colorScheme);

  return (
    <SafeAreaView style={dynamicStyles.primaryContainer}>
      <View style={dynamicStyles.secondaryContainer}>
        <View style={dynamicStyles.imgContainer}>
          <Animatable.Image
            source={require('../../assets/splashScreen/splash-logo.png')}
            animation={'fadeIn'}
            duration={1500}
            style={dynamicStyles.Img}
          />
        </View>
        <View>
          <Text style={dynamicStyles.splashTitle}>Fix My Bike</Text>
          <Text style={dynamicStyles.splashDescription}>
            Reliable Bike Repair Service.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = colorScheme =>
  StyleSheet.create({
    primaryContainer: {
      flex: 1,
      backgroundColor:
        colorScheme === 'dark' ? COLORS.darkColor : COLORS.primary,
    },

    secondaryContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    Img: {
      width: width * 0.8,
      height: width * 0.25,
    },

    splashTitle: {
      fontSize: width * 0.1,
      color: COLORS.white,
      fontFamily: FONTS.bold,
      textAlign: 'center',
    },

    splashDescription: {
      fontSize: width * 0.05,
      color: COLORS.white,
      fontFamily: FONTS.regular,
      textAlign: 'center',
    },
  });
