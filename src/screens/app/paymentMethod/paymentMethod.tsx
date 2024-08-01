import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import CustomBackArrow from '../../../components/customerTopBar';
import {LargeText, MediumText} from '../../../components/text';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {StripeProvider} from '@stripe/stripe-react-native';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {Stripe_Publish_Key} from '../../../../env';
import {useDispatch, useSelector} from 'react-redux';
import {
  getInvoice,
  getPaymentToken,
  isLoader,
} from '../../../redux/slice/dataSlice';
import NetInfo from '@react-native-community/netinfo';
import {ShowMessage} from '../../../utils/ShowMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const PaymentMethod = () => {
  const {confirmPayment} = useStripe();
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const route: any = useRoute();
  const bookingId = route?.params?.id;
  const scrollViewRef: any = useRef();
  const [invoiceDetails, setInvoiceDetails] = useState<any>();
  // console.log('invoiceDetails: ', invoiceDetails);

  const [isValidCard, setIsValidCard] = useState(false);
  const [last4Digits, setLast4Digits] = useState('');

  const [isShowCard, setIsShowCard] = useState(false);

  const reduxData = useSelector((state: any) => state?.data?.loginData);

  let userData: any;
  //checking if the redux data is in string or not
  if (typeof reduxData === 'string') {
    userData = JSON.parse(reduxData);
  } else {
    userData = reduxData;
  }

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  //getting invoice details for selected/completed ride
  const getInvoiceDetails = async () => {
    try {
      const response: any = await dispatch(getInvoice(bookingId));
      // console.log('response of payment detals is ', JSON.stringify(response));
      if (response?.payload?.success) {
        setInvoiceDetails(response?.payload);
      } else {
        if (response?.payload?.message) {
          ShowMessage('error', response?.payload?.message || '');
        } else {
          ShowMessage('error', 'Invoice detail not fetch.Please Try Again');
        }
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  //getting payment details against current user
  const getPaymentDetails = () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        try {
          const response: any = await dispatch(
            getPaymentToken({
              amount: invoiceDetails?.bookingDetail?.acceptedBid?.price.replace(
                '$',
                '',
              ),
              userId: userData?.user?._id,
              requestId: bookingId,
            }),
          );
          console.log('getPaymentDetails response: ', response);
          if (response?.payload) {
            const clientSecret = response?.payload?.clientSecret || '';
            if (clientSecret !== '') {
              handlePayment(clientSecret);
            }
          } else {
            if (response?.payload?.message) {
              ShowMessage('error', response?.payload?.message || '');
            } else {
              ShowMessage('error', 'Please Try Again');
            }
          }
        } catch (error) {
          console.log('Async thunk failed:', error);
        }
      } else {
        ShowMessage('error', 'Please connect internet');
      }
    });
  };

  const handlePayment = async (paymentSecretKey: string) => {
    try {
      await dispatch(isLoader(true));
      // Confirm the payment using Stripe's confirmPayment method
      const setupIntentResult: any = await confirmPayment(paymentSecretKey, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: userData?.user?.firstname + userData?.user?.lastname,
            email: userData?.user?.email?.toString(),
            phone: userData?.user?.phoneno.toString(),
          },
        },
      });
      console.log('handlePayment response: ', setupIntentResult);
      if (setupIntentResult?.error) {
        // Handle error confirming payment
        await dispatch(isLoader(false));
        ShowMessage(
          'error',
          setupIntentResult?.error?.message || 'error processing payments',
        );
      } else {
        await dispatch(isLoader(false));
        ShowMessage('success', 'Payment successfull!');
        navigation.replace('WriteReview', {id: bookingId});
        // onCardSuccess(card?.last4Digits);
      }
    } catch (error) {
      await dispatch(isLoader(false));
    }
  };

  const MinutesToHoursConverter = ({minutes}: any) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return (
      <View>
        <MediumText
          text={hours + ' hour ' + remainingMinutes.toFixed() + ' min'}
          style={{color: Colors.darkGreyColor}}
        />
      </View>
    );
  };

  return (
    <StripeProvider publishableKey={Stripe_Publish_Key}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          // nestedScrollEnabled
          contentContainerStyle={styles.scrollViewContainer}
          ref={scrollViewRef}>
          <ImageBackground
            source={require('../../../theme/assets/images/whitenBlueBackground.png')}
            style={styles.backgroundImageStyle}>
            <CustomBackArrow
              showArrow={true}
              showTitle={true}
              // showDots={true}
              isGap={true}
              onPressArrow={() => {
                navigation.goBack();
              }}
              titleTxt="Invoice Details"
              inverted={true}
              containerStyle={styles.topContainer}
            />
            {!invoiceDetails && (
              <ActivityIndicator
                size={50}
                color={Colors?.whiteColor}
                style={{bottom: 200}}
              />
            )}
            {invoiceDetails && (
              <>
                <View style={styles.imgAndTxtContainer}>
                  <View style={styles.truckImgView}>
                    {/*   {invoiceDetails?.bookingDetail?.truckId?.picture && (
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 70 / 2,
                    backgroundColor: '#154A8A',
                    position: 'absolute',
                  }}
                />
              )}

             <Image
                source={
                  invoiceDetails?.bookingDetail?.truckId?.picture
                    ? {uri: invoiceDetails?.bookingDetail?.truckId?.picture}
                    : require('../../../theme/assets/images/truckWithBlueBack.png')
                }
                style={styles.truckImgStyle}
                resizeMode="contain"
              /> */}
                    <Image
                      source={require('../../../theme/assets/images/truckWithBlueBack.png')}
                      style={styles.truckImgStyle}
                      resizeMode="contain"
                    />
                  </View>
                  <View>
                    <LargeText
                      text={
                        invoiceDetails?.totalInvoice !== 'NaN'
                          ? '$' + invoiceDetails?.totalInvoice
                          : invoiceDetails?.bookingDetail?.acceptedBid?.price
                      }
                      style={styles.titlePrice}
                    />
                    <View
                      style={[
                        styles.nameAndStarContainer,
                        {gap: responsiveFontSize(5)},
                      ]}>
                      <Feather name="clock" style={styles.smallRoundIcon} />
                      <MinutesToHoursConverter
                        minutes={invoiceDetails?.bookingDetail?.extimatedTime}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.twoRowItemsContainer}>
                    <MediumText
                      text={'Truck'}
                      style={styles.detailsTitlesTxt}
                    />
                    <MediumText
                      text={invoiceDetails?.bookingDetail?.truckId?.title}
                      style={styles.detailsDescriptionTxt}
                    />
                  </View>
                  <View style={styles.twoRowItemsContainer}>
                    <MediumText
                      text={'Tracking ID'}
                      style={styles.detailsTitlesTxt}
                    />
                    <MediumText
                      text={invoiceDetails?.bookingDetail?._id}
                      style={styles.detailsDescriptionTxt}
                      numOfLines={1}
                    />
                  </View>
                  <View style={styles.twoRowItemsContainer}>
                    <MediumText text={'From'} style={styles.detailsTitlesTxt} />
                    <MediumText
                      text={invoiceDetails?.bookingDetail?.pickupLocationName}
                      style={styles.detailsDescriptionTxt}
                      numOfLines={1}
                    />
                  </View>
                  <View style={styles.twoRowItemsContainer}>
                    <MediumText text={'To'} style={styles.detailsTitlesTxt} />
                    <MediumText
                      text={invoiceDetails?.bookingDetail?.dropoffLocationName}
                      style={styles.detailsDescriptionTxt}
                      numOfLines={1}
                    />
                  </View>
                  <View style={styles.twoRowItemsContainer}>
                    <MediumText
                      text={'Distance'}
                      style={styles.detailsTitlesTxt}
                    />
                    <MediumText
                      text={
                        invoiceDetails?.bookingDetail?.estimatedDistance
                          ?.$numberDecimal + ' miles'
                      }
                      style={styles.detailsDescriptionTxt}
                    />
                  </View>
                  <View style={styles.twoRowItemsContainer}>
                    <MediumText
                      text={'Weight'}
                      style={styles.detailsTitlesTxt}
                    />
                    <MediumText
                      text={invoiceDetails?.bookingDetail?.weight + ' tons'}
                      style={styles.detailsDescriptionTxt}
                    />
                  </View>
                  <View style={styles.twoRowItemsContainer}>
                    <MediumText
                      text={'Total Price'}
                      style={styles.detailsTitlesTxt}
                    />
                    <MediumText
                      text={
                        invoiceDetails?.totalInvoice !== 'NaN'
                          ? '$' + invoiceDetails?.totalInvoice
                          : invoiceDetails?.bookingDetail?.acceptedBid?.price
                      }
                      style={styles.detailsDescriptionTxt}
                    />
                  </View>
                  <View style={styles.botomDetailsContainer}>
                    <MediumText
                      text={'Payment Method'}
                      style={styles.paymentMethodTxt}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      {!isShowCard ? (
                        <>
                          <LargeText
                            text={'Credit Card'}
                            style={{color: Colors.whiteColor}}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              // if (card) {
                              //   setCard(null);
                              // } else {
                              //   if (isValidCard) {
                              //     setCard({
                              //       isValidCard: isValidCard,
                              //       last4Digits: last4Digits,
                              //     });
                              //   } else {
                              //     ShowMessage(
                              //       'error',
                              //       'Please Add Correct Details!',
                              //       20,
                              //     );
                              //   }
                              // }
                              setIsShowCard(true);
                              scrollViewRef.current.scrollToEnd({
                                animated: true,
                              });
                            }}>
                            <MediumText text={'Add'} style={styles.changeTxt} />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <CardField
                          postalCodeEnabled={false}
                          placeholders={{
                            number: 'Card number',
                          }}
                          cardStyle={styles.cardStyle}
                          style={styles.cardFieldStyle}
                          onCardChange={cardDetails => {
                            if (
                              cardDetails?.validNumber === 'Valid' &&
                              cardDetails?.validCVC === 'Valid' &&
                              cardDetails?.validExpiryDate === 'Valid'
                            ) {
                              setLast4Digits(cardDetails?.last4 || '');
                              setIsValidCard(true);
                            } else {
                              setIsValidCard(false);
                            }
                          }}
                        />
                      )}
                    </View>
                  </View>
                  {isShowCard && (
                    <View style={styles.botomDetailsContainer2}>
                      <View
                        style={[
                          styles.nameAndStarContainer,
                          {gap: responsiveFontSize(5)},
                        ]}>
                        <Entypo
                          name="credit-card"
                          style={[styles.smallRoundIcon, styles.cardIconStyle]}
                        />
                        <MediumText
                          text={
                            last4Digits !== '' ? '****' + last4Digits : '****'
                          }
                          style={{color: Colors.whiteColor}}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          if (isValidCard) {
                            getPaymentDetails();
                          } else {
                            // navigation.replace('WriteReview', {id: bookingId});
                            ShowMessage(
                              'error',
                              'Please enter valid card details',
                              30,
                            );
                          }
                        }}
                        style={[styles.makePaymentOpaciy]}>
                        <MediumText
                          text={'Make Payments'}
                          style={styles.makePaymentTxt}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            )}
          </ImageBackground>
        </KeyboardAwareScrollView>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.inputPlaceHolder,
  },
  scrollViewContainer: {
    justifyContent: 'space-between',
    backgroundColor: 'white',
    flexGrow: 1,
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: getResponsiveSize(1).height,
    paddingBottom: getResponsiveSize(3).height,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    marginTop: getResponsiveSize(1).height,
  },
  titleTxt: {
    color: Colors.blackColor,
  },
  imgAndTxtContainer: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: Colors.whiteColor,
    padding: responsiveFontSize(15),
    borderRadius: responsiveFontSize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 2,
    shadowRadius: 15,
    elevation: 5,
    marginVertical: getResponsiveSize(6).height,
  },
  truckImgView: {
    width: getResponsiveSize(38).width,
    height: getResponsiveSize(8).height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // truckImgStyle: {
  //   width: '90%',
  //   height: '90%',
  // },
  truckImgStyle: {
    width: '100%',
    height: '100%',
  },
  titlePrice: {
    color: Colors.blackColor,
    fontSize: responsiveFontSize(25),
  },
  nameAndStarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 3,
  },
  cardIconStyle: {
    fontSize: responsiveFontSize(18),
    color: Colors.lightPrimaryColor,
    borderRadius: 20,
  },
  smallRoundIcon: {
    fontSize: responsiveFontSize(13),
    color: Colors.darkGreyColor,
  },
  contentContainer: {
    width: '100%',
    gap: responsiveFontSize(25),
  },
  twoRowItemsContainer: {
    width: '75%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  detailsTitlesTxt: {
    color: Colors.lightGreyColor,
  },
  detailsDescriptionTxt: {
    color: Colors.whiteColor,
    width: '60%',
    textAlign: 'right',
  },
  botomDetailsContainer: {
    // width: '90%',
    // alignSelf: 'center',

    width: '75%',
    alignSelf: 'center',

    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  botomDetailsContainer2: {
    width: '75%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodTxt: {
    color: Colors.darkGreyColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  changeTxt: {
    color: Colors.lightPrimaryColor,
    alignSelf: 'flex-end',
    margin: 5,
  },
  makePaymentTxt: {
    color: Colors.primaryColor,
    alignSelf: 'flex-end',
    margin: 5,
  },
  makePaymentOpaciy: {
    backgroundColor: Colors.whiteColor,
    padding: responsiveFontSize(8),
    paddingHorizontal: responsiveFontSize(14),
    borderRadius: responsiveFontSize(6),
  },
  cardStyle: {
    backgroundColor: Colors.whiteColor,
    textColor: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Medium,
    borderRadius: responsiveFontSize(5),
    fontSize: responsiveFontSize(15),
  },
  cardFieldStyle: {
    width: '100%',
    alignSelf: 'center',
    height: 40,
    marginTop: 10,
  },
  buttonStyle: {
    width: getResponsiveSize(50).width,
    marginBottom: getResponsiveSize(2).height,
  },
});

export default PaymentMethod;
