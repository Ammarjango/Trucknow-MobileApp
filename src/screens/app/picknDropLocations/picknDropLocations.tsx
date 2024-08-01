import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import Header from '../../../components/header';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {SVG} from '../../../theme/assets';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {LocationSelectionMODAL} from '../../../components/MODAL';
import {APPJSONFILES} from '../../../jsonFiles/JsonFiles';
import {Dropdown} from 'react-native-element-dropdown';
import {checkLocationCountry} from '../../../redux/slice/dataSlice';
import {Maps_API_KEY} from '../../../../env';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ShowMessage} from '../../../utils/ShowMessage';

const PicknDropLocations = ({route}: any) => {
  const navigation: any = useNavigation();
  const myParams = route?.params;

  const [currentInputCoords, setCurrentInputCoords] = useState('');

  const [pickupLocationName, setPickupLocationName] = useState(
    'Enter pickup location name(US)',
  );
  const [pickModalVisible, setPickModalVisible] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<any>({
    latitude: '',
    longitude: '',
  });

  const [dropLocationName, setDropLocationName] = useState(
    'Enter delivery location name(US)',
  );
  const [dropModalVisible, setDropModalVisible] = useState(false);
  const [dropCoords, setDropCoords] = useState<any>({
    latitude: '',
    longitude: '',
  });

  const [hazardousMaterialType, setHazardousMaterialType] = useState('');

  const [specialInstructions, setSpecialInstructions] = useState('');

  //rendering a function that gives location name, when you pass the latitude and longitude in TextInput
  useEffect(() => {
    const getData = setTimeout(async () => {
      getLocationNameByNumbers();
    }, 500);
    return () => clearTimeout(getData);
  }, [pickupCoords, dropCoords]);

  //selection of pickup location, when you search for cities in TextInput
  const selectedPickupLocation = (data: any, details: any) => {
    setPickModalVisible(false);
    if (details?.geometry?.location?.lat) {
      setPickupCoords({
        latitude: details?.geometry?.location?.lat,
        longitude: details?.geometry?.location?.lng,
      });
    }
    setPickupLocationName(details?.formatted_address);
  };

  //selection of delivery location, when you search for cities in TextInput
  const selectedDropLocation = (data: any, details: any) => {
    setDropModalVisible(false);
    if (details?.geometry?.location?.lat) {
      setDropCoords({
        latitude: details?.geometry?.location?.lat,
        longitude: details?.geometry?.location?.lng,
      });
    }
    setDropLocationName(details?.formatted_address);
  };

  //getting your current location when you press on "Use Current Location"
  const getCurrentLocationAndName = async (loc: string) => {
    Geolocation.getCurrentPosition((pos: any) => {
      const crd = pos.coords;
      Geocoder.init(Maps_API_KEY);
      Geocoder.from(crd.latitude, crd.longitude)
        .then(async (json: any) => {
          if (loc === 'pickup') {
            const myCountry = await checkLocationCountry(
              crd.latitude,
              crd.longitude,
            );

            //checking if entered coordinates are in US
            if (myCountry === 'United States') {
              setPickupLocationName(json.results[0].formatted_address);
              setPickupCoords({
                latitude: crd.latitude,
                longitude: crd.longitude,
                latitudeDelta: crd.latitudeDelta,
                longitudeDelta: crd.longitudeDelta,
              });
            } else {
              Alert.alert('your current location must be United States');
            }
          } else if (loc === 'drop') {
            const myCountry = await checkLocationCountry(
              crd.latitude,
              crd.longitude,
            );

            //checking if entered coordinates are in US
            if (myCountry === 'United States') {
              setDropLocationName(json.results[0].formatted_address);
              setDropCoords({
                latitude: crd.latitude,
                longitude: crd.longitude,
                latitudeDelta: crd.latitudeDelta,
                longitudeDelta: crd.longitudeDelta,
              });
            } else {
              Alert.alert('your current location must be United States');
            }
          }
        })
        .catch(error => {
          ShowMessage('error', error?.message || '');
          // ToastAndroid.show(error.message, ToastAndroid.SHORT)
        });
    });
  };

  //get location names, when you pass the latitude and longitude in TextInput
  const getLocationNameByNumbers = () => {
    if (currentInputCoords === 'pickup') {
      Geocoder.from(pickupCoords.latitude, pickupCoords.longitude)
        .then(async response => {
          const country = response.results[0].address_components.find(
            (component: any) => component.types.includes('country'),
          );

          //checking if entered coordinates are in US
          if (country?.long_name === 'United States') {
            const address = response.results[1].formatted_address;
            setPickupLocationName(address);
          } else {
            setPickupLocationName('Enter pickup location name(US)');
          }
        })
        .catch(error => {
          setPickupLocationName('Enter pickup location name(US)');
          console.log(error);
        });
    } else if (currentInputCoords === 'drop') {
      Geocoder.from(dropCoords.latitude, dropCoords.longitude)
        .then(response => {
          const country = response.results[0].address_components.find(
            (component: any) => component.types.includes('country'),
          );
          //checking if entered coordinates are in US
          if (country?.long_name === 'United States') {
            const address = response.results[1].formatted_address;
            setDropLocationName(address);
          } else {
            setDropLocationName('Enter delivery location name(US)');
          }
        })
        .catch(error => {
          setDropLocationName('Enter delivery location name(US)');
          console.log(error);
        });
    }
  };

  //selection of delivery location, when you search for cities in TextInput
  const handleSubmition = async () => {
    if (pickupLocationName === 'Enter pickup location name(US)') {
      ShowMessage('error', 'Please Select Pickup Location');
    } else if (dropLocationName === 'Enter delivery location name(US)') {
      ShowMessage('error', 'Please Select Delivery Location');
    } else if (hazardousMaterialType === '') {
      ShowMessage('error', 'Please Select Hazardous Material Type');
    } else {
      try {
        const reqValues = {
          pickupLocationName: pickupLocationName,
          pickupLocationCoordinates: pickupCoords,
          dropoffLocationName: dropLocationName,
          dropoffLocationCoordinates: dropCoords,
          material: hazardousMaterialType,
          instructions: specialInstructions,
          weight: myParams.data?.weight,
          quantity: myParams.data?.quantity,
          truckId: myParams.data?.selectedTruckData,
          startDate: myParams.data?.myDate,
          startTime: myParams.data?.myTime,
        };
        navigation.navigate('ContractAcceptance', {
          trucksData: reqValues,
        });
      } catch (error) {
        console.log('Async thunk failed:', error);
      }
    }
  };

  const renderModal = () => {
    return (
      <>
        <LocationSelectionMODAL
          isVisible={pickModalVisible}
          locationIcon={require('../../../theme/assets/images/load.png')}
          placeHoldertxt={'Enter pickup location name(US)'}
          buttonTxt={'Use Current Location'}
          onPressListTxt={(data: any, details: any) =>
            selectedPickupLocation(data, details)
          }
          onModalCLose={() => setPickModalVisible(false)}
          onPressButton={() => {
            setPickModalVisible(false);
            getCurrentLocationAndName('pickup');
          }}
        />
        <LocationSelectionMODAL
          isVisible={dropModalVisible}
          locationIconStyle={styles.imageRotation}
          locationIcon={require('../../../theme/assets/images/load.png')}
          placeHoldertxt={'Enter delivery location name(US)'}
          buttonTxt={'Use Current Location'}
          onPressListTxt={(data: any, details: any) =>
            selectedDropLocation(data, details)
          }
          onModalCLose={() => setDropModalVisible(false)}
          onPressButton={() => {
            setDropModalVisible(false);
            getCurrentLocationAndName('drop');
          }}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../theme/assets/images/dashBoardBackground.png')}
        style={styles.backgroungImg}
        resizeMode="cover"
      />
      <Header />

      <View style={styles.horizontalLine} />

      {/* <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        contentContainerStyle={styles.scrollViewContainer}> */}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        contentContainerStyle={styles.scrollViewContainer}>
        <>
          <View style={styles.locDetailsContainer}>
            <LargeText text="Where to drop?" />

            <View style={styles.locationsChildContainer}>
              <View style={styles.locImgsContainer}>
                <SvgXml xml={SVG.icons.mapDirections} />
              </View>
              <View style={styles.locInputContainer}>
                <View>
                  <MediumText
                    text="Pickup Location Name"
                    style={styles.titles}
                  />
                  <Pressable
                    style={[
                      styles.inputLocations,
                      {paddingHorizontal: responsiveFontSize(12)},
                    ]}
                    onPress={() => {
                      setPickModalVisible(true);
                    }}>
                    <MediumText
                      text={pickupLocationName}
                      style={styles.pickDropTxt}
                      numOfLines={2}
                    />
                  </Pressable>
                </View>

                <View style={{marginTop: getResponsiveSize(3).height}}>
                  <MediumText text="Pickup Location" style={styles.titles} />
                  <View style={styles.locCoordsOpacity}>
                    <TextInput
                      placeholder={'Lat: '}
                      placeholderTextColor={Colors.darkGreyColor}
                      value={`${pickupCoords?.latitude}`}
                      style={styles.locCoordsTxt}
                      keyboardType="decimal-pad"
                      onChangeText={txt => {
                        setCurrentInputCoords('pickup');
                        setPickupCoords((prevData: any) => ({
                          ...prevData,
                          latitude: txt,
                        }));
                      }}
                    />
                    <TextInput
                      placeholder={'Lon: '}
                      placeholderTextColor={Colors.darkGreyColor}
                      style={styles.locCoordsTxt}
                      keyboardType="decimal-pad"
                      value={`${pickupCoords?.longitude}`}
                      onChangeText={txt => {
                        setCurrentInputCoords('pickup');
                        setPickupCoords((prevData: any) => ({
                          ...prevData,
                          longitude: txt,
                        }));
                      }}
                    />
                  </View>
                </View>

                <View style={{marginTop: getResponsiveSize(3).height}}>
                  <MediumText
                    text="Enter delivery location name"
                    style={styles.titles}
                  />
                  <Pressable
                    style={[
                      styles.inputLocations,
                      {paddingHorizontal: responsiveFontSize(12)},
                    ]}
                    onPress={() => {
                      setDropModalVisible(true);
                    }}>
                    <MediumText
                      text={dropLocationName}
                      style={styles.pickDropTxt}
                      numOfLines={2}
                    />
                  </Pressable>
                </View>

                <View style={{marginTop: getResponsiveSize(3).height}}>
                  <MediumText text="Delivery Location" style={styles.titles} />
                  <View style={styles.locCoordsOpacity}>
                    <>
                      <TextInput
                        placeholder="Lat: "
                        placeholderTextColor={Colors.darkGreyColor}
                        style={styles.locCoordsTxt}
                        value={`${dropCoords?.latitude}`}
                        keyboardType="decimal-pad"
                        onChangeText={txt => {
                          setCurrentInputCoords('drop');
                          setDropCoords((prevData: any) => ({
                            ...prevData,
                            latitude: txt,
                          }));
                        }}
                      />
                    </>
                    <>
                      <TextInput
                        placeholder="Lon: "
                        placeholderTextColor={Colors.darkGreyColor}
                        style={styles.locCoordsTxt}
                        keyboardType="decimal-pad"
                        value={`${dropCoords?.longitude}`}
                        onChangeText={txt => {
                          setCurrentInputCoords('drop');
                          setDropCoords((prevData: any) => ({
                            ...prevData,
                            longitude: txt,
                          }));
                        }}
                      />
                    </>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.extraDetailsContainer}>
            <MediumText
              text="Hazardous Material"
              style={[styles.titles, {color: Colors.blackColor}]}
            />
            <Dropdown
              style={styles.dropDownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              containerStyle={styles.dropDownChildContainer}
              itemTextStyle={styles.blackColorStyle}
              data={APPJSONFILES.hazardousMaterialTypes}
              maxHeight={200}
              onFocus={() => {
                // alert('a');
              }}
              onChange={item => {
                setHazardousMaterialType(item.label);
              }}
              mode="default"
              autoScroll
              showsVerticalScrollIndicator={false}
              dropdownPosition="bottom"
              renderItem={item => {
                return (
                  <View style={{gap: 2}}>
                    <MediumText
                      style={styles.rederItemsStyle}
                      text={item.label}
                    />
                  </View>
                );
              }}
              renderRightIcon={() => (
                <View>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    style={[styles.plusIconStyle, styles.dropDownRightIcon]}
                  />
                </View>
              )}
              labelField={'label'}
              valueField={'value'}
            />
            <View style={styles.hazardousDescriptionContainer}>
              <Octicons
                name="alert"
                style={[styles.locationIcons, styles.hazardousIcon]}
              />
              <View style={{width: '95%'}}>
                <SmallText
                  text={`Please select 'Yes' if the product is hazardous as it will require special handling and transportation regulations`}
                  style={{color: Colors.darkGreyColor}}
                />
              </View>
            </View>
          </View>

          <View style={styles.extraDetailsContainer}>
            <MediumText
              text="Special Instructions"
              style={[styles.titles, {color: Colors.blackColor}]}
            />
            <TextInput
              placeholder="Type additional details ..."
              style={[
                styles.inputLocations,
                {height: getResponsiveSize(15).height, paddingTop: 10},
              ]}
              textAlignVertical="top"
              multiline
              placeholderTextColor={Colors.darkGreyColor}
              onChangeText={txt => {
                setSpecialInstructions(txt);
              }}
            />
          </View>

          <Button
            title="Submit"
            isInverted={false}
            onPress={handleSubmition}
            containerStyle={styles.continueButton}
          />
        </>
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}

      {renderModal()}
    </SafeAreaView>
  );
};

