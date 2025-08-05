/* eslint-disable curly */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
import { View, Text, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import base64 from 'base-64'
import utf8 from 'utf8'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../../constants/Constants';
const { width, height } = Dimensions.get("window");
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

// const COLORS = {
//     lightDark: "#f5f5f5",
//     white: "#fff",
//     dark: "#333",
//     primary: "#007bff",
//     secondary: "#ff9800",
//     cartIconBg: "#ff5722",
//     danger: "#d9534f",
// };

const CartManager = () => {
    const navigation = useNavigation();

    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetchUserIdAndCart();
    }, []);


    const fetchUserIdAndCart = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return console.log('❌ No token found');
    
            const decodedObject = JSON.parse(utf8.decode(base64.decode(token.split(".")[1]))); 
            const id = decodedObject?.user?.id;
            if (!id) return console.log('❌ No user ID found in token');
    
            setUserId(id);
    
            const cartData = await AsyncStorage.getItem(`cart_${id}`);
            if (!cartData) {
                setCartItems([]);
                setCartCount(0);
                setTotalPrice(0);
                return;
            }
    
            const parsedCart = JSON.parse(cartData);
            console.log("✅ Parsed Cart:", parsedCart);
    
            // ✅ Extract products correctly, ensuring trackingId is included
            const cartArray = Object.entries(parsedCart).flatMap(([shopOwnerId, shopData]) => {
                return Object.entries(shopData.products).map(([productId, product]) => {
                    return {
                        shopOwnerId,
                        productId,
                        product_name: product.product_name || "Unnamed Product",
                        product_price: product.product_price || 0,
                        quantity: product.quantity || 1,
                        product_image: product.product_image || "",
                        trackingId: shopData.trackingId || "", // Use the trackingId from the shopData
                    };
                });
            });
    
            console.log('cartArray with trackingId:', cartArray);
            setCartItems(cartArray);
            updateCartSummary(cartArray); // Update summary based on new cart array
    
        } catch (error) {
            console.error("❌ Error fetching cart items:", error);
        }
    };
    




    const updateCartStorage = async (updatedCart) => {
        setCartItems(updatedCart);
        updateCartSummary(updatedCart);

        if (userId) {
            let cartObject = {};
            updatedCart.forEach(item => {
                if (!cartObject[item.shopOwnerId]) {
                    cartObject[item.shopOwnerId] = {};
                }
                cartObject[item.shopOwnerId][item.productId] = item;
            });

            await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cartObject));
            console.log("✅ Cart updated:", cartObject);
        }
    };

    const updateCartSummary = (cartArray) => {
        const totalItems = cartArray.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
        const totalPrice = cartArray.reduce((acc, item) => acc + (Number(item.quantity) * (item.product_price || 0)), 0);

        setCartCount(Number.isNaN(totalItems) ? 0 : totalItems);
        setTotalPrice(totalPrice);
    };

    const updateQuantity = async (shopOwnerId, productId, newQuantity) => {
        if (!userId || newQuantity < 1) return;

        let updatedCart = cartItems.map(item =>
            item.shopOwnerId === shopOwnerId && item.productId === productId
                ? { ...item, quantity: newQuantity }
                : item
        );

        await updateCartStorage(updatedCart);
    };

    const removeItem = async (shopOwnerId, productId) => {
        if (!userId) return;
        let updatedCart = cartItems.filter(item => !(item.shopOwnerId === shopOwnerId && item.productId === productId));
        await updateCartStorage(updatedCart);
    };
    const emptyCart = async () => {
        try {
            if (!userId) return;

            await AsyncStorage.removeItem(`cart_${userId}`); // Remove only the current user's cart
            console.log(`✅ Cart cleared for user: ${userId}`);

            fetchUserIdAndCart(); // Refresh UI
        } catch (error) {
            console.error("❌ Error clearing user cart:", error);
        }
    };


    return (
        <View style={styles.container}>
            {/* Cart Header */}
            <View style={styles.cartHeader}>
                <Text style={styles.cartTitle}>🛒 Cart</Text>
                <View style={styles.cartContainer}>
                    <MaterialCommunityIcons name="cart" size={24} color="white" />
                    <Text style={styles.countText}>{cartCount}</Text>
                </View>
            </View>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
                <FlatList
                data={Object.entries(cartItems.reduce((acc, item) => {
                    acc[item.shopOwnerId] = acc[item.shopOwnerId] || { 
                        total: 0, 
                        items: [], 
                        trackingId: item.trackingId // ✅ Include trackingId
                    };
                    acc[item.shopOwnerId].items.push(item);
                    acc[item.shopOwnerId].total += item.quantity * item.product_price;
                    return acc;
                }, {}))}
                    keyExtractor={([shopOwnerId]) => shopOwnerId}
                    renderItem={({ item: [shopOwnerId, { total, items, trackingId }] }) => (
                        <View style={styles.shopContainer}>
                            {/* <Text style={styles.shopTitle}>Shop Owner: {shopOwnerId}</Text> */}
                            <Text style={{color:'black'}}>Tracking ID: {trackingId}</Text>  
                            {items.map(item => (
                                <View key={item.productId} style={styles.cartItem}>
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName}>{item.product_name}</Text>
                                        <Text style={styles.itemPrice}>Price: {item.quantity * item.product_price}</Text>
                                    </View>

                                    {/* Quantity Controls */}
                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.shopOwnerId, item.productId, item.quantity - 1)}
                                            style={styles.quantityButton}>
                                            <MaterialCommunityIcons name="minus" size={20} color="white" />
                                        </TouchableOpacity>
                                        <TextInput
                                            style={styles.quantityInput}
                                            value={String(item.quantity)}
                                            keyboardType="numeric"
                                            onChangeText={(text) => {
                                                const parsedValue = Number(text) || 1;
                                                updateQuantity(item.shopOwnerId, item.productId, parsedValue);
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => updateQuantity(item.shopOwnerId, item.productId, item.quantity + 1)}
                                            style={styles.quantityButton}>
                                            <MaterialCommunityIcons name="plus" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Remove Item */}
                                    <TouchableOpacity
                                        onPress={() => removeItem(item.shopOwnerId, item.productId)}
                                        style={styles.removeButton}>
                                        <MaterialCommunityIcons name="trash-can" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Shop Total */}
                            <View style={styles.shopTotalContainer}>
                                <Text style={styles.shopTotalText}>Total for this Shop: {total.toFixed(2)}</Text>
                                <Pressable
                                    style={styles.checkoutButton}
                                    onPress={() => navigation.navigate('Checkout', { shopOwnerId, userId, trackingId, items, total })}>
                                    <Text style={styles.checkoutButtonText}>Checkout This Shop</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noItemsText}>No items in cart</Text>
            )}

            {/* Bottom Actions */}
            <View style={styles.bottomContainer}>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.emptyCartButton}>Home</Text>
                </Pressable>
                <Pressable onPress={emptyCart}>
                    <Text style={styles.emptyCartButton}>Empty Cart</Text>
                </Pressable>
                {/* <Pressable onPress={() => navigation.navigate('Checkout')}>
                    <Text style={styles.emptyCartButton}>Go to Checkout</Text>
                </Pressable> */}
            </View>
        </View>
    );

};
export default CartManager;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    cartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.lightDark,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.white,
    },
    cartContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.warning,
        padding: 8,
        borderRadius: 20,
    },
    countText: {
        color: COLORS.white,
        fontWeight: "bold",
        marginLeft: 5,
    },
    shopContainer: {
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },
    shopTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.dark,
        marginBottom: 8,
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.dark,
    },
    itemPrice: {
        color: "gray",
        fontSize: 14,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        backgroundColor: COLORS.primary,
        padding: 5,
        borderRadius: 5,
    },
    quantityInput: {
        width: 40,
        height: 40,
        textAlign: 'center',
        fontSize: 16,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    removeButton: {
        backgroundColor: COLORS.danger,
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,  // Ensure enough space for the icon
        height: 40,  // Ensure enough space for the icon
    },

    shopTotalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    shopTotalText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    checkoutButton: {
        backgroundColor: COLORS.secondary,
        padding: 10,
        borderRadius: 5,
    },
    checkoutButtonText: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    bottomContainer: {
        paddingVertical: 10,
        backgroundColor: COLORS.lightDark,
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-around',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10
    },
    emptyCartButton: {
        color: COLORS.white,
        backgroundColor: COLORS.danger,
        padding: 10,
        borderRadius: 5,
    },
    noItemsText: {
        textAlign: "center",
        fontSize: 16,
        color: COLORS.dark,
        marginTop: 20,
    },
});
