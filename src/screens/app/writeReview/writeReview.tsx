import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import StarRating, {StarRatingDisplay} from 'react-native-star-rating-widget';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import CustomBackArrow from '../../../components/customerTopBar';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {UserImg} from '../../../components/userImg';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {useDispatch} from 'react-redux';
import {
  getDeliveryDetails,
  postReviewDetails,
} from '../../../redux/slice/dataSlice';
import moment from 'moment';
import AnimatedComponent from '../../../components/errorAnimation';
const WriteReview = () => {
  const route: any = useRoute();
  const bookingId = route?.params?.id;
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);

  const [emptyReview, setEmptyReview] = useState(false);
  const [reviewTxt, setReviewTxt] = useState('');

  const [deliveryDetails, setDeliveryDetails] = useState<any>();
  console.log('deliveryDetails: ', deliveryDetails);
  const animatedComponentRef: any = useRef();
  const animatedRatingRef: any = useRef();

  useEffect(() => {
    getDetails(bookingId);
  }, []);

  useEffect(() => {
    setRatingError(false);
  }, [rating]);

  const getDetails = async (bookingId: string) => {
    try {
      const response: any = await dispatch(getDeliveryDetails(bookingId));
      if (response?.payload?.success) {
        const data = response?.payload?.data;
        console.log('getDetails data: ', JSON.stringify(data));
        data.driverAssigned.rating = parseFloat(
          response?.payload?.data?.driverAssigned?.rating || 0,
        ).toFixed(1);
        let updatedJsonData = data;
        setDeliveryDetails(updatedJsonData);
      } else {
        if (response?.payload?.message) {
          Alert.alert(response?.payload?.message);
        } else {
          Alert.alert('Please Try Again');
        }
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  const postReview = async () => {
    if (reviewTxt === '') {
      animatedComponentRef.current.animateView();
      setEmptyReview(true);
    } else if (rating == 0) {
      setRatingError(true);
      animatedRatingRef.current.animateView();
    } else {
      try {
        const reviewData = {
          bookingId: bookingId,
          companyId: deliveryDetails?.acceptedBy,
          driverId: deliveryDetails?.driverAssigned?._id,
          reviewMessage: reviewTxt,
          rating: rating,
        };
        const response: any = await dispatch(postReviewDetails(reviewData));
        if (response?.payload?.success) {
          navigation.replace('RatingAndReview', {
            companyId: deliveryDetails?.acceptedBy,
            driverId: deliveryDetails?.driverAssigned?._id,
          });
        } else {
          if (response?.payload?.message) {
            Alert.alert(response?.payload?.message);
          } else {
            Alert.alert('Please Try Again');
          }
        }
      } catch (error) {
        console.log('Async thunk failed:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <CustomBackArrow
          showArrow={true}
          showTitle={true}
          onPressArrow={() => {
            navigation.goBack();
          }}
          titleTxt="Write A Review"
          inverted={false}
          containerStyle={styles.headerChildView}
        />
      </View>

      <ScrollView contentContainerStyle={{padding: 7}}>
        <View style={styles.cardStyle}>
          <AntDesign name="checkcircleo" style={styles.checkIcon} />
          <LargeText text={'Delivery Completed'} style={styles.deliveryTxt} />
          <View style={styles.twoRowItemsContainer}>
            <View style={styles.imageAndContentView}>
              <UserImg imageContainer={styles.userImgContainer} />
              <View>
                <MediumText
                  text={
                    deliveryDetails?.driverAssigned?.firstname +
                    ' ' +
                    deliveryDetails?.driverAssigned?.lastname
                  }
                  style={{color: Colors.blackColor}}
                />
                <View style={styles.ratingContainer}>
                  <StarRatingDisplay
                    rating={deliveryDetails?.driverAssigned?.rating}
                    starStyle={styles.starStyle}
                    starSize={responsiveFontSize(14)}
                  />

                  <MediumText
                    text={deliveryDetails?.driverAssigned?.rating}
                    style={{color: Colors.lightGreyColor}}
                  />
                </View>
              </View>
            </View>
            <View style={styles.orderNumView}>
              <MediumText text={'Order Number'} style={styles.orderNumTxt} />
              <MediumText
                numOfLines={1}
                text={'#' + deliveryDetails?._id}
                style={{color: Colors.blackColor, alignSelf: 'flex-end'}}
              />
            </View>
          </View>
          <View style={styles.horizontalLine} />
          <View style={styles.fromToMainContainer}>
            <View style={styles.fromToChildContainer}>
              <Image
                source={require('../../../theme/assets/images/reviewFormToLine.png')}
                resizeMode="contain"
                style={styles.fromToImg}
              />
              <View style={styles.fromToContentContainer}>
                <View>
                  <MediumText
                    text={deliveryDetails?.pickupLocationName}
                    style={{color: Colors.blackColor}}
                  />
                  <View
                    style={[
                      styles.nameAndStarContainer,
                      {gap: responsiveFontSize(5)},
                    ]}>
                    <Feather name="clock" style={styles.smallRoundIcon} />
                    <MediumText
                      text={
                        moment(deliveryDetails?.createdAt).format('LT') +
                        ', ' +
                        moment(deliveryDetails?.createdAt).format(
                          'MMMM Do YYYY',
                        )
                      }
                      style={{color: Colors.lightGreyColor}}
                    />
                  </View>
                </View>
                <View>
                  <MediumText
                    text={deliveryDetails?.dropoffLocationName}
                    style={{color: Colors.blackColor}}
                  />
                  <View
                    style={[
                      styles.nameAndStarContainer,
                      {gap: responsiveFontSize(5)},
                    ]}>
                    <Feather name="clock" style={styles.smallRoundIcon} />
                    <MediumText
                      text={
                        moment(deliveryDetails?.updatedAt).format('LT') +
                        ', ' +
                        moment(deliveryDetails?.updatedAt).format(
                          'MMMM Do YYYY',
                        )
                      }
                      style={{color: Colors.lightGreyColor}}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.extraDetailsContainer}>
          <MediumText
            text="Write Your Review"
            style={[styles.titles, {color: Colors.blackColor}]}
          />
          <AnimatedComponent ref={animatedComponentRef}>
            <TextInput
              placeholder="Would you like to write about your experience?"
              style={[
                styles.inputLocations,
                {height: getResponsiveSize(15).height},
              ]}
              textAlignVertical="top"
              multiline
              maxLength={400}
              placeholderTextColor={
                emptyReview ? Colors.redColor : Colors.darkGreyColor
              }
              onChangeText={txt => {
                setReviewTxt(txt);
              }}
            />
          </AnimatedComponent>

          <SmallText
            text={`${400 - reviewTxt.length} characters left`}
            style={styles.charLengthTxt}
          />
        </View>

        <View style={styles.extraDetailsContainer}>
          <MediumText
            text="Choose Rating"
            style={[styles.titles, {color: Colors.blackColor}]}
          />
          <AnimatedComponent ref={animatedRatingRef}>
            <TouchableOpacity style={styles.hazardousOpacity}>
              <View style={[styles.ratingContainer, {width: '100%'}]}>
                <StarRating
                  rating={rating}
                  onChange={setRating}
                  starStyle={[
                    styles.starStyle,
                    {width: getResponsiveSize(5).width},
                  ]}
                  starSize={responsiveFontSize(25)}
                />
                <MediumText
                  text={rating}
                  style={{
                    color: ratingError
                      ? Colors.redColor
                      : Colors.lightGreyColor,
                  }}
                />
              </View>
            </TouchableOpacity>
          </AnimatedComponent>
        </View>
        <Button
          title="Submit Feedback"
          isInverted={false}
          onPress={postReview}
          containerStyle={styles.continueButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mediumGrayClor,
    justifyContent: 'space-between',
  },
  topContainer: {
    width: '100%',
    backgroundColor: Colors.primaryColor,
    padding: responsiveFontSize(10),
    flexDirection: 'row',
  },
  headerChildView: {
    width: '65%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerStyle: {
    alignSelf: 'flex-start',
  },
  cardStyle: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Colors.whiteColor,
    overflow: 'hidden',
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    paddingVertical: getResponsiveSize(2).height,
    justifyContent: 'center',
    marginVertical: responsiveFontSize(8),
    borderRadius: responsiveFontSize(7),
    alignItems: 'center',
    gap: responsiveFontSize(5),
  },
  checkIcon: {
    color: Colors.darkGreenColor,
    fontSize: responsiveFontSize(50),
  },
  deliveryTxt: {
    color: Colors.darkGreenColor,
    fontSize: responsiveFontSize(25),
  },
  twoRowItemsContainer: {
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  imageAndContentView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveFontSize(8),
  },
  userImgContainer: {
    width: getResponsiveSize(10).width,
    height: getResponsiveSize(5).height,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: responsiveFontSize(4),
  },
  starStyle: {
    width: getResponsiveSize(1).width,
    left: -7,
  },
  orderNumView: {
    width: '50%',
  },
  orderNumTxt: {
    color: Colors.darkGreyColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
    alignSelf: 'flex-end',
  },
  horizontalLine: {
    borderBottomColor: Colors.lightGreyColor,
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  fromToMainContainer: {
    width: '90%',
    alignSelf: 'center',
    height: getResponsiveSize(14).height,
    flexDirection: 'row',
  },
  fromToChildContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: responsiveFontSize(5),
  },
  fromToContentContainer: {
    justifyContent: 'space-between',
    gap: responsiveFontSize(10),
  },
  fromToImg: {
    width: '10%',
    height: '85%',
    alignSelf: 'center',
  },
  nameAndStarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 3,
  },
  smallRoundIcon: {
    fontSize: responsiveFontSize(13),
    color: Colors.lightGreyColor,
  },
  extraDetailsContainer: {
    marginTop: getResponsiveSize(2).height,
    width: '95%',
    alignSelf: 'center',
    marginLeft: 0,
  },
  titles: {
    fontSize: responsiveFontSize(16),
    marginVertical: getResponsiveSize(0.5).height,
  },
  inputLocations: {
    backgroundColor: Colors.whiteColor,
    borderRadius: getResponsiveSize(1).width,
    width: '100%',
    paddingLeft: getResponsiveSize(2).width,
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.blackColor,
  },
  emptyTextInput: {
    borderColor: Colors.redColor,
  },
  locationIcons: {
    fontSize: responsiveFontSize(16),
    color: Colors.whiteColor,
  },
  hazardousOpacity: {
    backgroundColor: Colors.whiteColor,
    borderRadius: getResponsiveSize(2).width,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getResponsiveSize(3).width,
    marginLeft: 0,
    padding: 5,
  },
  selectOptionTxt: {
    color: Colors.darkGreyColor,
    marginVertical: getResponsiveSize(2).height,
    fontSize: responsiveFontSize(13),
  },
  dropDownIcon: {
    color: Colors.blackColor,
    fontSize: responsiveFontSize(35),
  },
  charLengthTxt: {
    color: Colors.darkGreyColor,
    alignSelf: 'flex-end',
    marginVertical: responsiveFontSize(5),
  },
  continueButton: {
    width: '95%',
    marginVertical: getResponsiveSize(2).height,
    backgroundColor: Colors.primaryColor,
  },
});

export default WriteReview;
