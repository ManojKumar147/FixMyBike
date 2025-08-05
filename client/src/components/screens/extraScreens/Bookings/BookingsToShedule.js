/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Dimensions,
    useColorScheme,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ServiceToSheduleCard from '../../../utils/ServiceHistoryCard/ServiceToSheduleCard';
import BASE_URL from '../../../constants/BASE_URL';

const { width, height } = Dimensions.get('window');
const { Base_Endpoint } = BASE_URL;

const Bookings = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScheduleRequests = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${Base_Endpoint}/api/to-schedule`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const notScheduleRequest = response.data.Bookings;
                console.log('notScheduleRequest', notScheduleRequest);
                setBookings(notScheduleRequest);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching- schedule requests:', error);
            }
        };

        fetchScheduleRequests();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const currentDate = new Date();
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);

            const formattedDate = nextDay.toISOString().split('T')[0];
            console.log('Date after one day:', formattedDate);

            await axios({
                method: 'PUT',
                url: `${Base_Endpoint}/api/to-schedule/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    status: 'accepted',
                    // date: formattedDate,
                },
            });

            navigation.replace('Main');
        } catch (error) {
            console.error('Error in schedule', error.message);
        }
    };

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
                <TouchableOpacity onPress={() => navigation.goBack()}>
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
                        { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                    ]}
                >
                    Bookings To Be Scheduled
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item._id.toString()}
                    contentContainerStyle={styles.bookingContainer} // <<== ADD THIS
                    renderItem={({ item }) => (
                        <ServiceToSheduleCard
                            item={item}
                            role="mechanic"
                            status={item.status}
                            scheduleDate={item.scheduleDate}
                            onSchedule={handleUpdateStatus}
                            navigation={navigation}
                        />
                    )}
                />

            )}
        </SafeAreaView>
    );
};

export default Bookings;

const styles = StyleSheet.create({
    primaryContainer: {
        flex: 1,
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
    headerTextContainer: {
        marginTop: height * 0.12,
        marginLeft: width * 0.05,
    },
    headerTitleText: {
        fontSize: width * 0.09,
        color: COLORS.dark,
        fontFamily: FONTS.bold,
    },
    bookingContainer: {
        paddingHorizontal: width * 0.05,
        paddingVertical: 10,
    },
});
