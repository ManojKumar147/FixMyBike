import React,{useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS} from '../../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AssistanceContainer from './EmergencyAssistanceCard';
import BASE_URL from '../../../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;

const {width, height} = Dimensions.get('window');

const EmergencyAssistance = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [mechanics, setMechanics] = useState([]); 
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: `${Base_Endpoint}/api/users/get-mechanics`,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setMechanics(response.data.mechanics);
      } catch (error) {
        console.error('Error fetching mechanics:', error.message);
      }
    };
    fetchMechanics();
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
          Emergency Assistance
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Talk With Our Mechanics for Emergency Assistance.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <FlatList
            data={mechanics}
            scrollEnabled={true}
            keyExtractor={(item) => item._id.toString()} 
            renderItem={({ item }) => (
              <AssistanceContainer
              mechanic={item}
              />
            )}
            contentContainerStyle={styles.EmergencyAssistanceCard}
          />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyAssistance;

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

  EmergencyAssistanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
    gap: 20,
  },
}); 