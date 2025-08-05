import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Constants';
import Feather from 'react-native-vector-icons/Feather';

// Single Card Component
const ServiceToSheduleCard = ({
  item,
  role,
  onShowInProgress,
  onComplete,
  status,
  onSchedule,
  navigation,
  userReviews = [],
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);

  // Check if reviewed
  const isReviewed = userReviews.some(
    review =>
      review.itemId?.toString() === item?._id?.toString() &&
      review.itemType === 'Service'
  );

  const toggleExpand = () => setExpanded(!expanded);
console.log('item', item);
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.serviceName}>Service Name: {item.serviceName}</Text>
        <TouchableOpacity onPress={toggleExpand} style={styles.expandIcon}>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.mechanicName}>customer Name: {item.name}</Text>
      <Text style={styles.details}>Bike: {item.bikeName}</Text>
      <Text style={styles.details}>Comments: {item.comments}</Text>
      <Text style={styles.price}>Total Price: ${item.totalPrice}</Text>
      <View style={styles.statusReviewRow}>
        <Text
          style={[
            styles.status,
            { color: /^completed$/i.test(item.status) ? COLORS.success : COLORS.warning },
          ]}
        >
          Status: {item.status}
        </Text>
        {/^completed$/i.test(item.status) && role === 'customer' && (
          <TouchableOpacity
            style={[
              styles.reviewButton,
              isReviewed && { backgroundColor: COLORS.gray }
            ]}
            onPress={() => {
              if (!isReviewed) {
                navigation.navigate('ReviewScreen', {
                  shopOwnerId: item.shopOwnerId,
                  productSummary: item.productSummary || [],
                  itemId: item._id,
                  serviceName: item.serviceName,
                });
              }
            }}
            disabled={isReviewed}
          >
            <Text style={styles.reviewButtonText}>
              {isReviewed ? 'Reviewed' : 'Review'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.timestamp}>
        ScheduleDate: {item.scheduleDate ? new Date(item.scheduleDate).toLocaleString() : 'Not Scheduled Yet'}
      </Text>

      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.showInProgressButton}
          onPress={() => onSchedule && onSchedule(item._id, 'completed')}
        >
          <Text style={styles.showInProgressButtonText}>Schedule</Text>
        </TouchableOpacity>
      )}

      {expanded && (
        <View style={styles.additionalInfo}>
          <Text style={styles.details}>Bike Company: {item.bikeCompanyName}</Text>
          <Text style={styles.details}>Bike Model: {item.bikeModel}</Text>
          <Text style={styles.details}>Bike Registration: {item.bikeRegNumber}</Text>
          <Text style={styles.details}>Service Location: {item.dropOff}</Text>
          <Text style={styles.details}>Address: {item.address}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandIcon: {
    padding: 4,
    marginLeft: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 6,
    borderRadius: 5,
    textAlign: 'left',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.lightGray,
    alignSelf: 'flex-start',
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
    marginVertical: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.dark,
    marginTop: 4,
  },
  additionalInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  showInProgressButton: {
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  showInProgressButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  statusReviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginLeft: 10,
  },
  reviewButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ServiceToSheduleCard;