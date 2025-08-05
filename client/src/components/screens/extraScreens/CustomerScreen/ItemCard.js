/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Modal, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Dimensions, ScrollView, TextInput, KeyboardAvoidingView, } from 'react-native';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../../constants/BASE_URL';
const { Base_Endpoint } = BASE_URL; // Extract the base endpoint from the URL


const { width, height } = Dimensions.get('window');

const ItemCard = ({ service, role, setAllShop, userId, handleAddToCart, }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  // const [reviewText, setReviewText] = useState('');
  // const [rating, setRating] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  // const getUserId = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       const encodedPayload = token.split(".")[1]; // JWT payload
  //       const decodedBytes = base64.decode(encodedPayload);
  //       const decodedText = utf8.decode(decodedBytes);
  //       const decodedObject = JSON.parse(decodedText);
  //       const id = decodedObject?.user?.id;
  //       setUserId(id);
  //     }
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //   }
  // };


  useEffect(() => {
    if (modalVisible) {
      getReviews();
    }
  }, [modalVisible]);


  const handleBooking = () => {
    const service_image = role === 'seller' && service.img ? { uri: service.img }
      : service.Img ? { uri: service.Img }
        : require('./../../../../assets/shop/default_img.png');

    navigation.navigate('Service_Booking', {
      service_image: service_image,  // Pass the dynamically selected service image
      service_name: service.service_name,
      service_description: service.service_description,
      service_price: String(service.service_price),
      service_id: service.service_id,
    });
  };
  // const handleSubmitReview = async () => {
  //   if (!rating || !reviewText) {
  //     alert('Please enter both rating and review.');
  //     return;
  //   }

  //   const itemId = service._id;
  //   const itemType = role === 'seller' ? 'Product' : 'Service';
  //   try {

  //     const token = await AsyncStorage.getItem('token');
  //     if (!token) {
  //       navigation.replace('Signin');
  //       return;
  //     }

  //     const response = await fetch(`http://10.0.2.2:5000/api/reviews/create-review`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         itemId,
  //         itemType,
  //         rating: Number(rating),
  //         comment: reviewText,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       alert('Review submitted!');
  //       setReviewText('');
  //       setRating('');
  //     } else {
  //       alert(data.error || 'Something went wrong.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert('Error submitting review');
  //   }
  // };

  const getReviews = async () => {
    try {
      setLoadingReviews(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Signin');
        return;
      }
      
      const itemId = service._id;
      const itemType = role === 'seller' ? 'Product' : 'Service';
      console.log(itemId, itemType);
      const response = await fetch(`${Base_Endpoint}/api/reviews/get-review-by-id/${itemType}/${itemId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setReviews(data || []);
      } else {
        console.warn('Failed to fetch reviews:', data.error || 'Unknown error');
        setReviews([]);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  };



  return (
    <SafeAreaView style={styles.primaryContainer}>
      {/* Card Clickable to Open Modal */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={role === 'seller' && service.img ? { uri: service.img } : service.Img ? { uri: service.Img } : require('./../../../../assets/shop/default_img.png')}

                style={styles.image}
                onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
              />
            </View>

            <View style={styles.productDetails}>
              <Text style={styles.serviceName}>
                {role === "mechanic" ? service.service_name : service.product_name}
              </Text>
              <Text style={styles.servicePrice}>
                Price: {role === 'mechanic' ? service.service_price : service.product_price}
              </Text>
              <Text style={styles.serviceDescription}>
                {role === 'mechanic' ? service.service_description : service.product_description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>

      {/* Modal for Showing Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss} // Dismiss keyboard only when tapping outside
          accessible={false}
        >
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView style={styles.modalContent}>
              <ScrollView>

                {(role === 'seller' && service.img) || service.Img ? (
                  <Image
                    source={
                      role === 'seller' && service.img
                        ? { uri: service.img }
                        : { uri: service.Img }
                    }
                    style={styles.modalImage}
                  />
                ) : (
                  <View style={[styles.modalImage, styles.noImageContainer]}>
                    <Text style={styles.noImageText}>No Image Available</Text>
                  </View>
                )}

                <Text style={styles.modalTitle}>
                  {role === 'seller' ? service.product_name : service.service_name}
                </Text>

                <Text style={styles.modalPrice}>
                  Price: {role === 'seller' ? service.product_price : service.service_price}
                </Text>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {role !== 'seller' && <Text style={styles.modalText}>
                    Model: {service.service_model}
                  </Text>}
                  <View />
                  {role !== 'seller' && <Text style={styles.modalText}>
                    Engine Power: {service.engine_power}
                  </Text>}
                </View>


                <Text style={styles.modalText}>
                  Description: {role === 'seller' ? service.product_description : service.service_description}
                </Text>

                {/* Fake Reviews */}
                <Text style={styles.reviewTitle}>Customer Reviews</Text>
                <View style={styles.reviewContainer}>
                  {/* <Text style={styles.reviewText}>⭐ 4.5 - "Great service, highly recommended!"</Text>
                  <Text style={styles.reviewText}>⭐ 4.0 - "Fast and efficient, worth the price!"</Text>
                  <Text style={styles.reviewText}>⭐ 5.0 - "Amazing experience, will book again!"</Text> */}
                  {reviews.length > 0 && (
                    reviews.map((review, index) => (
                      <Text key={index} style={styles.reviewText}>
                        ⭐ {review.rating} - "{review.comment}"
                      </Text>
                    ))
                  )}

                </View>
                {/* <View>
                  <Text style={styles.reviewTitle}>Write a Review</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your review"
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Rating (1-5)"
                    value={rating}
                    onChangeText={setRating}
                    keyboardType="numeric"
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitReview}
                  >
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                  </TouchableOpacity>
                </View> */}
                {/* Buttons for Booking & Visiting Shop */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => {
                      if (role === "mechanic") {
                        handleBooking();
                      } else if (role === "seller") {
                        handleAddToCart(userId, service,);
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>{role === 'mechanic' ? 'Book Service' : 'Add to Cart'}</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={styles.visitButton}
                    onPress={() => {
                      setAllShop(service.shop_owner);
                      setModalVisible(false); // Close modal
                      //navigation.navigate('Shop', { role: role, allShop: service.shop_owner });
                    }}
                  >
                    <Text style={styles.buttonText}>Visit Shop</Text>
                  </TouchableOpacity>
                </View>

                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  card: {
    width: width * 0.9,
    borderRadius: 12,
    padding: width * 0.025,
    shadowColor: COLORS.white,
    shadowOffset: { width: width * 0.012, height: height * 0.012 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.008,
    elevation: 2,
    backgroundColor: COLORS.lightDark,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: height * 0.30,
    overflow: 'hidden',
    borderRadius: width * 0.02,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productDetails: {
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
  serviceName: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    marginTop: height * 0.01,
    textAlign: 'center',
    color: COLORS.white,
  },
  servicePrice: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    color: COLORS.warning,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: width * 0.05,
    borderRadius: width * 0.025,
    marginHorizontal: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',

  },
  modalImage: {
    width: width * 0.65,
    height: height * 0.15,
    borderRadius: width * 0.025,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: height * 0.012,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: width * 0.045,
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalText: {
    fontSize: width * 0.04,
    marginVertical: height * 0.001,
    textAlign: 'center',
  },
  reviewTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: height * 0.015,
    textAlign: 'center',
  },
  reviewContainer: {
    backgroundColor: '#f2f2f2',
    padding: width * 0.025,
    borderRadius: width * 0.025,
    marginTop: height * 0.012,
  },
  reviewText: {
    fontSize: width * 0.035,
    marginBottom: height * 0.005,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.005,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    padding: width * 0.025,
    borderRadius: width * 0.015,
    flex: 1,
    marginRight: width * 0.012,
    alignItems: 'center',
  },
  visitButton: {
    backgroundColor: COLORS.darkColor,
    padding: width * 0.025,
    borderRadius: width * 0.015,
    flex: 1,
    marginLeft: width * 0.012,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: width * 0.035,
  },
  closeButton: {
    backgroundColor: COLORS.lightGray,
    padding: width * 0.025,
    borderRadius: width * 0.015,
    marginTop: height * 0.012,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: width * 0.04,
    color: COLORS.darkColor,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000', // Black border
    backgroundColor: '#fff', // White background for contrast
    color: '#000', // Ensure text is visible
    padding: 5,
    borderRadius: 5,
    marginVertical: 2,
  },

  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  noImageText: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
  },
});


export default ItemCard;
