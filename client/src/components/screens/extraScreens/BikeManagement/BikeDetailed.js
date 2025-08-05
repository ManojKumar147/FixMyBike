import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {COLORS, FONTS} from '../../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import BASE_URL from '../../../constants/BASE_URL';
const {Base_Endpoint} = BASE_URL;
const {width, height} = Dimensions.get('window');

const Bike_Detailed = ({route}) => {
  const {bike} = route.params;
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetch_service_history = async () => {
      try {
        const response = await axios.get(
          `${Base_Endpoint}/api/bikes/get-service-history/${bike._id}`,
        );
        if (response.status === 200) {
          setServiceHistory(response.data.serviceHistory || []);
        }
      } catch (error) {
        console.error('Error fetching service history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch_service_history();
  }, [bike._id]);

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
              colorScheme === 'dark' ? COLORS.darkHeader : COLORS.lightHeader,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[
          styles.ScrollViewContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <View style={styles.bikeDetailsContainer}>
          <View style={styles.detailContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Modal
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              value={`${bike.bike_model}`}
              editable={false}
            />
          </View>

          <View style={styles.detailContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Name
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              value={`${bike.bike_name}`}
              editable={false}
            />
          </View>

          <View style={styles.detailContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Company
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              value={`${bike.bike_company_name}`}
              editable={false}
            />
          </View>

          <View style={styles.detailContainer}>
            <Text
              style={[
                styles.label,
                {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
              ]}>
              Bike Registration Number
            </Text>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}
              value={`${bike.bike_registration_number}`}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.serviceHistoryContainer}>
          <View style={styles.serviceHeadingContainer}>
            <Text
              style={[
                styles.serviceHeading,
                {
                  color: colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                },
              ]}>
              Service History:
            </Text>

            <Text style={styles.serviceHistory}>
              No Service History Available!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bike_Detailed;

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
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
  },

  ScrollViewContainer: {
    paddingVertical: height * 0.03,
    marginTop: height * 0.09,
  },

  bikeDetailsContainer: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.05,
    gap: 35,
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
  },

  serviceHeading: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
    marginBottom: height * 0.01,
    marginLeft: width * 0.05,
    marginTop: height * 0.03,
  },

  serviceHistory: {
    fontSize: width * 0.035,
    fontFamily: FONTS.semiBold,
    marginBottom: height * 0.01,
    textAlign: 'center',
    marginTop: height * 0.03,
  },
});
