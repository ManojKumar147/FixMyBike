import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/Constants';

const Card = ({ notSchedule, navigation }) => {
  const handleGetScheduled = () => {
    navigation.navigate('Shedule_Booking');
  };

  return (
    <View style={styles.card}>
      <View style={styles.buttonContainer}>
        <Text style={styles.cardText}>
          {notSchedule === 1 ? (
            <>
              <Text style={styles.number}>{notSchedule}</Text>
              <Text> Booking is remaining to schedule</Text>
            </>
          ) : (
            <>
              <Text style={styles.number}>{notSchedule}</Text>
              <Text> Bookings are remaining to schedule</Text>
            </>
          )}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetScheduled}>
          <Text style={styles.buttonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardText: {
    fontSize: 16,
    color: COLORS.darkColor,
  },
  number: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default Card;
