/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../../constants/Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const OrderManagement = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // To store the selected order
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('Signin');
          return;
        }

        const response = await axios.get(
          `${Base_Endpoint}/api/admin/get-checkouts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data.checkouts);
      } catch (error) {
        console.log('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item._id}</Text>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.orderDetail}>
        <Text style={styles.label}>Payment Type:</Text> {item.paymentType}
      </Text>
      {item.paymentType === 'Bank Account' && (
        <Text style={styles.orderDetail}>
          <Text style={styles.label}>Bank Name:</Text> {item.bankName}
        </Text>
      )}
      {item.paymentType === 'Digital Wallet' && (
        <Text style={styles.orderDetail}>
          <Text style={styles.label}>Wallet Type:</Text> {item.walletType}
        </Text>
      )}
      <Text style={styles.orderDetail}>
        <Text style={styles.label}>Transaction ID:</Text> {item.transactionId}
      </Text>
      <Text style={styles.totalAmount}>
        <Text style={styles.label}>Total Amount:</Text> Rs. {item.totalAmount}
      </Text>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => {
          setSelectedOrder(item.cartItems); // Set the selected order's products
          setModalVisible(true); // Show the modal
        }}
      >
        <Text style={styles.detailsButtonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productPrice}>
        <Text style={styles.label}>Price:</Text> Rs. {item.product_price}
      </Text>
      <Text style={styles.productDetail}>
        <Text style={styles.label}>Quantity:</Text> {item.quantity}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={30} color={COLORS.dark} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Orders</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for Order Details */}
      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Order Details</Text>
      <FlatList
        data={selectedOrder}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.modalList}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
};

export default OrderManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    width: 40,
  },
  headerText: {
    fontSize: 30,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: COLORS.googleButton,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.secondary,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    color: COLORS.success,
    marginTop: 8,
  },
  orderDetail: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    marginTop: 6,
  },
  label: {
    fontFamily: FONTS.bold,
    color: COLORS.bold,
    paddingRight: 5,
  },
  detailsButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalList: {
    paddingBottom: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  productCard: {
    backgroundColor: COLORS.lightDark,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8,
    alignSelf: 'center'
  },
  productDetail: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.warning,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.success,
    marginTop: 4,
  },
});