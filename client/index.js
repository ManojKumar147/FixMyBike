/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/**
 * @format
 */

import {AppRegistry, Platform } from 'react-native';
import PushNotification from "react-native-push-notification";
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

//fire base 
import messaging from '@react-native-firebase/messaging';

//Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Configure Push Notifications
PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
  
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      notification.finish(PushNotification.FetchResult.NoData);
    },
  
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
    },
  
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },
  
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    popInitialNotification: true,
    requestPermissions: Platform.OS === "ios",
  });
  PushNotification.createChannel(
    {
      channelId: "reminders",
      channelName: "Task Reminder Notifications",
      channelDescription: "Reminders for scheduled tasks",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );
  
AppRegistry.registerComponent(appName, () => App);
