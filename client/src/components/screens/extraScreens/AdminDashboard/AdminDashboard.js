import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather'; // Import Feather icons
import { COLORS } from '../../../constants/Constants';
const sections = [
  { label: 'User Management', screen: 'UserManagement', icon: 'users' },
  { label: 'Bookings Management', screen: 'BookingManagement', icon: 'calendar' },
  { label: 'Products Management', screen: 'ProductManagement', icon: 'box' },
  { label: 'Services Management', screen: 'ServiceManagement', icon: 'tool' },
  { label: 'Orders Management', screen: 'OrderManagement', icon: 'shopping-cart' },
  { label: 'My Profile', screen: 'Edit_Profile', icon: 'edit' },
  { label: 'Feedbacks', screen: 'FeedbackScreen', icon: 'headphones' },

];

// Add a placeholder if the number of items is odd
if (sections.length % 2 !== 0) {
  sections.push({ label: '', screen: null, icon: null }); // Placeholder item
}



const AdminDashboard = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    if (!item.screen) {
      // Render an empty card for the placeholder
      return <View style={[styles.card, styles.placeholderCard]} />;
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(item.screen)} // Navigate to the screen
      >
        <Feather name={item.icon} size={30} color={COLORS.white} style={styles.cardIcon} />
        <Text style={styles.cardText}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2} // Display items in two columns
        columnWrapperStyle={styles.row} // Style for rows
      />
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 12,
    flex: 1, // Ensure cards take equal space
    marginHorizontal: 8, // Add spacing between columns
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderCard: {
    backgroundColor: 'transparent', // Make the placeholder card invisible
    elevation: 0, // Remove shadow for the placeholder
  },
  cardIcon: {
    marginBottom: 10, // Add spacing between the icon and text
  },
  cardText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
});