export default PicknDropLocations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageRotation: {
    transform: [{rotate: `180deg`}, {scaleY: -1}],
  },
  horizontalLine: {
    borderBottomColor: Colors.mediumGrayClor,
    borderBottomWidth: 0.7,
    width: '95%',
    alignSelf: 'center',
    marginBottom: getResponsiveSize(1).height,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backgroungImg: {
    ...StyleSheet.absoluteFillObject,
    width: 'auto',
  },
  locDetailsContainer: {
    backgroundColor: Colors.primaryColor,
    marginTop: getResponsiveSize(2).height,
    width: '100%',
    marginHorizontal: '2.5%',
    alignSelf: 'center',
    borderRadius: getResponsiveSize(3).width,
    padding: getResponsiveSize(3).width,
  },
  locationsChildContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  locImgsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getResponsiveSize(2).height,
  },
  locInputContainer: {
    width: '90%',
    paddingTop: Platform.OS == 'ios' ? 5 : 0,
  },
  inputLocations: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 5,
    width: '100%',
    paddingLeft: getResponsiveSize(2).width,
    paddingVertical: 14,
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.blackColor,
  },
  errorText: {
    color: 'red',
    marginLeft: getResponsiveSize(1.5).width,
  },
  locCoordsOpacity: {
    backgroundColor: Colors.primaryColor,
    borderRadius: getResponsiveSize(1).width,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locCoordsTxt: {
    color: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
    fontSize: responsiveFontSize(15),
    paddingHorizontal: getResponsiveSize(3).width,
    backgroundColor: Colors.whiteColor,
    width: '48%',
    borderRadius: 5,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
  },
  extraDetailsContainer: {
    marginTop: getResponsiveSize(2).height,
    width: '100%',
    alignSelf: 'center',
    marginLeft: 0,
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
  },
  titles: {
    fontSize: responsiveFontSize(16),
    marginVertical: getResponsiveSize(0.5).height,
  },
  locationIcons: {
    fontSize: responsiveFontSize(16),
    color: Colors.whiteColor,
  },
  hazardousDescriptionContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 2,
  },
  hazardousIcon: {
    color: Colors.darkOrangeColor,
    fontSize: responsiveFontSize(12),
    margin: getResponsiveSize(1).width,
  },
  selectOptionsTxt: {
    color: Colors.darkGreyColor,
    marginVertical: getResponsiveSize(2).height,
    fontSize: responsiveFontSize(13),
  },
  continueButton: {
    width: '100%',
    marginVertical: getResponsiveSize(2).height,
  },
  pickDropTxt: {
    color: Colors.darkGreyColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
    paddingLeft: getResponsiveSize(1).width,
  },
  dropDownContainer: {
    width: '100%',
    padding: getResponsiveSize(2).width,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(14),
    color: Colors.darkGreyColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(14),
    color: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Colors.blackColor,
  },
  dropDownChildContainer: {
    backgroundColor: Colors.inputPlaceHolder,
    borderRadius: 5,
    padding: 5,
  },
  blackColorStyle: {
    color: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  rederItemsStyle: {
    color: Colors.blackColor,
    margin: responsiveFontSize(2),
    marginHorizontal: 5,
    borderRadius: responsiveFontSize(2),
    padding: responsiveFontSize(4),
  },
  renderLeftContainer: {
    flexDirection: 'column',
    width: '80%',
    paddingHorizontal: getResponsiveSize(2).width,
  },
  greyColorStyle: {
    color: Colors.darkGreyColor,
  },
  plusIconStyle: {
    fontSize: responsiveFontSize(30),
    color: Colors.blackColor,
  },
  dropDownRightIcon: {
    fontSize: responsiveFontSize(35),
    alignSelf: 'flex-start',
  },
});
