import React,{useEffect, useState} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS} from '../../../constants/Constants';
import {useNavigation} from '@react-navigation/native';


const {width, height} = Dimensions.get('window');

const EmergencyAssistance = ({mechanic}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
     <View
            key={mechanic._id}
            style={[
              styles.cardContainer,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.contactContainer}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="phone-call"
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
                      fontWeight: 'bold',
                    }}>
                     {mechanic?.full_name || 'Name not available'}
                  </Text>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.04,
                      marginLeft: 10,
                      marginTop: 5,
                    }}>
                    Phone: {mechanic.phone_number}
                  </Text>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.04,
                      marginLeft: 10,
                      marginTop: 5,
                    }}>
                    Email: {mechanic.email}
                   
                  </Text>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.04,
                      marginLeft: 10,
                      marginTop: 5,
                    }}>
                    Address: {mechanic.address}
                   
                  </Text>
                </View>
              </View>
            </View>
          </View>
      
     
  );
};

export default EmergencyAssistance;

const styles = StyleSheet.create({
 


  cardContainer: {
    
    paddingVertical: height * 0.02,
    gap: 20,
  },

  contactContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',  // Align items to the left
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  
  icon: {
    color: COLORS.dark,
  },
}); 