import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {SvgXml} from 'react-native-svg';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import CustomBackArrow from '../../../components/customerTopBar';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import Octicons from 'react-native-vector-icons/Octicons';
import {IMAGES, SVG} from '../../../theme/assets';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {DARK_MAP_STYLE, Maps_API_KEY} from '../../../../env';
import MapViewDirections from 'react-native-maps-directions';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  createPrivateChat,
  getAllOneToOneChats,
} from '../../../redux/slice/dataSlice';
import {ShowMessage} from '../../../utils/ShowMessage';
const RealTimeTracking = () => {
  const navigation: any = useNavigation();
  const myRoutes: any = useRoute();
  const mapRef: any = useRef();
  const dispatch = useDispatch();
  const reduxData = useSelector((state: any) => state?.data?.loginData);
  let userData;
  if (typeof reduxData == 'string') {
    userData = JSON.parse(reduxData);
  } else {
    userData = reduxData;
  }

  let {width, height} = Dimensions.get('window');
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.003372395186460153,
    longitudeDelta: 0.0019201263785362244,
  });
  const [permissionAllowed, setPermissionAllowed] = useState(false);

  useEffect(() => {
    resqusetLocations();
  }, []);
  const resqusetLocations = () => {
    request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            getLocations();
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log('error getting location permissiosn', error);
      });
  };
  const getLocations = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const crd = position.coords;
          setPosition({
            latitude: crd.latitude,
            longitude: crd.longitude,
            latitudeDelta: 0.0016185867283340372,
            longitudeDelta: 0.0009847059845924377,
          });
          setPermissionAllowed(true);
        },
        error => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      console.log('error arrive');
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

  //Creating private chat
  const handlePressedChat = async () => {
    try {
      const values = {
        userId: userData?.user?._id,
        receiverId: myRoutes?.params?.trackingData?.acceptedBy?._id,
      };
      const response: any = await dispatch(createPrivateChat(values));
      if (response?.payload?.success) {
        navigation.navigate('UserChats', {
          screen: 'OpenChatsScreen',
          initial: false,
          params: {
            prevChatData: response?.payload,
            prevPageRefer: 'new',
            receiverDetail: myRoutes?.params?.trackingData?.acceptedBy,
          },
        });
      } else {
        if (response?.payload?.message === 'Already exists') {
          getOneToOnePrevChats(response?.meta?.arg);
          return;
        }
        if (response?.payload?.message) {
          ShowMessage('error', response?.payload?.message || '');
        } else {
          ShowMessage('error', 'Please Try Again');
        }
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  //Fetching Previous chat
  const getOneToOnePrevChats = async (item: any) => {
    try {
      const values = {
        userId: item?.userId,
        receiverId: item?.receiverId,
      };
      const response: any = await dispatch(getAllOneToOneChats(values));
      if (response?.payload) {
        console.log(
          'getOneToOnePrevChats response?.payload: ',
          response?.payload,
        );
        navigation.navigate('UserChats', {
          screen: 'OpenChatsScreen',
          initial: false,
          params: {
            prevChatData: response?.payload,
            prevPageRefer: 'old',
          },
        });
      } else {
        ShowMessage('error', 'Please Try Again');
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  console.log(
    'myRoutes?.params?.trackingData : ',
    myRoutes?.params?.trackingData,
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.intialArrowView}>
          <CustomBackArrow
            showArrow={true}
            onPressArrow={() => {
              navigation.goBack();
            }}
            onPressDots={() => {
              console.log('pressed');
            }}
            inverted={true}
            // showDots={true}
            containerStyle={styles.headerContainer}
          />
        </View>
        <LargeText text={'Track your Shipment'} style={styles.trackShipTxt} />
        {permissionAllowed ? (
          <>
            <View style={styles.mapViewTopView}>
              <View style={styles.mapViewContainer}>
                <MapView
                  userInterfaceStyle={'dark'}
                  provider={
                    Platform.OS === 'android'
                      ? PROVIDER_GOOGLE
                      : PROVIDER_DEFAULT
                  }
                  style={styles.mapstyle}
                  paddingAdjustmentBehavior="automatic"
                  zoomTapEnabled
                  ref={mapRef}
                  zoomEnabled={true}
                  customMapStyle={DARK_MAP_STYLE}
                  showsUserLocation={false}
                  showsCompass={true}
                  showsMyLocationButton={false}
                  scrollEnabled={true}
                  rotateEnabled={true}
                  maxZoomLevel={17.5}
                  mapPadding={styles.mapPaddingStyle}
                  loadingEnabled>
                  {myRoutes?.params?.trackingData
                    ?.dropoffLocationCoordinates && (
                    <MapViewDirections
                      origin={
                        myRoutes?.params?.trackingData
                          ?.pickupLocationCooridinates
                      }
                      destination={
                        myRoutes?.params?.trackingData
                          ?.dropoffLocationCoordinates
                      }
                      apikey={Maps_API_KEY}
                      strokeWidth={1.5}
                      optimizeWaypoints={true}
                      strokeColor={Colors.whiteColor}
                      onReady={result => {
                        mapRef.current.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            right: width / 20,
                            bottom: height / 20,
                            left: width / 20,
                            top: height / 20,
                          },
                        });
                      }}
                    />
                  )}
                  {myRoutes?.params && (
                    <Marker
                      coordinate={
                        myRoutes?.params?.trackingData
                          ?.pickupLocationCooridinates
                      }
                      title={myRoutes?.params?.trackingData?.pickupLocationName}
                      tracksViewChanges={false}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        style={styles.markerStyle}
                      />
                    </Marker>
                  )}
                  {myRoutes?.params && (
                    <Marker
                      coordinate={
                        myRoutes?.params?.trackingData
                          ?.dropoffLocationCoordinates
                      }
                      title={
                        myRoutes?.params?.trackingData?.dropoffLocationName
                      }
                      tracksViewChanges={false}>
                      <Octicons
                        name="dot-fill"
                        style={[
                          styles.markerStyle,
                          {
                            paddingHorizontal: responsiveFontSize(10),
                          },
                        ]}
                      />
                    </Marker>
                  )}
                </MapView>
              </View>
            </View>
            <View style={styles.botomContainer}>
              <View style={styles.personalDetailsView}>
                <View>
                  <MediumText
                    text={
                      myRoutes?.params?.trackingData?.driverAssigned
                        ?.firstname +
                      ' ' +
                      myRoutes?.params?.trackingData?.driverAssigned?.lastname
                    }
                    style={{
                      color: Colors.blueColor,
                      textTransform: 'capitalize',
                    }}
                  />
                  <View style={styles.nameAndStarContainer}>
                    <SvgXml xml={SVG.icons.starIcon} />
                    <SmallText
                      text={'4.2/5.0'}
                      style={{color: Colors.greyColor}}
                    />
                  </View>
                </View>
                <View style={styles.msgAndCallView}>
                  <TouchableOpacity
                    onPress={handlePressedChat}
                    style={styles.roundIconOpacity}>
                    <Ionicons name="chatbox" style={styles.roundIconStyle} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        `tel: +${myRoutes?.params?.trackingData?.driverAssigned?.phoneno}`,
                      );
                    }}
                    style={styles.roundIconOpacity}>
                    <Feather name="phone" style={styles.roundIconStyle} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.twoRowItemsContainer}>
                <View style={styles.mediumGap}>
                  <MediumText
                    text={'Distance Remaining'}
                    style={styles.distanceNTimeTxt}
                  />
                  <View style={styles.nameAndStarContainer}>
                    <View style={styles.smallRoundOpacity}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        style={styles.smallRoundIcon}
                      />
                    </View>
                    <MediumText
                      text={
                        myRoutes?.params?.trackingData?.estimatedDistance
                          ?.$numberDecimal + ' mi'
                      }
                      style={styles.whiteColorTxt}
                    />
                  </View>
                </View>
                <View style={styles.mediumGap}>
                  <MediumText
                    text={'Time Remaining'}
                    style={styles.distanceNTimeTxt}
                  />
                  <View style={styles.nameAndStarContainer}>
                    <View style={styles.smallRoundOpacity}>
                      <Feather name="clock" style={styles.smallRoundIcon} />
                    </View>

                    <MinutesToHoursConverter
                      minutes={myRoutes?.params?.trackingData?.extimatedTime}
                    />
                    {/* <MediumText
                      text={myRoutes?.params?.trackingData?.extimatedTime}
                      style={styles.whiteColorTxt}
                    /> */}
                  </View>
                </View>
              </View>
              <View style={styles.mediumGap}>
                <LargeText text={'Order Details'} />
                <View style={styles.orderDetailsContainer}>
                  <View style={styles.orderDetailsChild}>
                    <Image
                      source={
                        myRoutes?.params?.trackingData?.collectedAt != null
                          ? IMAGES.collectedTrack
                          : IMAGES.acceptedTrack
                      }
                      resizeMode="contain"
                      style={styles.verticalTruckImg}
                    />
                    <View style={styles.gap}>
                      <View style={styles.gap}>
                        <View>
                          <MediumText
                            text={'Order Accepted'}
                            style={styles.whiteColorTxt}
                          />
                          <View
                            style={[
                              styles.nameAndStarContainer,
                              styles.mediumGap,
                            ]}>
                            <Feather
                              name="clock"
                              style={styles.smallRoundIcon}
                            />
                            <SmallText
                              text={
                                moment(
                                  myRoutes?.params?.trackingData?.createdAt,
                                ).format('LT') +
                                ', ' +
                                moment(
                                  myRoutes?.params?.trackingData?.createdAt,
                                ).format('MMMM Do YYYY')
                              }
                              style={{color: Colors.greyColor}}
                            />
                          </View>
                        </View>
                        <View>
                          <MediumText
                            text={'Order Collected'}
                            style={styles.whiteColorTxt}
                          />
                          {myRoutes?.params?.trackingData?.collectedAt && (
                            <View
                              style={[
                                styles.nameAndStarContainer,
                                styles.mediumGap,
                              ]}>
                              <Feather
                                name="clock"
                                style={styles.smallRoundIcon}
                              />
                              <SmallText
                                text={
                                  moment(
                                    myRoutes?.params?.trackingData?.collectedAt,
                                  ).format('LT') +
                                  ', ' +
                                  moment(
                                    myRoutes?.params?.trackingData?.collectedAt,
                                  ).format('MMMM Do YYYY')
                                }
                                style={{color: Colors.greyColor}}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          gap: getResponsiveSize(
                            Platform.OS === 'ios' ? 5.5 : 4.5,
                          ).height,

                          top: -12,
                        }}>
                        <MediumText
                          text={'Delivering'}
                          style={styles.whiteColorTxt}
                        />
                        <MediumText
                          text={'Recieved'}
                          style={styles.whiteColorTxt}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <TouchableOpacity onPress={() => resqusetLocations()}>
            <LargeText text={'Please Allow Location Permissions'} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  intialArrowView: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: getResponsiveSize(3).height,
    alignItems: 'center',
  },
  topInnerContainer: {
    width: '95%',
    alignSelf: 'center',
    gap: getResponsiveSize(1).height,
    marginTop: getResponsiveSize(2.5).height,
  },
  twoRowItemsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: responsiveFontSize(5),
  },
  distanceNTimeTxt: {
    color: Colors.whiteColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  orderDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  orderDetailsChild: {
    width: '100%',
    height: getResponsiveSize(32).height,
    flexDirection: 'row',
    gap: responsiveFontSize(5),
  },
  gap: {
    gap: getResponsiveSize(Platform.OS == 'ios' ? 7 : 6).height,
  },
  mediumGap: {
    gap: responsiveFontSize(5),
  },
  verticalTruckImg: {
    width: '7%',
    height: '90%',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGreyColor,
    width: '84%',
    borderRadius: responsiveFontSize(6),
    paddingLeft: getResponsiveSize(4).width,
    gap: responsiveFontSize(3),
  },
  whiteColorTxt: {
    color: Colors.whiteColor,
  },
  blackColorsStyle: {
    color: Colors.blackColor,
  },
  headerContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  botomContainer: {
    width: '100%',
    backgroundColor: Colors.primaryColor,
    borderTopRightRadius: responsiveFontSize(20),
    borderTopLeftRadius: responsiveFontSize(20),
    paddingTop: getResponsiveSize(3).height,
    paddingHorizontal: getResponsiveSize(5).width,
    gap: responsiveFontSize(20),
  },
  personalDetailsView: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    padding: responsiveFontSize(10),
    paddingHorizontal: responsiveFontSize(15),
    alignItems: 'center',
    backgroundColor: Colors.blackColor,
    borderRadius: responsiveFontSize(35),
    flexDirection: 'row',
  },
  nameAndStarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: responsiveFontSize(5),
  },
  smallRoundOpacity: {
    padding: responsiveFontSize(4),
    backgroundColor: Colors.inputPlaceHolder,
    borderRadius: responsiveFontSize(30),
  },
  smallRoundIcon: {
    fontSize: responsiveFontSize(13),
    color: Colors.whiteColor,
  },
  msgAndCallView: {
    alignItems: 'center',
    gap: responsiveFontSize(5),
    flexDirection: 'row',
  },
  roundIconOpacity: {
    borderRadius: responsiveFontSize(30),
    padding: responsiveFontSize(12),
    justifyContent: 'center',
    backgroundColor: Colors.lightPrimaryColor,
    alignItems: 'center',
  },
  roundIconStyle: {
    fontSize: responsiveFontSize(20),
    color: Colors.whiteColor,
  },
  mapstyle: {
    width: '100%',
    alignSelf: 'center',
    height: getResponsiveSize(35).height,
  },
  trackShipTxt: {
    fontSize: responsiveFontSize(20),
    color: Colors.blackColor,
    width: '90%',
    alignSelf: 'center',
  },
  inputStyle: {
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.whiteColor,
    width: '90%',
  },
  qrIconOpacity: {
    borderRadius: responsiveFontSize(6),
    borderColor: Colors.lightPrimaryColor,
    padding: responsiveFontSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  mapViewTopView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapViewContainer: {
    borderRadius: responsiveFontSize(5),
    width: getResponsiveSize(95).width,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  mapPaddingStyle: {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  markerStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.whiteColor,
    fontSize: responsiveFontSize(20),
    backgroundColor: Colors.transparentWhiteColor,
    padding: 5,
    borderRadius: responsiveFontSize(25),
  },
  qrIcon: {
    fontSize: responsiveFontSize(24),
    color: Colors.lightPrimaryColor,
    alignSelf: 'center',
  },
  searchIcon: {
    fontSize: responsiveFontSize(15),
    color: Colors.whiteColor,
  },
  continueButton: {
    width: '95%',
    bottom: 10,
    marginVertical: getResponsiveSize(2).height,
    backgroundColor: Colors.whiteColor,
  },
});

export default RealTimeTracking;
