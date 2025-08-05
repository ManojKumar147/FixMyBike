/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import imgPlaceHolder from '../../../../assets/placeholders/default-avatar.png';
import axios from 'axios';
import CustomModal from '../../../utils/Modals/CustomModal';
import ImageUploadModal from '../../../utils/Modals/ImageUploadModal';
import BASE_URL from '../../../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;

const {width, height} = Dimensions.get('window');

const DetailProfileScreen = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showNameUpdateModal, setShowNameUpdateModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const colorScheme = useColorScheme();
  const [newImageURL, setNewImageURL] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          navigation.replace('Signin');
          return;
        }

        setToken(storedToken);

        const response = await axios.get(
          `${Base_Endpoint}/api/users/get-users`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );
console.log(response.data);
        const user = response.data.User;
        if (user) {
          setUserId(user._id);
          setName(user.full_name);
          setPhone(user.phone_number);
          setAddress(user.address);
          setPhotoURL(user.profile_image || '');
        }
      } catch (error) {
        navigation.replace('Signin');
      }
    };

    fetchUserData();
  }, []);

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageURL(url);
    setIsEdited(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (name) formData.append('full_name', name);
      if (newImageURL)
        formData.append('profile_image', {
          uri: newImageURL,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });

      const response = await axios.put(
        `${Base_Endpoint}/api/users/update-user/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setShowNameUpdateModal(true);
        setTimeout(() => {
          setShowNameUpdateModal(false);
        }, 2000);
      } else {
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
      }
    } catch (error) {
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = () => {
    setIsEdited(true);
  };

  const isUpdateEnabled = () => {
    return isEdited;
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
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Edit Profile
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          You can edit your profile here.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            onPress={handleImagePress}
            style={styles.imgContainer}>
            {newImageURL || photoURL ? (
              <Image
                source={{uri: newImageURL || photoURL}}
                style={styles.image}
              />
            ) : (
              <Image source={imgPlaceHolder} style={styles.image} />
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <View style={styles.nameContainer}>
              <Text
                style={[
                  styles.label,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                Full Name
              </Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}
                placeholderTextColor={
                  colorScheme === 'dark' ? COLORS.white : COLORS.dark
                }
                value={name}
                onChangeText={text => {
                  setName(text);
                  handleFieldChange();
                }}
              />
            </View>

            <View style={styles.phoneContainer}>
              <Text
                style={[
                  styles.label,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                Phone
              </Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}
                placeholderTextColor={
                  colorScheme === 'dark' ? COLORS.white : COLORS.dark
                }
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                  handleFieldChange();
                }}
              />
            </View>

            <View style={styles.addressContainer}>
              <Text
                style={[
                  styles.label,
                  {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
                ]}>
                Address
              </Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                  },
                ]}
                placeholderTextColor={
                  colorScheme === 'dark' ? COLORS.white : COLORS.dark
                }
                value={address}
                onChangeText={text => {
                  setAddress(text);
                  handleFieldChange();
                }}
              />
            </View>
          </View>

          <View style={styles.editButtonContainer}>
            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={!isUpdateEnabled()}>
              <View
                style={[
                  styles.editContainer,
                  {
                    backgroundColor: isUpdateEnabled()
                      ? COLORS.primary
                      : COLORS.gray,
                  },
                ]}>
                <View style={styles.leftContainer}>
                  {loading ? (
                    <ActivityIndicator size={25} color={COLORS.white} />
                  ) : (
                    <>
                      <View style={styles.iconContainer}>
                        <Feather
                          name="edit"
                          size={25}
                          color={COLORS.white}
                          style={{bottom: 2}}
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={[styles.editText, {color: COLORS.white}]}>
                          Update
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        userId={userId}
        token={token}
        onImageUpload={handleImageUpload}
        title="Upload Image!"
        description="Please Choose Your Profile Picture To Upload."
      />

      <CustomModal
        visible={showNameUpdateModal}
        onClose={() => setShowNameUpdateModal(false)}
        animationSource={require('../../../../assets/animations/success.json')}
        title="Success!"
        description="Profile updated successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../../../assets/animations/error.json')}
        title="Update Failed"
        description="There was an error updating your profile!"
      />
    </SafeAreaView>
  );
};

export default DetailProfileScreen;

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

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.005,
  },

  cardContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.02,
    gap: height * 0.005,
  },

  imgContainer: {
    marginBottom: 20,
  },

  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.3) / 2,
    resizeMode: 'cover',
  },

  editButtonContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },

  editContainer: {
    width: width * 0.9,
    alignItems: 'center',
    paddingVertical: height * 0.018,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  editText: {
    fontSize: width * 0.045,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    marginLeft: 10,
  },

  infoContainer: {
    alignItems: 'center',
    gap: height * 0.02,
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
    width: width * 0.9,
  },
});
