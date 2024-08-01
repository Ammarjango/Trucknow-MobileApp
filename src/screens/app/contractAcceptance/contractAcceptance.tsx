import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {SvgXml} from 'react-native-svg';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import CustomBackArrow from '../../../components/customerTopBar';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {SVG} from '../../../theme/assets';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import MapViewDirections from 'react-native-maps-directions';
import {DARK_MAP_STYLE, Maps_API_KEY} from '../../../../env';
import {useDispatch} from 'react-redux';
import {createRequest} from '../../../redux/slice/dataSlice';
import {ShowMessage} from '../../../utils/ShowMessage';

const ContractAcceptance = () => {
  const windowHeight = Dimensions.get('window').height;
  const routes: any = useRoute();
  const navigation: any = useNavigation();
  const mapRef: any = useRef();
  const dispatch = useDispatch();
  let {width, height} = Dimensions.get('window');
  const [instructions, setInstructions] = useState('');
  console.log('instructions: ', instructions);
  const [permissionAllowed, setPermissionAllowed] = useState(false);
  const [pickupLocationName, setPickupLocationName] = useState('');
  const [ridePrice, setRidePrice] = useState('');
  const [rideDuration, setRideDuration] = useState<any>('');
  const [rideDistance, setRideDistance] = useState('');
  const [isCoordsSelected, setIsCoordsSelected] = useState(false);
  const [weightAndQuantity, setWeightAndQuantity] = useState({
    weight: '',
    quantity: '',
  });
  const [distanceAndPrice, setDistanceAndPrice] = useState({
    distance: '',
    price: '',
  });
  const [rideDate, setRideDate] = useState('');
  const [rideTime, setRideTime] = useState('');
  const [deliveryMaterial, setDeliveryMaterial] = useState('');
  const [truckId, setTruckId] = useState('');
  const [position, setPosition] = useState<any>({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.003372395186460153,
    longitudeDelta: 0.0019201263785362244,
  });
  const [dropLocationName, setDropLocationName] = useState('');
  const [destination, setDestination] = useState<any>({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.003372395186460153,
    longitudeDelta: 0.0019201263785362244,
  });

  //saving all the routed paramters into their states to display them through state
  useEffect(() => {
    if (routes?.params) {
      const truckDetails: any = routes?.params?.trucksData;
      console.log('****truckDetails: ', truckDetails); // in this truckid is not populated that why name is not show i show  hydrovac truck
      setPosition({
        latitude: truckDetails?.pickupLocationCoordinates?.latitude,
        longitude: truckDetails?.pickupLocationCoordinates?.longitude,
        latitudeDelta: 0.003372395186460153,
        longitudeDelta: 0.0019201263785362244,
      });
      setDestination({
        latitude: truckDetails?.dropoffLocationCoordinates?.latitude,
        longitude: truckDetails?.dropoffLocationCoordinates?.longitude,
        latitudeDelta: 0.003372395186460153,
        longitudeDelta: 0.0019201263785362244,
      });
      setPickupLocationName(truckDetails?.pickupLocationName);
      setDropLocationName(truckDetails?.dropoffLocationName);
      setRideDate(truckDetails?.startDate);
      setRideTime(truckDetails?.startTime);
      setInstructions(truckDetails?.instructions);
      setDeliveryMaterial(truckDetails?.material);
      setTruckId(truckDetails?.truckId);
      setWeightAndQuantity({
        weight: truckDetails?.weight,
        quantity: truckDetails?.quantity,
      });
      setIsCoordsSelected(true);
    }
    getLocationPermissions();
  }, []);

  //getting location permissions to display Map
  const getLocationPermissions = () => {
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
            setPermissionAllowed(true);
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

  //hanlding your request creatuion
  const handleSubmition = async () => {
    try {
      //collecting all api parameters at one place, so we can pass them to dataSlice at once
      const reqValues = {
        pickupLocationName: pickupLocationName,
        pickupLocationCoordinates: position,
        dropoffLocationName: dropLocationName,
        dropoffLocationCoordinates: destination,
        material: deliveryMaterial,
        instructions: instructions,
        weight: weightAndQuantity.weight,
        quantity: weightAndQuantity.quantity,
        truckId: truckId,
        startDate: rideDate,
        startTime: rideTime,
        price: ridePrice,
        extimatedTime: rideDuration,
        estimatedDistance: rideDistance,
      };
      const response: any = await dispatch(createRequest({reqValues}));
      console.log('***** handleSubmition : ', response);
      if (response?.payload?.success) {
        navigation.replace('UserBillingHistory');
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
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        {permissionAllowed && (
          <MapView
            userInterfaceStyle={'dark'}
            // provider={PROVIDER_GOOGLE}
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            ref={mapRef}
            style={styles.mapstyle}
            paddingAdjustmentBehavior="automatic"
            zoomTapEnabled
            zoomEnabled={true}
            showsUserLocation={false}
            showsCompass={true}
            showsMyLocationButton={false}
            scrollEnabled={true}
            customMapStyle={DARK_MAP_STYLE}
            rotateEnabled={true}
            maxZoomLevel={17.5}
            mapPadding={styles.mapPaddingStyle}
            loadingEnabled>
            {isCoordsSelected && (
              <MapViewDirections
                origin={position}
                destination={destination}
                apikey={Maps_API_KEY}
                strokeWidth={1.5}
                optimizeWaypoints={true}
                strokeColor={Colors.whiteColor}
                onReady={result => {
                  const hours = Math.floor(result.duration / 60);
                  const minutes = hours % 60;
                  const hourlyRate = 500; // hourly rate set to 500(can be updated)
                  const milesValue = result.distance * 0.621371;
                  const totalPrice = hourlyRate * result.duration;
                  const finalPrice = totalPrice.toFixed(2).toString();
                  const duration = `${hours} hours ${minutes} min.`;
                  const distance = milesValue.toFixed(2).toString();
                  setRidePrice(finalPrice);
                  setRideDuration(result?.duration);
                  setRideDistance(distance);
                  setDistanceAndPrice({
                    distance: milesValue.toFixed(2).toString(),
                    price: totalPrice.toFixed().toString(),
                  });
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
            {isCoordsSelected && (
              <Marker
                coordinate={position}
                title={pickupLocationName}
                tracksViewChanges={false}>
                <MaterialCommunityIcons
                  name="map-marker"
                  style={styles.markerStyle}
                />
              </Marker>
            )}
            {isCoordsSelected && (
              <Marker
                coordinate={destination}
                title={dropLocationName}
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
        )}

        {permissionAllowed && (
          <>
            <View style={styles.arrawnDateView}>
              <CustomBackArrow
                showArrow={true}
                inverted={false}
                onPressArrow={() => {
                  navigation.goBack();
                }}
              />
              <View style={styles.dateContainer}>
                <MediumText
                  text={rideDate}
                  style={{color: Colors.whiteColor}}
                />
                <Octicons name="dot-fill" style={styles.dotStyle} />
                <MediumText
                  text={rideTime}
                  style={{color: Colors.whiteColor}}
                />
              </View>
            </View>
            <View
              style={[styles.descContainer, {maxHeight: windowHeight / 1.5}]}>
              <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                  <LargeText text={'Hydrovac Truck'} style={styles.titleTxt} />
                  <SvgXml xml={SVG.icons.hazardIcon} />
                </View>
                <View style={styles.picknDropContaier}>
                  <SvgXml xml={SVG.icons.fromToLine} />
                  <View style={styles.spaceBwStyle}>
                    <View>
                      <SmallText
                        text={'Pickup'}
                        style={{color: Colors.darkGreyColor}}
                        numOfLines={1}
                      />
                      <SmallText
                        text={pickupLocationName}
                        style={styles.blackNMediumTxt}
                        numOfLines={2}
                      />
                    </View>

                    <View>
                      <SmallText
                        text={'Delivery'}
                        style={{color: Colors.darkGreyColor}}
                      />
                      <SmallText
                        text={dropLocationName}
                        style={styles.blackNMediumTxt}
                        numOfLines={2}
                      />
                    </View>
                  </View>
                </View>
                <LargeText text={'Load Details'} style={styles.blacktxt} />
                <View style={styles.twoRowItemsContainer}>
                  <View style={styles.verticalGap}>
                    <View>
                      <MediumText
                        text={'Date&Time'}
                        style={styles.darkgreyNRegTxt}
                      />
                      <View style={styles.dateNTimeTxtView}>
                        <MediumText text={rideDate} style={styles.blacktxt} />
                        <Octicons name="dot-fill" style={styles.dateNTimeDot} />
                        <MediumText text={rideTime} style={styles.blacktxt} />
                      </View>
                    </View>
                    <View>
                      <MediumText
                        text={'Weight'}
                        style={styles.darkgreyNRegTxt}
                      />
                      <MediumText
                        text={weightAndQuantity.weight + ' tons'}
                        style={styles.blacktxt}
                      />
                    </View>
                  </View>
                  <View style={styles.verticalGap}>
                    <View>
                      <MediumText
                        text={'Distance'}
                        style={styles.darkgreyNRegTxt}
                      />
                      <MediumText
                        text={distanceAndPrice.distance + ' miles'}
                        style={styles.blacktxt}
                      />
                    </View>
                    <View>
                      <MediumText
                        text={'Quantity'}
                        style={styles.darkgreyNRegTxt}
                      />
                      <MediumText
                        text={weightAndQuantity.quantity + ' items'}
                        style={styles.blacktxt}
                      />
                    </View>
                  </View>
                </View>
                {instructions !== '' && (
                  <View style={styles.marginTopStyle}>
                    <LargeText
                      text={'Special Instructions'}
                      style={styles.blacktxt}
                    />
                    <MediumText
                      text={instructions}
                      style={styles.darkgreyNRegTxt}
                    />
                  </View>
                )}
              </ScrollView>
              <Button
                title="Continue"
                isInverted={false}
                onPress={() => {
                  handleSubmition();
                }}
                containerStyle={styles.continueButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
  mapstyle: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
  mapPaddingStyle: {
    top: 0,
    right: 0,
    left: 0,
    bottom: getResponsiveSize(60).height,
  },
  continueButton: {
    width: '95%',
    backgroundColor: Colors.primaryColor,
  },
  arrawnDateView: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '95%',
    paddingTop: getResponsiveSize(1.5).height,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dotStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.whiteColor,
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
  descContainer: {
    shadowColor: Colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: Colors.whiteColor,
    // height: getResponsiveSize(50).height,

    width: '95%',
    padding: getResponsiveSize(5).width,
    alignSelf: 'center',
    flex: 1,
    position: 'absolute',
    bottom: getResponsiveSize(2).height,
    borderRadius: responsiveFontSize(10),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
  },
  titleTxt: {
    color: Colors.blackColor,
    fontSize: responsiveFontSize(30),
  },
  picknDropContaier: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: responsiveFontSize(10),
  },
  spaceBwStyle: {
    justifyContent: 'space-between',
    width: '90%',
  },
  marginTopStyle: {
    marginTop: getResponsiveSize(1).height,
  },
  blackNMediumTxt: {
    color: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
  blacktxt: {
    color: Colors.blackColor,
  },
  darkgreyNRegTxt: {
    color: Colors.darkGreyColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  dateNTimeTxtView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateNTimeDot: {
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.blackColor,
  },
  twoRowItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: getResponsiveSize(1).height,
  },
  verticalGap: {
    gap: responsiveFontSize(5),
  },
});

export default ContractAcceptance;
