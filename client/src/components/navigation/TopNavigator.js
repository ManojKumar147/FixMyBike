import React from 'react';
import {View, useColorScheme, StyleSheet, Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS} from '../constants/Constants';
import AddBikes from '../screens/extraScreens/BikeManagement/AddBikes';
import MyBikes from '../screens/extraScreens/BikeManagement/MyBikes';

const Tab = createMaterialTopTabNavigator();
const {width, height} = Dimensions.get('window');

const TopNavigator = () => {
  const colorScheme = useColorScheme();

  const dynamicStyles = styles(colorScheme);

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: [
            dynamicStyles.tabBarLabel,
            {
              color: colorScheme === 'dark' ? COLORS.white : COLORS.black,
            },
          ],
          tabBarIndicatorStyle: {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.white : COLORS.primary,
            height: 3,
            borderRadius: 2,
          },
          tabBarStyle: [
            dynamicStyles.tabBar,
            {
              backgroundColor:
                colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
            },
          ],
        }}>
        <Tab.Screen
          name="Add Bike"
          component={AddBikes}
          options={{
            tabBarLabel: 'Add Bike',
            tabBarIcon: ({focused}) => (
              <Feather
                name="plus-circle"
                color={
                  focused
                    ? COLORS.primary
                    : colorScheme === 'dark'
                    ? COLORS.lightGray
                    : '#908e8c'
                }
                size={25}
              />
            ),
          }}
        />
        <Tab.Screen
          name="My Bikes"
          component={MyBikes}
          options={{
            tabBarLabel: 'My Bikes',
            tabBarIcon: ({focused}) => (
              <MaterialCommunityIcons
                name="motorbike"
                color={
                  focused
                    ? COLORS.primary
                    : colorScheme === 'dark'
                    ? COLORS.lightGray
                    : '#908e8c'
                }
                size={25}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TopNavigator;

const styles = colorScheme =>
  StyleSheet.create({
    tabBar: {
      paddingVertical: height * 0.015,
    },

    tabBarLabel: {
      fontSize: width * 0.035,
      fontFamily: FONTS.bold,
      color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
    },
  });
