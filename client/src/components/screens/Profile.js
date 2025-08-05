/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../constants/Constants';
import LogoutModal from '../utils/Modals/LogoutModal';
import DeleteAccountModal from '../utils/Modals/DeleteAccountModal';
import CustomModal from '../utils/Modals/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
import { getNewFcmToken } from '../../../notificationService';
const { width, height } = Dimensions.get('window');

const Profile = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [role, setRole] = useState();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const refreshToken = async () => {
    const newToken = await getNewFcmToken();
    if (newToken) {
      // Send token to your backend if needed
      console.log('Refreshed token:', newToken);
    }
  };
  const handleLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleDeleteAccountModal = () => {
    setShowDeleteAccountModal(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: `${Base_Endpoint}/api/users/get-users`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRole(response.data.User.role);
      } catch (error) {
        console.error('Error fetching user role:', error.message);
      }
    };
    fetchUser();
  }, []);

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
        <TouchableOpacity onPress={() => navigation.goBack('')}>
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
            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
          ]}>
          Profile
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
          ]}>
          Your Profile - Preferences.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={[
            styles.cardContainer,
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          ]}>
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.container}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="edit"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Edit Profile:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Edit_Profile')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>


          {role === 'customer' && (
            <>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name="shield"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Genrate New Token:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={refreshToken}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name="bell"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Notifications Management:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons
                        name="motorbike"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Bike Management:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('My_Bikes')}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

            </>
          )}

          {/* <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.container}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="feedback"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Feedback:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('FeedbackScreen')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View> */}

          {( role === 'customer') && (
            <>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name="book"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        My Bookings:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('My_Bookings')}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name="grid"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Services History:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Services')}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )
          }

          {role === 'mechanic' && (
            <>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name="book"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Bookings:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('My_Bookings')}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name="grid"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Booking History:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Services')}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
       { role === 'seller' && (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.container}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="view-list-outline"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Orders:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CustomerOrders')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.container}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="headset"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Help & Support:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Customer_Care')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.container}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="help-rhombus"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Emergency assistance:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Emergency_Assistance')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.container}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="location-enter"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    service center:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Service_Center_Locator')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name="clipboard"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Service Shops:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Shops', { role: 'mechanic' })}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
                  },
                ]}>
                <View style={styles.container}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name="layers"
                        size={25}
                        style={[
                          styles.icon,
                          {
                            color:
                              colorScheme === 'dark'
                                ? COLORS.white
                                : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={{
                          color:
                            colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                          fontSize: width * 0.045,
                          marginLeft: 10,
                        }}>
                        Product Shops:{' '}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Shops', { role: 'seller', allShop: null })}>
                        <Feather
                          name="chevron-right"
                          size={30}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View> */}

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.container}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="rotate-cw"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                    }}>
                    Change Password:{' '}
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Change_Password')}>
                    <Feather
                      name="chevron-right"
                      size={30}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={handleDeleteAccountModal}>
            <View
              style={[
                styles.deleteContainer,
                colorScheme === 'dark' && { backgroundColor: COLORS.errorColor },
              ]}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="trash"
                    size={25}
                    color={
                      colorScheme === 'dark' ? COLORS.white : COLORS.errorColor
                    }
                    style={{ bottom: 2 }}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.deleteText,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.errorColor,
                      },
                    ]}>
                    Delete Account
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogoutModal}>
            <View
              style={[
                styles.logoutContainer,
                colorScheme === 'dark' ? COLORS.primary : COLORS.primary,
              ]}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="log-out"
                    size={25}
                    color={COLORS.white}
                    style={{ bottom: 2 }}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.deleteText,
                      {
                        color:
                          colorScheme === 'dark' ? COLORS.white : COLORS.white,
                      },
                    ]}>
                    Logout
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout!"
        description="Are Your Sure You Want To Logout ?"
      />

      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account!"
        description="Are Your Sure You Want To Delete Your Account ?"
      />

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="Success!"
        description="Image Uploaded Successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        description="Error Fetching User Data. Please Try Again Later."
        animationSource={require('../../assets/animations/error.json')}
      />
    </SafeAreaView>
  );
};

export default Profile;

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

  scrollContainer: {
    paddingTop: height * 0.025,
  },

  headerTextContainer: {
    marginTop: height * 0.12,
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

  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    gap: 20,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
    gap: 20,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },

  icon: {
    color: COLORS.dark,
  },

  btnContainer: {
    marginTop: height * 0.01,
    gap: 20,
  },

  deleteContainer: {
    width: 350,
    alignItems: 'center',
    padding: height * 0.015,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.errorColor,
    borderRadius: 10,
  },

  deleteText: {
    fontSize: width * 0.045,
    color: COLORS.errorColor,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    marginBottom: 5,
  },

  logoutContainer: {
    width: 350,
    alignItems: 'center',
    padding: height * 0.015,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  logoutText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
});
