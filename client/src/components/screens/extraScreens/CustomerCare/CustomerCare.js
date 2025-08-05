/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const { width, height } = Dimensions.get('window');

const CustomerCare = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [showForm, setShowForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const getFeedback = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.replace('Signin');
      return;
    }
    try {
      const response = await axios.get(
        `${Base_Endpoint}/api/feedback/get-feedback`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedbacks(response.data);
    } catch (error) {
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    getFeedback();
  }, []);

  const handleSendFeedback = async () => {
    if (!feedbackTitle.trim() || !feedbackMessage.trim()) {
      alert('Please fill in both title and message.');
      return;
    }
    setFeedbackLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Signin');
        return;
      }
      const response = await axios.post(
        `${Base_Endpoint}/api/feedback/create-feedback`,
        {
          title: feedbackTitle,
          message: feedbackMessage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setFeedbackTitle('');
        setFeedbackMessage('');
        setShowForm(false);
        getFeedback();
        alert('Feedback sent!');
      } else {
        alert('Failed to send feedback.');
      }
    } catch (err) {
      alert('Failed to send feedback.');
    }
    setFeedbackLoading(false);
  };

  const renderForm = () => (
    <View style={styles.formModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formContent}
      >
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => setShowForm(false)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.formTitle}>Send Feedback</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={COLORS.gray}
          value={feedbackTitle}
          onChangeText={setFeedbackTitle}
        />
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Message"
          placeholderTextColor={COLORS.gray}
          value={feedbackMessage}
          onChangeText={setFeedbackMessage}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendFeedback}
          disabled={feedbackLoading}
        >
          <Text style={styles.sendButtonText}>
            {feedbackLoading ? 'Sending...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}
    >
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.headerTitleText,
              { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
            ]}
          >
            Customer Care
          </Text>
          <Text
            style={[
              styles.headerDescriptionText,
              { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
            ]}
          >
            Talk With Our Customer Care.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View
            style={[
              styles.customerCareCard,
              {
                backgroundColor: COLORS.white,
                borderColor: COLORS.primary,
                borderWidth: 1.5,
              },
            ]}
          >
            <View style={styles.customerCareContainer}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.primary
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.primary : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                      fontFamily: FONTS.bold,
                    }}
                  >
                    Chat With Us!
                  </Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Chat_Bot')}
                  >
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
        </View>

        {/* Feedback List */}
        <View style={styles.feedbackListContainer}>
          <Text style={styles.feedbackListHeading}>Your Feedback</Text>
          {feedbacks.length === 0 ? (
            <Text style={styles.noFeedbackText}>There is no feedback.</Text>
          ) : (
            feedbacks.map(item => (
  <View key={item._id} style={styles.feedbackCard}>
    <Text style={styles.feedbackTitle}>{item.title}</Text>
    <Text style={styles.feedbackMessage}>{item.message}</Text>
    <View style={styles.statusRow}>
      <Text
        style={[
          styles.feedbackStatus,
          item.status === 'responded' && { color: COLORS.success },
        ]}
      >
        Status:{' '}
        <Text
          style={{
            color:
              item.status === 'pending'
                ? COLORS.errorColor
                : COLORS.success,
            fontWeight: 'bold',
          }}
        >
          {item.status}
        </Text>
      </Text>
      {item.status === 'responded' && (
        <Feather name="check-circle" size={22} color={COLORS.success} style={{ marginLeft: 8 }} />
      )}
    </View>
    {item.status === 'responded' && item.response && (
      <View style={styles.responseBox}>
        <Text style={styles.responseLabel}>Response:</Text>
        <Text style={styles.responseText}>{item.response}</Text>
      </View>
    )}
  </View>
))
          )}
        </View>

      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowForm(true)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="plus" size={32} color={COLORS.white} />
      </TouchableOpacity>

      {/* Feedback Form Modal */}
      {showForm && renderForm()}
    </SafeAreaView >
  );
};

export default CustomerCare;

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
    paddingTop: height * 0.12,
    paddingBottom: 30,
    minHeight: height,
  },

  headerTextContainer: {
    marginLeft: width * 0.05,
    marginBottom: 20,
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
    marginTop: 4,
  },

  cardContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  customerCareCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: width * 0.92,
    marginBottom: 10,
  },

  customerCareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  icon: {
    color: COLORS.dark,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
  },

  // Feedback Modal
  formModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  formContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    alignItems: 'center',
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  formTitle: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: FONTS.semiBold,
    backgroundColor: COLORS.white,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  feedbackListContainer: {
    marginHorizontal: 10,
    marginTop: 0, // move up
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    alignItems: 'center',
  },
  feedbackListHeading: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 16,
    alignSelf: 'center',
  },
  noFeedbackText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginVertical: 10,
  },
  feedbackCard: {
  backgroundColor: COLORS.white,
  borderRadius: 20,
  paddingVertical: 26,
  paddingHorizontal: 26,
  marginBottom: 22,
  width: width * 0.96,
  minHeight: 110,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.13,
  shadowRadius: 10,
  elevation: 4,
  borderWidth: 2,
  borderColor: COLORS.primary,
  justifyContent: 'center',
  alignSelf: 'center',
},
feedbackTitle: {
  fontSize: 22,
  fontFamily: FONTS.bold,
  color: COLORS.primary,
  marginBottom: 6,
  letterSpacing: 0.5,
  textTransform: 'capitalize',
},
statusRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},
  feedbackStatus: {
  fontSize: 16,
  fontFamily: FONTS.bold,
  color: COLORS.dark,
},
responseBox: {
  marginTop: 12,
  backgroundColor: '#eafaf1',
  borderRadius: 10,
  padding: 14,
  borderWidth: 1.5,
  borderColor: COLORS.success,
},
responseLabel: {
  fontSize: 15,
  fontFamily: FONTS.bold,
  color: COLORS.success,
  marginBottom: 4,
},
responseText: {
  fontSize: 15,
  fontFamily: FONTS.medium,
  color: COLORS.dark,
  lineHeight: 20,
},
});