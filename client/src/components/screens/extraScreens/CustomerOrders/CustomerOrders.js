/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../constants/Constants';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL;
const CustomerOrders = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [showCartDetails, setShowCartDetails] = useState({});

    const toggleOrderExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const toggleCartDetails = (orderId) => {
        setShowCartDetails((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(
                    `${Base_Endpoint}/api/checkout/get-checkouts-data`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOrders(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const renderOrderItem = ({ item }) => {
        const {
            trackingId,
            userId,
            totalAmount,
            paymentType,
            walletType,
            bankName,
            createdAt,
            cartItems = [],
        } = item;

        const customerName = userId?.full_name || 'Unknown';
        const orderId = item?.trackingId || 'N/A';
        const isExpanded = expandedOrders[orderId];
        const isCartDetailsVisible = showCartDetails[orderId];
        const shortOrderId = orderId.length > 10 ? `${orderId.slice(0, 8)}...` : orderId;
        const amount = typeof totalAmount === 'number' ? totalAmount.toLocaleString() : '0.00';
        const walletOrBank = paymentType === 'Digital Wallet' ? walletType : bankName;
        const date = new Date(createdAt).toLocaleDateString();
        const status = 'Completed';

        return (
            <View style={styles.orderCard}>
                <TouchableOpacity onPress={() => toggleOrderExpand(orderId)}>
                    <Text style={styles.orderTitle}>
                        Order #{isExpanded ? orderId : shortOrderId}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.label}>
                    Customer: <Text style={[styles.value, { color: COLORS.white, fontSize: 20, fontWeight: 'bold' }]}>
                        {customerName.toUpperCase()}
                    </Text>
                </Text>
                <Text style={styles.label}>
                    Total: <Text style={[styles.value, { color: COLORS.success, fontSize: 20, fontWeight: 'bold' }]}>
                        Rs. {amount}
                    </Text>
                </Text>
                <Text style={styles.label}>
                    Payment:
                    <Text
                        style={[
                            styles.value,
                            {
                                color: paymentType === 'Digital Wallet'
                                    ? COLORS.strongColor
                                    : COLORS.warning,
                                fontWeight: '600',
                            },
                        ]}
                    >
                        {paymentType} ({walletOrBank || 'N/A'})
                    </Text>
                </Text>
                <Text style={styles.label}>
                    Status: <Text style={[styles.value, { color: COLORS.averageColor, fontWeight: 'bold' }]}>{status}</Text>
                </Text>
                <Text style={styles.label}>
                    Date: <Text style={[styles.value, { color: COLORS.white }]}>{date}</Text>
                </Text>

                {/* Arrow to show/hide cart details */}
                <TouchableOpacity onPress={() => toggleCartDetails(orderId)} style={styles.arrowContainer}>
                    <MaterialCommunityIcons
                        name={isCartDetailsVisible ? 'chevron-up' : 'chevron-down'}
                        color={COLORS.white}
                        size={30}
                    />
                    <Text style={styles.arrowText}>
                        {isCartDetailsVisible ? ' Hide Cart Details' : '↓ Show Cart Details'}
                    </Text>
                </TouchableOpacity>

                {/* Cart item details */}
                {isCartDetailsVisible && (
                    <View style={styles.cartItemsContainer}>
                        <Text style={styles.cartHeader}>Cart Items Detail:</Text>
                        <FlatList
                            data={cartItems}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.cartItem}>
                                    <Text style={[styles.productName, { color: COLORS.errorColor }]}>
                                        {item.product_name}
                                    </Text>
                                    <Text style={[styles.value, { color: COLORS.dark }]}>
                                        Price: Rs. {item.product_price.toLocaleString()}
                                    </Text>
                                    <Text style={[styles.value, { color: COLORS.primary }]}>
                                        Quantity: {item.quantity}
                                    </Text>
                                </View>
                            )}
                            numColumns={2}
                            columnWrapperStyle={styles.columnWrapper}
                        />
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                    <MaterialCommunityIcons
                        name='chevron-left'
                        color={COLORS.darkColor}
                        size={40}
                    />
                    
                </TouchableOpacity>
                <Text style={styles.heading}>Customer Orders</Text>
                <View style={{marginRight: 40}} />
            </View>
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default CustomerOrders;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.darkColor,
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 20,
    },
    orderCard: {
        backgroundColor: COLORS.lightDark,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.white,
    },
    value: {
        fontWeight: 'normal',
        color: COLORS.success,
    },
    cartHeader: {
        marginTop: 12,
        fontWeight: 'bold',
        fontSize: 18,
        color: COLORS.lightDark,
    },
    cartItem: {
        marginTop: 6,
        marginLeft: 10,
        paddingVertical: 4,
    },
    cartItemsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 8,
    },
    productName: {
        fontWeight: '600',
        fontSize: 14,
        color: COLORS.primary,
    },
    arrowContainer: {
        marginTop: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    arrowText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.errorColor,
        fontSize: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});
