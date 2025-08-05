/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;

const Feedback = () => {
  const navigation = useNavigation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);

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

  const handleRespond = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText('');
    setShowModal(true);
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      alert('Please enter a response.');
      return;
    }
    setSending(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${Base_Endpoint}/api/feedback/update-response/${selectedFeedback._id}/respond`,
        { response: responseText },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      setResponseText('');
      setSelectedFeedback(null);
      getFeedback();
      alert('Response sent!');
    } catch (err) {
      alert('Failed to send response.');
    }
    setSending(false);
  };

  return (
    <View style={styles.container}>
      {/* Header with back arrow */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Feather name="arrow-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.heading}>Feedback</Text>
        <View />
      </View>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {feedbacks.length === 0 ? (
          <Text style={styles.noFeedbackText}>There is no feedback.</Text>
        ) : (
          feedbacks.map(item => (
            <View key={item._id} style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>{item.title}</Text>
              <Text style={styles.feedbackEmail}>{item.userId?.email}</Text>
              <Text style={styles.feedbackMessage}>{item.message}</Text>
              {item.response !== null ? (
                <View style={[styles.respondButton, { backgroundColor: COLORS.success }]}>
                  <Text style={[styles.respondButtonText, { color: COLORS.white }]}>Responded</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.respondButton}
                  onPress={() => handleRespond(item)}
                >
                  <Text style={styles.respondButtonText}>Respond</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Respond Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* X icon at top right */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowModal(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Respond to Feedback</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type your response..."
              value={responseText}
              onChangeText={setResponseText}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendResponse}
              disabled={sending}
            >
              <Text style={styles.sendButtonText}>
                {sending ? 'Sending...' : 'Send Response'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  backIcon: {
    marginRight: 8,
    padding: 4,
  },
  heading: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    alignSelf: 'center',
  },
  listContainer: {
    paddingBottom: 30,
  },
  noFeedbackText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginVertical: 20,
  },
  feedbackCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 26,
    marginBottom: 22,
    width: '100%',
    minHeight: 110,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
  },
  feedbackTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  feedbackEmail: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.lightDark,
    marginBottom: 6,
  },
  feedbackMessage: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginBottom: 14,
  },
  respondButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
    width: 130,
    alignSelf: 'flex-end',
  },
  respondButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    minHeight: 80,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: FONTS.regular,
    marginBottom: 18,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});