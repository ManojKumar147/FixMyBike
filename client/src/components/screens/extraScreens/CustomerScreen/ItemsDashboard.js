/* eslint-disable curly */
/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    Dimensions,
    useColorScheme,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    Pressable,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../../constants/Constants';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import base64 from 'base-64';
import utf8 from 'utf8';
import ItemCard from './ItemCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL; 
const { width, height } = Dimensions.get('window');

const ItemsDashboard = () => {
    const [customServices, setCustomServices] = useState([]);
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const route = useRoute();
    const { role } = route.params || {};
    const [allShop, setAllShop] = useState(route.params?.allShop || null);
    const [rating, setRating] = useState(0);
    const [cartCount, setCartCount] = useState(0); // Ensuring accurate count
    const [userId, setUserId] = useState(null);
    const [shopOwnerId, setShopOwnerId] = useState(null); // Added for tracking ID
    const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
 const [sortOrder, setSortOrder] = useState(""); 

   useFocusEffect(
    useCallback(() => {
      // If this screen is focused and route.params?.allShop is null, reset state
      if (route.params?.allShop === null) {
        setAllShop(null);
      }
    }, [route.params?.allShop])
  );
    useFocusEffect(
        useCallback(() => {
            getAllItems();
        }, [role, allShop])
    );
    useFocusEffect(
        useCallback(() => {
            const fetchCart = async () => {
                const id = await getUserId();
                if (id) {
                    await updateCartCount(id); // Ensure cart count updates when navigating back
                }
            };
            fetchCart();
        }, [])
    );

    useEffect(() => {
        const fetchUserData = async () => {
            const id = await getUserId();
            if (id) {
                await updateCartCount(id); // Fetch cart count only when ID is retrieved
            }
        };
        fetchUserData();
    }, []); // Runs only once on mount

    const getAllItems = async () => {
        console.log(allShop, 'all shop');
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.replace('Signin');
                return;
            }

            let url = role === "mechanic"
                ? (allShop ? `${Base_Endpoint}/api/shop/get-services/${allShop}` : `${Base_Endpoint}/api/shop/all/services`)
                : (allShop ? `${Base_Endpoint}/api/get-products/${allShop}` : `${Base_Endpoint}/api/all/products`);

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCustomServices(response.data.Items || []);
            setRating(response.data.Items[0].rating);
            setShopOwnerId(response.data.Items[0].shop_owner);
            console.log(shopOwnerId, 'shop owner id');
        } catch (error) {
            console.log('Error fetching services:', error);
        }
    };

    const getUserId = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const decodedObject = JSON.parse(utf8.decode(base64.decode(token.split(".")[1])));
                const id = decodedObject?.user?.id;
                if (id) {
                    setUserId(id);
                    return id;
                }
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
        return null;
    };

    const updateCartCount = async (id) => {
        try {
            console.log('Fetching cart count for user:', id);

            let cart = await AsyncStorage.getItem(`cart_${id}`);
            console.log('🛒 Raw Cart Data:', cart);

            cart = cart ? JSON.parse(cart) : {};

            let count = 0;

            // Loop through each shopOwner in the cart
            Object.values(cart).forEach(shop => {
                // Ensure we're accessing the 'products' field correctly
                const products = shop.products; // Access products from the shop object
                if (products) {
                    // Now loop through the products and count their quantities
                    Object.values(products).forEach(product => {
                        console.log('📦 Counting Product:', product);
                        count += product.quantity || 0; // Ensure quantity is a valid number
                    });
                }
            });

            console.log('🔄 Updated Cart Count:', count);
            setCartCount(count); // Ensure `setCartCount` is updating state correctly
        } catch (error) {
            console.error("❌ Error updating cart count:", error);
        }
    };




    const handleAddToCart = async (service) => {
        console.log('service', service);
        try {
            if (!userId) return;

            let cart = await AsyncStorage.getItem(`cart_${userId}`);
            cart = cart ? JSON.parse(cart) : {};

            const shopOwnerId = service.shop_owner;
            const productId = service._id;

            // ✅ Ensure shopOwner exists in cart
            if (!cart[shopOwnerId]) {
                const timestamp = new Date().toISOString(); // Generate datetime
                const trackingId = `${timestamp}:${userId}:${shopOwnerId}`; // Create tracking ID
                console.log('shop owner', shopOwnerId, 'tracking id', trackingId);
                cart[shopOwnerId] = {
                    trackingId, // Set tracking ID only once
                    products: {}, // Initialize products container
                };
            }

            // ✅ Ensure products object exists before accessing it
            if (!cart[shopOwnerId].products) {
                cart[shopOwnerId].products = {};
            }

            // ✅ Add or update product in the cart
            if (cart[shopOwnerId].products[productId]) {
                console.log(`Updating quantity for product ${productId}`);
                cart[shopOwnerId].products[productId].quantity += 1;
            } else {
                console.log(`Adding new product ${productId} to cart`);
                cart[shopOwnerId].products[productId] = {
                    product_image: `${Base_Endpoint}/src/assets/shop/${encodeURIComponent(service.product_name)}.jpg`,
                    product_name: service.product_name,
                    product_price: service.product_price,
                    product_id: service._id,
                    quantity: 1,
                };
            }

            // Save updated cart
            await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));

            // Fetch updated cart count immediately after adding an item
            await updateCartCount(userId);

            console.log("✅ Cart updated:", cart);
        } catch (error) {
            console.error("❌ Error adding product to cart:", error);
        }
    };

    const handleRating = async (newRating) => {
        setRating(newRating);
        console.log(`User rated: ${newRating}`);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Authentication Error", "Please sign in first.");
                navigation.replace("Signin");
                return;
            }


            const response = await axios.post(
                `${Base_Endpoint}/api/save-rating`,
                {
                    shop_owner: shopOwnerId, // Correct field name
                    rating: newRating,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data.message);
        } catch (error) {
            console.error("Error saving rating:", error);
        }
    };

    const filteredServices = customServices
    .filter(service =>
      role === 'seller'
        ? (service.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           parseFloat(service.product_price) <= parseFloat(searchQuery))
        : (service.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           parseFloat(service.service_price) <= parseFloat(searchQuery))
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return parseFloat(a.product_price || a.service_price) - parseFloat(b.product_price || b.service_price);
      } else if (sortOrder === 'desc') {
        return parseFloat(b.product_price || b.service_price) - parseFloat(a.product_price || a.service_price);
      }
      return 0; // No sorting if sortOrder is empty
    });
      

    const handleSearch = text => {
        setSearchQuery(text);
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 500);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={[
                styles.primaryContainer,
                { backgroundColor: colorScheme === 'dark' ? COLORS.darkColor : COLORS.white }
            ]}>
                {allShop && customServices.length > 0 ? (
                    <View style={styles.textContainer}>
                        <Text style={styles.userName}>
                            {customServices[0]?.full_name} {role === "seller" ? "Auto Spare Parts Shops" : "Auto Mechanic Shops"}
                        </Text>
                        <View style={styles.middleContainer}>

                            <Text style={styles.userEmail}>{customServices[0]?.email}</Text>
                            {role === 'seller' &&
                                <Pressable onPress={() => navigation.navigate('Cart')}>
                                    <View style={styles.cartContainer}>
                                        <MaterialCommunityIcons name="cart" size={24} color="white" />
                                        <Text style={styles.countText}>{cartCount}</Text>
                                    </View>
                                </Pressable>
                            }
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                            <Text style={{ color: 'white' }}>Rate Us Here:</Text>
                            <TouchableOpacity >
                                <StarRating
                                    rating={rating ? rating.toFixed(2) : "0.00"}  // Ensure rating is valid
                                    onChange={handleRating}
                                    enableSwiping={true}
                                />
                            </TouchableOpacity>
                            <Text style={{ color: 'white' }}>({rating ? rating.toFixed(2) : "0.00"})</Text>

                        </View>
                    </View>
                ) : (
                    <View style={styles.textContainer}>
                        <View style={styles.middleContainer}>
                            <Text style={[{ fontSize: 30 }, styles.userEmail]}>
                                {role === 'seller' ? 'Product Dashboard' : 'Services_Dashboard'}
                            </Text>
                            {role === 'seller' &&
                                <Pressable onPress={() => navigation.navigate('Cart')}>
                                    <View style={styles.cartContainer}>
                                        <MaterialCommunityIcons name="cart" size={24} color="white" />
                                        <Text style={styles.countText}>{cartCount}</Text>
                                    </View>
                                </Pressable>
                            }
                        </View>
                    </View>
                )}
                {!allShop && (
                    <>
                    <View style={styles.searchContainer}>
                        <View
                            style={[
                                styles.searchBarContainer,
                                { borderColor: searchBorderColor },
                            ]}>
                            <Feather
                                name="search"
                                size={width * 0.045}
                                color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={[
                                    styles.searchInputField,
                                    { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                                ]}
                                placeholder="Search!"
                                placeholderTextColor={
                                    colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
                                }
                                onFocus={() => setSearchBorderColor(COLORS.primary)}
                                onBlur={() => setSearchBorderColor(COLORS.lightGray)}
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>
                    </View>
                     <View style={styles.sortContainer}>
                            <TouchableOpacity
                              style={styles.radioButton}
                              onPress={() => setSortOrder('asc')}>
                              <View style={styles.radioCircle}>
                                {sortOrder === 'asc' && <View style={styles.selectedRb} />}
                              </View>
                              <Text style={styles.radioText}>Lowest to Highest</Text>
                            </TouchableOpacity>
                    
                            <TouchableOpacity
                              style={styles.radioButton}
                              onPress={() => setSortOrder('desc')}>
                              <View style={styles.radioCircle}>
                                {sortOrder === 'desc' && <View style={styles.selectedRb} />}
                              </View>
                              <Text style={styles.radioText}>Highest to Lowest</Text>
                            </TouchableOpacity>
                          </View>
                          </>
                )

                }



                {filteredServices.length > 0 ? (
                    <FlatList
                        data={filteredServices}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => (
                            <ItemCard
                                service={item}
                                role={role}
                                setAllShop={setAllShop}
                                userId={userId}
                                handleAddToCart={() => handleAddToCart(item)}
                                disableScrollViewPanResponder={true}
                            />
                        )}
                        contentContainerStyle={{ paddingTop: 30 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />
                ) : (
                    <View style={styles.noServiceContainer}>
                        <Text style={[
                            styles.noServiceText,
                            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark }
                        ]}>
                            No Service Available!
                        </Text>
                    </View>
                )}

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};



