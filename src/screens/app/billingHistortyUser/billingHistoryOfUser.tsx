import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Colors from '../../../assets/colors/Colors';
import CustomBackArrow from '../../../components/customerTopBar';
import {MediumText, SmallText} from '../../../components/text';
import {APPJSONFILES} from '../../../jsonFiles/JsonFiles';
import {shipmentHistoryTYPES} from '../../../types/AppInterfaceTypes';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  cancelCurrentRequest,
  getShipments,
  notificationData,
} from '../../../redux/slice/dataSlice';
import moment from 'moment';
import FONTS from '../../../assets/fonts/FONTS';
import {RootState} from '../../../store';
const UserBillingHistory = props => {
  const navigation: any = useNavigation();
  const [selectedStep, setSelectedStep] = useState<any>('pending');

  const [shipmentData, setShipmentData] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<any>(0);
  const {notifications}: any = useSelector((state: RootState) => state?.data);
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const params: any = useRoute();
  const itemOpacity = useRef(new Animated.Value(3)).current;
  const blinkingItemAnimation: any = useRef(null);
  const [hasNavigated, setHasNavigated] = useState<boolean>();

  useEffect(() => {
    const getAsyncValue = async () => {
      if (notifications) {
        if (notifications?.additionalData?.status === 'created') {
          setSelectedStep('pending');
          setSelectedItemIndex(0);
          getShipmentHistories('pending');
        } else if (
          notifications?.additionalData?.status === 'accepted' ||
          notifications?.additionalData?.status === 'assigned' ||
          notifications?.additionalData?.status === 'started'
        ) {
          setSelectedStep('ongoing');
          setSelectedItemIndex(1);
          getShipmentHistories('ongoing');
        } else if (
          notifications?.additionalData?.status === 'cancelled_by_user' ||
          notifications?.additionalData?.status === 'calcelled_by_company'
        ) {
          setSelectedStep('cancel');
          setSelectedItemIndex(2);
          getShipmentHistories('cancel');
        } else if (notifications?.additionalData?.status === 'delivered') {
          setSelectedStep('completed');
          setSelectedItemIndex(3);
          getShipmentHistories('completed');
        }
      }
    };
    getAsyncValue();
  }, [params || selectedStep]);

  useEffect(() => {
    if (focus) {
      getShipmentHistories(selectedStep);
    }
  }, [focus]);

  const getShipmentHistories = async (val: any) => {
    try {
      const parameters = {
        perPage: 5,
        pageNo: 1,
        reqStatus: val,
      };

      const response: any = await dispatch(getShipments(parameters));
      if (response?.payload?.success) {
        setShipmentData(response?.payload?.data);
      } else {
        setShipmentData([]);
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  const cancelRequest = async (reqId: string) => {
    try {
      const response: any = await dispatch(cancelCurrentRequest(reqId));
      if (response?.payload?.success) {
        getShipmentHistories(selectedStep);
      } else {
        Alert.alert('Please try again');
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  const startItemBlinking = () => {
    blinkingItemAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(itemOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(itemOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    blinkingItemAnimation.current.start();

    // Stop blinking after 3 seconds
    setTimeout(() => {
      stopItemBlinking();
    }, 3000);
  };

  const stopItemBlinking = () => {
    if (blinkingItemAnimation.current) {
      blinkingItemAnimation.current.stop();
      dispatch(notificationData(null));
    }
    itemOpacity.setValue(1);
  };

  const getItemsToShow = () => {
    switch (selectedStep) {
      case 'pending':
        return shipmentData.length !== 0 ? (
          <View>
            {shipmentData.map((item: shipmentHistoryTYPES, index) => {
              // console.log('pending item: ', item);
              if (notifications?.additionalData?.requestId === item._id) {
                startItemBlinking();
              }
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.cardContainer,
                    item._id === notifications?.additionalData?.requestId && {
                      opacity: itemOpacity,
                    },
                  ]}>
                  <View style={styles.blueContainer}>
                    <View style={styles.truckingVerticalLineView}>
                      <Image
                        source={require('../../../theme/assets/images/pendingTruckIcon.png')}
                        resizeMode="contain"
                        style={styles.truckingVerticalLineImg}
                      />
                    </View>
                    <View style={styles.twoRowItemsContainer}>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.pickupLocationName}
                          numOfLines={1}
                        />
                      </View>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.dropoffLocationName}
                          style={{
                            alignSelf: 'flex-end',
                          }}
                          numOfLines={1}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.twoRowItemsContainer2}>
                    <View
                      style={[
                        styles.truckDetailsContainer,
                        {alignItems: 'flex-start'},
                      ]}>
                      <SmallText
                        text={`Company: ${
                          item?.acceptedBy
                            ? item?.acceptedBy?.firstname +
                              ' ' +
                              item?.acceptedBy?.lastname
                            : 'Trucking Company'
                        }`}
                        style={styles.bluetxt}
                      />
                    </View>

                    <View style={styles.verticleLine}></View>
                    <View style={styles.truckDetailsContainer}>
                      <SmallText
                        // text={`${item?.truckId?.title} • ${item?.acceptedBid?.price}`}
                        text={`${item?.truckId?.title} ● $80/hr`}
                        style={[
                          styles.bluetxt,
                          {
                            alignSelf: 'flex-end',
                          },
                        ]}
                        numOfLines={2}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.twoRowItemsContainer,
                      {alignItems: 'center'},
                    ]}>
                    <View style={styles.columnItems}>
                      <MediumText text={'PICKUP'} style={styles.greytxt} />
                      <MediumText
                        text={moment(item.startDate).format('MMMM Do')}
                        style={styles.blacktxt}
                      />
                      <SmallText text={item.startTime} style={styles.greytxt} />
                    </View>
                    <View style={styles.cancelBidContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          cancelRequest(item?._id);
                        }}>
                        <MediumText text={'Cancel'} style={styles.cancelTxt} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AcceptLoadBid', {
                            reqId: item?._id,
                          });
                        }}>
                        <MediumText
                          text={'View Bids'}
                          style={styles.biddingTxt}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          <View>
            <MediumText
              text={'No history found'}
              style={[styles.blacktxt, {alignSelf: 'center'}]}
            />
          </View>
        );
      case 'ongoing':
        return shipmentData.length !== 0 ? (
          <View>
            {shipmentData.map((item: shipmentHistoryTYPES, index) => {
              // console.log('ongoing item: ', item);
              if (notifications?.additionalData?.requestId === item._id) {
                startItemBlinking();
              }
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.cardContainer,
                    item._id === notifications?.additionalData?.requestId && {
                      opacity: itemOpacity,
                    },
                  ]}>
                  <View style={styles.blueContainer}>
                    <View style={styles.truckingVerticalLineView}>
                      <Image
                        source={require('../../../theme/assets/images/ongoingTruckIcon.png')}
                        resizeMode="contain"
                        style={styles.truckingVerticalLineImg}
                      />
                    </View>
                    <View style={styles.twoRowItemsContainer}>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.pickupLocationName}
                          numOfLines={1}
                        />
                      </View>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.dropoffLocationName}
                          style={{
                            alignSelf: 'flex-end',
                          }}
                          numOfLines={1}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.twoRowItemsContainer2}>
                    <View
                      style={[
                        styles.truckDetailsContainer,
                        {alignItems: 'flex-start'},
                      ]}>
                      <SmallText
                        text={`Company: ${item?.acceptedBy?.firstname} ${item?.acceptedBy?.lastname}`}
                        style={styles.bluetxt}
                      />
                    </View>

                    <View style={styles.verticleLine}></View>
                    <View style={styles.truckDetailsContainer}>
                      <SmallText
                        // text={`${item?.truckId?.title} • ${item?.acceptedBid?.price}`}
                        text={`${item?.truckId?.title} ● $80/hr`}
                        style={[
                          styles.bluetxt,
                          {
                            alignSelf: 'flex-end',
                          },
                        ]}
                        numOfLines={2}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.twoRowItemsContainer,
                      {alignItems: 'center'},
                    ]}>
                    <View style={styles.columnItems}>
                      <MediumText text={'PICKUP'} style={styles.greytxt} />
                      <MediumText
                        text={moment(item.startDate).format('MMMM Do')}
                        style={styles.blacktxt}
                      />
                      <SmallText text={item.startTime} style={styles.greytxt} />
                    </View>
                    <View style={styles.cancelBidContainer}>
                      {(item?.status === 'created' ||
                        item?.status === 'accepted' ||
                        item?.status === 'assigned') && (
                        <TouchableOpacity
                          onPress={() => {
                            cancelRequest(item?._id);
                          }}>
                          <MediumText
                            text={'Cancel'}
                            style={styles.cancelTxt}
                          />
                        </TouchableOpacity>
                      )}

                      {item?.status === 'accepted' ? (
                        <>
                          <MediumText
                            text={'No driver assigned!'}
                            style={[
                              styles.biddingTxt,
                              {
                                backgroundColor: Colors.whiteColor,
                                color: Colors.redColor,
                              },
                            ]}
                          />
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('RealTimeTracking', {
                              trackingData: item,
                            });
                          }}>
                          <MediumText
                            text={'Track Shipment'}
                            style={styles.biddingTxt}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          <View>
            <MediumText
              text={'No history found'}
              style={[styles.blacktxt, {alignSelf: 'center'}]}
            />
          </View>
        );
      case 'completed':
        return shipmentData.length! > 0 ? (
          <View>
            {shipmentData.map((item: any, index) => {
              // console.log('completed item: ', index, item);
              if (notifications?.additionalData?.requestId === item._id) {
                startItemBlinking();
              }
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.cardContainer,
                    item._id === notifications?.additionalData?.requestId && {
                      opacity: itemOpacity,
                    },
                  ]}>
                  <View style={styles.blueContainer}>
                    <View style={styles.truckingVerticalLineView}>
                      <Image
                        source={require('../../../theme/assets/images/truckOnHorizontalLine.png')}
                        resizeMode="contain"
                        style={styles.truckingVerticalLineImg}
                      />
                    </View>
                    <View style={styles.twoRowItemsContainer}>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.pickupLocationName}
                          numOfLines={1}
                        />
                      </View>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.dropoffLocationName}
                          style={{
                            alignSelf: 'flex-end',
                          }}
                          numOfLines={1}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.twoRowItemsContainer}>
                    <View style={styles.columnItems}>
                      <MediumText text={'PICKUP'} style={styles.greytxt} />
                      <MediumText
                        text={moment(item.startDate).format('MMMM Do')}
                        style={styles.blacktxt}
                      />
                      <SmallText text={item.startTime} style={styles.greytxt} />
                    </View>
                    <View style={styles.columnItems}>
                      <MediumText
                        text={'DELIVERY'}
                        style={[
                          styles.greytxt,
                          {
                            alignSelf: 'flex-end',
                          },
                        ]}
                      />
                      <MediumText
                        text={moment(item.endDate).format('MMMM Do')}
                        style={[
                          styles.blacktxt,
                          {
                            alignSelf: 'flex-end',
                          },
                        ]}
                      />
                      <SmallText
                        text={item.endTime}
                        style={[
                          styles.greytxt,
                          {
                            alignSelf: 'flex-end',
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.twoRowItemsContainer2}>
                    <View
                      style={[
                        styles.truckDetailsContainer,
                        {alignItems: 'flex-start'},
                      ]}>
                      <SmallText
                        text={`Company: ${item?.acceptedBy?.firstname} ${item?.acceptedBy?.lastname}`}
                        style={styles.bluetxt}
                      />
                    </View>

                    <View style={styles.verticleLine}></View>
                    <View style={styles.truckDetailsContainer}>
                      <SmallText
                        text={`${item?.truckId?.title} ● ${item?.acceptedBid?.price}`}
                        style={[
                          styles.bluetxt,
                          {
                            alignSelf: 'flex-end',
                          },
                        ]}
                        numOfLines={2}
                      />
                    </View>
                  </View>
                  {item?.paymentStatus !== 'success' && (
                    <TouchableOpacity
                      style={{marginRight: 10}}
                      onPress={() => {
                        navigation.navigate('PaymentMethod', {
                          id: item?._id,
                        });
                      }}>
                      <MediumText
                        text={'Make Payent'}
                        style={styles.biddingTxt}
                      />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              );
            })}
          </View>
        ) : (
          <View>
            <MediumText
              text={'No history found'}
              style={[styles.blacktxt, {alignSelf: 'center'}]}
            />
          </View>
        );
      case 'cancel':
        return shipmentData.length !== 0 ? (
          <View>
            {shipmentData.map((item: shipmentHistoryTYPES, index) => {
              // console.log('cancel item: ', item);
              if (notifications?.additionalData?.requestId === item._id) {
                startItemBlinking();
              }
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.cardContainer,
                    item._id === notifications?.additionalData?.requestId && {
                      opacity: itemOpacity,
                    },
                  ]}>
                  <View style={styles.blueContainer}>
                    <View style={styles.truckingVerticalLineView}>
                      <Image
                        source={require('../../../theme/assets/images/pendingTruckIcon.png')}
                        resizeMode="contain"
                        style={styles.truckingVerticalLineImg}
                      />
                    </View>
                    <View style={styles.twoRowItemsContainer}>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.pickupLocationName}
                          numOfLines={1}
                        />
                      </View>
                      <View style={styles.columnItems}>
                        <MediumText
                          text={item.dropoffLocationName}
                          style={{
                            alignSelf: 'flex-end',
                          }}
                          numOfLines={1}
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.twoRowItemsContainer,
                      {alignItems: 'center'},
                    ]}>
                    <View style={styles.columnItems}>
                      <MediumText text={'PICKUP'} style={styles.greytxt} />
                      <MediumText
                        text={moment(item.startDate).format('MMMM Do')}
                        style={styles.blacktxt}
                      />
                      <SmallText text={item.startTime} style={styles.greytxt} />
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          <View>
            <MediumText
              text={'No history found'}
              style={[styles.blacktxt, {alignSelf: 'center'}]}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <CustomBackArrow
        showArrow={true}
        showTitle={true}
        // showDots={true}
        isGap={true}
        onPressArrow={() => {
          navigation.navigate('Home');
        }}
        titleTxt="Shipment History"
        inverted={false}
        containerStyle={styles.topContainer}
      />
      <View style={styles.rowContainer}>
        {APPJSONFILES.shipmentSteps.map((item, index) => {
          return (
            <View key={index} style={styles.tabOpacity}>
              <Pressable
                style={styles.pressableTitles}
                onPress={() => {
                  setSelectedStep(item.id);
                  setSelectedItemIndex(index);
                  setShipmentData([]);
                  getShipmentHistories(item.id);
                }}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        selectedItemIndex === index
                          ? Colors.lightPrimaryColor
                          : Colors.silverColor,
                    },
                  ]}>
                  <SvgXml xml={item.icon} />
                </View>
                <SmallText
                  text={item.name}
                  style={{color: Colors.blackColor}}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
      <View style={styles.horizontalLine} />
      <ScrollView contentContainerStyle={{paddingHorizontal: 5}}>
        {getItemsToShow()}
      </ScrollView>
    </View>
  );
};

