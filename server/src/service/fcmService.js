const admin = require("firebase-admin");
const { google } = require("googleapis");
const path = require("path");
const fs = require('fs');

// Initialize Firebase Admin SDK
const firebaseConfig = path.join(__dirname, "../config/serviceAccountKey.json");
console.log('loging path',firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});


// Function to send a notification to a device
async function sendNotification(token, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    android: {
      priority: "high",
    },
    
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error) {
    if (error.code === 'messaging/registration-token-not-registered') {
      console.warn('Invalid FCM token, consider removing:', token);
      // Optionally delete token from DB here
            await User.updateOne({ fcm_token: token }, { $set: { fcm_token: null } });

    } else {
      console.error("Error sending notification:", error);
    }
    throw error;
  }
}


// Function to get an access token using Google OAuth2
async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../config/serviceAccountKey.json"), // path to the service account key
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  try {
    const accessToken = await auth.getAccessToken();
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

module.exports = {
  sendNotification,
  getAccessToken,
};