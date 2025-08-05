/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, FlatList, Dimensions, ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../constants/Constants';
import { jwtDecode } from "jwt-decode";
import base64 from 'base-64';
import utf8 from 'utf8';

const { width } = Dimensions.get('window');

const NotificationsManager = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const dt = new Date(selectedDate);
    const formattedDate = `${dt.getDate().toString().padStart(2, "0")}-${(dt.getMonth() + 1)
      .toString().padStart(2, "0")}-${dt.getFullYear()}`;
    setDate(formattedDate);
    hideDatePicker();
  };

  const handleTimeConfirm = (ctime) => {
    const dt = new Date(ctime);
    const formattedTime = dt.toLocaleTimeString("en-GB", { hour12: false });
    setTime(formattedTime);
    hideTimePicker();
  };

  PushNotification.createChannel(
    {
      channelId: "local_notifications",
      channelName: "Local Notifications",
      channelDescription: "Notifications for local messages",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const encodedPayload = token.split(".")[1];
        const decodedBytes = base64.decode(encodedPayload);
        const decodedText = utf8.decode(decodedBytes);
        const decodedObject = JSON.parse(decodedText);
        const id = decodedObject?.user?.id;
        setUserId(id);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const saveNotificationsToStorage = async (newNotifications) => {
    try {
      if (!userId) return;
      const userNotificationsKey = `notifications_${userId}`;
      await AsyncStorage.setItem(userNotificationsKey, JSON.stringify(newNotifications));
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  };

  const loadNotificationsFromStorage = async () => {
    try {
      if (!userId) return;
      const notiKey = `notifications_${userId}`;
      const storedNotifications = await AsyncStorage.getItem(notiKey);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    getUserId();
    loadNotificationsFromStorage();
  }, []);

  const setNotificationHandler = async (heading, details, scheduleDate) => {
    PushNotification.localNotificationSchedule({
      channelId: "local_notifications",
      title: heading,
      message: details,
      date: scheduleDate,
      allowWhileIdle: true,
    });

    Alert.alert("✅ Notification Set", `Your notification is set for ${date} at ${time}`);

    const newNotification = {
      id: Date.now(),
      title: heading,
      message: details,
      date,
      time,
    };

    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    await saveNotificationsToStorage(updatedNotifications);
  };

  const handleSetNotification = () => {
    if (!title.trim() || !message.trim() || !date || !time) {
      Alert.alert("⚠️ Error", "Please complete all fields before setting the notification.");
      return;
    }

    const [day, month, year] = date.split("-");
    const [hours, minutes] = time.split(":");
    const scheduleDate = new Date(year, month - 1, day, hours, minutes, 0);

    setNotificationHandler(title, message, scheduleDate);
  };

  const deleteNotification = async (id) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
    await saveNotificationsToStorage(updatedNotifications);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🕒 Schedule Notification</Text>

        <TextInput
          style={styles.input}
          placeholder="Notification Title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Notification Message"
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />

        <View style={styles.row}>
          <TouchableOpacity onPress={showDatePicker} style={styles.button}>
            <Text style={styles.buttonText}>📅 Date</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>{date || "No date selected"}</Text>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <View style={styles.row}>
          <TouchableOpacity onPress={showTimePicker} style={styles.button}>
            <Text style={styles.buttonText}>⏰ Time</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>{time || "No time selected"}</Text>
        </View>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />

        <TouchableOpacity onPress={handleSetNotification} style={[styles.button, { marginTop: 20, backgroundColor: "#4CAF50" }]}>
          <Text style={styles.buttonText}>Set Notification</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subTitle}>📌 My Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMsg}>{item.message}</Text>
            <Text style={styles.notificationTime}>{item.date} at {item.time}</Text>
            <TouchableOpacity onPress={() => deleteNotification(item.id)} style={styles.deleteButton}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
};

export default NotificationsManager;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationMsg: {
    color: "#555",
  },
  notificationTime: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
});
