import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {getChatBotResponse} from '../../../utils/ChatBot/ChatBotService';

const {width, height} = Dimensions.get('window');

const ChatBot = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [userInput, setUserInput] = useState('');
  const [chatResponses, setChatResponses] = useState([]);

  const handleSend = async () => {
    if (!userInput) return;

    const userMessage = {role: 'user', content: userInput};
    setChatResponses(prev => [...prev, userMessage]);
    setUserInput('');

    const botResponse = await getChatBotResponse(userInput);
    const botMessage = {role: 'assistant', content: botResponse};
    setChatResponses(prev => [...prev, botMessage]);
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
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
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
          Chat Bot
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Talk With Our Chat Bot.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {chatResponses.map((msg, index) => (
          <View
            key={index}
            style={
              msg.role === 'user' ? styles.userMessage : styles.botMessage
            }>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type your message..."
        />
        <TouchableOpacity onPress={handleSend}>
          <Feather name="arrow-right-circle" size={25} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatBot;

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
    paddingBottom: height * 0.1,
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

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    gap: width * 0.05,
  },

  input: {
    flex: 1,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },

  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },

  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },

  messageText: {
    color: COLORS.dark,
  },
});
