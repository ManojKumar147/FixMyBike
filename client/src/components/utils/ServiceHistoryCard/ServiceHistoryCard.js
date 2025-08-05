

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Constants';
import Feather from 'react-native-vector-icons/Feather'; // Make sure this is installed

const ServiceHistoryCard = ({ item, role, onShowInProgress, onComplete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.serviceName}>Service: {item.serviceName}</Text>
        <TouchableOpacity onPress={toggleExpand}>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {item.mechanicName && (
        <Text style={styles.mechanicName}>Mechanic: {item.mechanicName}</Text>
      )}
      <Text style={styles.mechanicName}>customer Name: {item.name}</Text>

      <Text style={styles.details}>Bike: {item.bikeName}</Text>
      <Text style={styles.details}>Comments: {item.comments}</Text>
      <Text style={styles.price}>Total Price: {item.totalPrice}</Text>

      <Text
        style={[
          styles.status,
          { color: /^completed$/i.test(item.status) ? COLORS.success : COLORS.warning },
        ]}
      >
        Status: {item.status}
      </Text>

      <Text style={styles.timestamp}>
        ScheduleDate: {item.scheduleDate ? new Date(item.scheduleDate).toLocaleString() : 'Not Scheduled Yet'}
      </Text>

      {role === 'mechanic' && item.scheduleDate && (
        <View style={styles.buttonContainer}>
          {item.status === 'accepted' && (
            <TouchableOpacity
              style={styles.showInProgressButton}
              onPress={() => onShowInProgress(item._id, 'in progress', item.userId)}
            >
              <Text style={styles.showInProgressButtonText}>In Progress</Text>
            </TouchableOpacity>
          )}

          {(item.status === 'accepted' || item.status === 'in progress') && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => onComplete(item._id, 'completed', item.userId)}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {expanded && (
        <View style={styles.additionalInfo}>
          <Text style={styles.details}>Bike Company: {item.bikeCompanyName}</Text>
          <Text style={styles.details}>Bike Model: {item.bikeModel}</Text>
          <Text style={styles.details}>Registration #: {item.bikeRegNumber}</Text>
          <Text style={styles.details}>Drop-off: {item.dropOff}</Text>
          <Text style={styles.details}>Address: {item.address}</Text>
        </View>
      )}
    </View>
  );
};

export default ServiceHistoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
    flexWrap: 'wrap',
  },
  mechanicName: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  details: {
    fontSize: 14,
    color: COLORS.dark,
    marginVertical: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  additionalInfo: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  showInProgressButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  showInProgressButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  completeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