export default ItemsDashboard;

const styles = StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: COLORS.white
    },

    searchContainer: {
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.03
    },

    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.03
    },

    searchInputField: {
        paddingHorizontal: width * 0.03,
        fontFamily: FONTS.semiBold,
        width: width * 0.65
    },

    searchIcon: {
        marginRight: width * 0.01
    },

    serviceContainer: {
        paddingVertical: height * 0.01
    },
    textContainer: {
        alignItems: "center",
        paddingVertical: height * 0.02,
        backgroundColor: COLORS.lightDark
    },
    userName: {
        fontSize: width * 0.05,
        fontFamily: FONTS.bold,
        color: COLORS.warning,
    },
    middleContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Aligns items vertically
        width: '100%', // Takes full width
        paddingHorizontal: 10,
    },
    userEmail: {
        flex: 1, // Takes available space, centering it
        textAlign: 'center',
        color: COLORS.white,
    },
    cartContainer: {
        flexDirection: 'row', // Places icon and count side by side
        alignItems: 'center', // Aligns them properly
        gap: 3, // Adds spacing between icon and count
        marginRight: 2,
        borderRadius: 50, // Ensures rounded borders
        borderColor: COLORS.lightGray,
        borderWidth: 4,
        padding: 5,
    },

    countText: {
        color: COLORS.white,
        fontSize: 16,
    },


    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: height * 0.01,
    },
    ratingText: {
        fontSize: width * 0.04,
        fontFamily: FONTS.medium,
        marginLeft: width * 0.02,
        color: COLORS.white,
    },
    noServiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.25
    },

    noServiceText: {
        fontFamily: FONTS.semiBold,
        fontSize: width * 0.05,
        textAlign: 'center'
    },
    rateUsContainer: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row", // "Rate Us" and icon in one row
        alignItems: "center",
        justifyContent: "center",
    },
    rateUsText: {
        color: COLORS.white,
        fontSize: width * 0.05,
        fontFamily: FONTS.bold,
        textAlign: "center",
    },


    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
      },
    
      radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    
      radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
      },
    
      selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
      },
    
      radioText: {
        fontSize: 14,
        color: COLORS.dark,
      },

});

