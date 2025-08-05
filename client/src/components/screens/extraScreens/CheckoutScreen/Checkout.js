/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../../constants/BASE_URL';

const { Base_Endpoint } = BASE_URL;

const Checkout = ({ route }) => {
  const navigation = useNavigation();
  const { shopOwnerId, userId, trackingId, items, total } = route.params || {};

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [productSummary, setProductSummary] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        let cart = await AsyncStorage.getItem(`cart_${userId}`);
        cart = cart ? JSON.parse(cart) : {};
        const shopCart = cart[shopOwnerId];

        if (shopCart?.products && typeof shopCart.products === 'object') {
          const summary = Object.values(shopCart.products).map(product => ({
            product_id: product.product_id,
            product_name: product.product_name,
          }));
          setProductSummary(summary);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchCart();
  }, []);

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!selectedPayment) {
      newErrors.selectedPayment = 'Please select a payment method.';
      valid = false;
    }

    if (selectedPayment === 'wallet') {
      if (!selectedWallet) {
        newErrors.selectedWallet = 'Please select a wallet.';
        valid = false;
      }
      if (!transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID is required.';
        valid = false;
      }
    }

    if (selectedPayment === 'bank') {
      if (!bankName.trim()) {
        newErrors.bankName = 'Bank name is required.';
        valid = false;
      }
      if (!accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required.';
        valid = false;
      }
      if (!accountHolder.trim()) {
        newErrors.accountHolder = 'Account holder name is required.';
        valid = false;
      }
      if (!transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID is required.';
        valid = false;
      }
    }

    setErrors(newErrors);
    setIsFormValid(valid);
  };

  useEffect(() => {
    validate();
  }, [selectedPayment, selectedWallet, bankName, accountNumber, accountHolder, transactionId]);

  const handleProceed = async () => {
    const paymentDetails =
      selectedPayment === 'wallet'
        ? {
            paymentType: 'Digital Wallet',
            walletType: selectedWallet,
            transactionId,
          }
        : {
            paymentType: 'Bank Account',
            bankName,
            accountNumber,
            accountHolder,
            transactionId,
          };

    const cartItemsWithTracking = items.map(item => ({
      ...item,
      trackingId: trackingId, // ✅ Important fix
    }));

    const checkoutData = {
      userId,
      shopOwnerId,
      trackingId,
      totalAmount: total,
      cartItems: cartItemsWithTracking,
      ...paymentDetails,
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Signin');
        return;
      }

      const response = await fetch(`${Base_Endpoint}/api/checkout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok) {
        let cart = await AsyncStorage.getItem(`cart_${userId}`);
        cart = cart ? JSON.parse(cart) : {};
        delete cart[shopOwnerId];
        await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        navigation.navigate('ReviewScreen', { shopOwnerId, userId, productSummary });
      } else {
        console.error('Server error:', data);
        setErrors({ api: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setErrors({ api: 'Could not reach the server.' });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.cartTitle}>Checkout</Text>

          <View style={styles.paymentContainer}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>

            <Pressable style={styles.radioContainer} onPress={() => setSelectedPayment('wallet')}>
              <MaterialCommunityIcons
                name={selectedPayment === 'wallet' ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.radioLabel}>Digital Wallet</Text>
            </Pressable>
            {errors.selectedPayment && !selectedPayment && <Text style={styles.error}>{errors.selectedPayment}</Text>}

            {selectedPayment === 'wallet' && (
              <View style={styles.walletOptions}>
                {['JazzCash', 'EasyPaisa', 'UfonePay'].map(wallet => (
                  <Pressable
                    key={wallet}
                    style={styles.radioContainer}
                    onPress={() => setSelectedWallet(wallet)}
                  >
                    <MaterialCommunityIcons
                      name={selectedWallet === wallet ? 'radiobox-marked' : 'radiobox-blank'}
                      size={22}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.radioLabel}>{wallet}</Text>
                  </Pressable>
                ))}
                {errors.selectedWallet && <Text style={styles.error}>{errors.selectedWallet}</Text>}

                <TextInput
                  style={styles.input}
                  placeholder="Enter Transaction ID"
                  value={transactionId}
                  onChangeText={setTransactionId}
                />
                {errors.transactionId && <Text style={styles.error}>{errors.transactionId}</Text>}
              </View>
            )}

            <Pressable
              style={styles.radioContainer}
              onPress={() => {
                setSelectedPayment('bank');
                setSelectedWallet(null);
              }}
            >
              <MaterialCommunityIcons
                name={selectedPayment === 'bank' ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.radioLabel}>Bank Account</Text>
            </Pressable>

            {selectedPayment === 'bank' && (
              <View style={styles.bankDetailsContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Bank Name"
                  value={bankName}
                  onChangeText={setBankName}
                />
                {errors.bankName && <Text style={styles.error}>{errors.bankName}</Text>}

                <TextInput
                  style={styles.input}
                  placeholder="Account Number"
                  keyboardType="numeric"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                />
                {errors.accountNumber && <Text style={styles.error}>{errors.accountNumber}</Text>}

                <TextInput
                  style={styles.input}
                  placeholder="Account Holder Name"
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                />
                {errors.accountHolder && <Text style={styles.error}>{errors.accountHolder}</Text>}

                <TextInput
                  style={styles.input}
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChangeText={setTransactionId}
                />
                {errors.transactionId && <Text style={styles.error}>{errors.transactionId}</Text>}
              </View>
            )}
            {errors.api && <Text style={styles.error}>{errors.api}</Text>}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.proceedButton, (!isFormValid || loadingSummary) && { backgroundColor: '#ccc' }]}
          onPress={handleProceed}
          disabled={!isFormValid || loadingSummary}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Checkout;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  walletOptions: {
    marginLeft: 20,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
  bankDetailsContainer: {
    marginTop: 10,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  proceedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  proceedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
