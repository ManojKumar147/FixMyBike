/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS } from '../constants/Constants';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Map from '../screens/extraScreens/Map/Map';
import ItemsDashboard from '../screens/extraScreens/CustomerScreen/ItemsDashboard';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

const BottomNavigator = () => {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null);
  useEffect(() => {
    console.log('User role in BottomNavigator:', user); // Console the role
  }, [user]);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Home"
        children={(props) => (
          <Home {...props} setUser={setUser} />
        )}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/home-fill.png')
                    : require('../../assets/navigatorIcons/home.png')
                }
                style={[
                  styles.image,
                  { tintColor: focused ? COLORS.primary : COLORS.lightGray },
                ]}
              />
            </View>
          ),
        }}
      />

      {user === 'mechanic' && (<Tab.Screen
        name="Map"
        children={(props) => (
          <Map {...props} />
        )}
        options={{
          tabBarLabel: 'Map',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/home-fill.png')
                    : require('../../assets/navigatorIcons/home.png')
                }
                style={[
                  styles.image,
                  { tintColor: focused ? COLORS.primary : COLORS.lightGray },
                ]}
              />
            </View>
          ),
        }}
      />)
      }
      {user == 'customer' && (
        <>
        <Tab.Screen
          name="Shops"
          component={ItemsDashboard}
          initialParams={{ role: 'seller', allShop: null }}
          options={{
            tabBarLabel: 'Products',
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({ focused }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={
                    focused
                      ? require('../../assets/navigatorIcons/box-fill.png')
                      : require('../../assets/navigatorIcons/box.png')
                  }
                  style={[
                    styles.image,
                    { tintColor: focused ? COLORS.primary : COLORS.lightGray },
                  ]}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
      name="ItemsDashboard"  // another unique name
      component={ItemsDashboard}
      initialParams={{ role: 'mechanic', allShop: null, type: 'services' }}
      options={{
        tabBarLabel: 'Services',
        tabBarIcon: ({ focused }) => (
          <View style={styles.imageContainer}>
            <Image
              source={
                focused
                ? require('../../assets/navigatorIcons/service-fill.png')
                : require('../../assets/navigatorIcons/service.png')
              }
              style={[
                styles.image,
                { tintColor: focused ? COLORS.primary : COLORS.lightGray },
              ]}
            />
          </View>
        ),
      }}
    />
    </>
      )
      }
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <View style={styles.imageContainer}>
              <Image
                source={
                  focused
                    ? require('../../assets/navigatorIcons/profile-fill.png')
                    : require('../../assets/navigatorIcons/profile.png')
                }
                style={[
                  styles.image,
                  { tintColor: focused ? COLORS.primary : COLORS.lightGray },
                ]}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: height * 0.08,
    elevation: 8,
  },

  tabBarLabel: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginBottom: height * 0.01,
  },

  imageContainer: {
    marginTop: height * 0.01,
  },

  image: {
    width: width * 0.07,
    height: height * 0.04,
    resizeMode: 'contain',
  },
});