export default UserBillingHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressableTitles: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    padding: getResponsiveSize(1).height,
    paddingVertical: getResponsiveSize(2).height,
    backgroundColor: Colors.primaryColor,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  titleTxt: {
    color: Colors.whiteColor,
  },
  dotStyle: {
    fontSize: responsiveFontSize(20),
    color: Colors.whiteColor,
  },
  IconStyle: {
    color: Colors.whiteColor,
  },
  cardContainer: {
    marginVertical: getResponsiveSize(1).height,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: responsiveFontSize(10),
    backgroundColor: Colors.whiteColor,
    borderRadius: responsiveFontSize(5),
    gap: responsiveFontSize(15),
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  blueContainer: {
    backgroundColor: Colors.primaryColor,
    width: '100%',
    alignSelf: 'center',
    gap: responsiveFontSize(5),
    paddingVertical: responsiveFontSize(10),
    borderTopRightRadius: responsiveFontSize(5),
    borderTopLeftRadius: responsiveFontSize(5),
  },
  truckingVerticalLineView: {
    width: getResponsiveSize(90).width,
    height: getResponsiveSize(5).height,
    alignSelf: 'center',
  },
  truckingVerticalLineImg: {
    width: '100%',
    height: '100%',
  },
  twoRowItemsContainer: {
    width: '95%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  twoRowItemsContainer2: {
    width: '95%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  columnItems: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '50%',
  },
  greytxt: {
    alignSelf: 'flex-start',
    color: Colors.lightGreyColor,
  },
  blacktxt: {
    alignSelf: 'flex-start',
    color: Colors.blackColor,
  },
  bluetxt: {
    alignSelf: 'flex-start',
    color: Colors.lightPrimaryColor,
  },
  verticleLine: {
    height: 22,
    width: 1,
    backgroundColor: '#5B5B5B',
  },
  truckDetailsContainer: {
    alignItems: 'flex-end',
    width: '45%',
  },
  tabOpacity: {
    marginTop: responsiveFontSize(5),
    width: '25%',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: responsiveFontSize(2),
  },
  iconContainer: {
    padding: responsiveFontSize(10),
    borderRadius: responsiveFontSize(5),
  },
  horizontalLine: {
    borderBottomColor: Colors.lightGreyColor,
    borderBottomWidth: 0.7,
    width: '95%',
    alignSelf: 'center',
    margin: getResponsiveSize(1).height,
  },
  biddingTxt: {
    backgroundColor: Colors.primaryColor,
    padding: responsiveFontSize(8),
    borderRadius: responsiveFontSize(5),
    fontFamily: FONTS.MONTSERRAT_Regular,
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  cancelBidContainer: {
    gap: 5,
  },
  cancelTxt: {
    backgroundColor: Colors.redColor,
    padding: responsiveFontSize(5),
    borderRadius: responsiveFontSize(4),
    fontFamily: FONTS.MONTSERRAT_Regular,
    alignSelf: 'flex-end',
    textAlign: 'center',
  },
});
