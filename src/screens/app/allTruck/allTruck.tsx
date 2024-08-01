import RNDateTimePicker from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import {MediumText, SmallText} from '../../../components/text';
import {APPJSONFILES} from '../../../jsonFiles/JsonFiles';
import {getTrucks, resetData} from '../../../redux/slice/dataSlice';
import {DatenTimeProps} from '../../../types/AppInterfaceTypes';
import {TRootStack} from '../../../types/mainStack';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomerTopBar} from '../../../components/customerTopBar';
import Skeleton from '../../../components/skeleton';
import {COLORS} from '../../../theme/constant';
import {ShowMessage} from '../../../utils/ShowMessage';

type Props = NativeStackScreenProps<TRootStack, 'Home'>;

const AllTruck = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const [displayDatenTime, setdisplayDatenTime] = useState<DatenTimeProps>({
    isDisplay: false,
    selection: '',
  });

  const animatedQuantity = useRef(new Animated.Value(0)).current;
  const animatedWeight = useRef(new Animated.Value(0)).current;

  const animateQuantityStyle = {
    transform: [{translateX: animatedQuantity}],
  };
  const animateWeightStyle = {
    transform: [{translateX: animatedWeight}],
  };

  const [selectedTruck, setSelectedTruck] = useState<number>();
  const [selectedTruckData, setSelectedTruckData] = useState<any>('');
  const [trucksData, setTrucksData] = useState([]);
  const [imageLoad, setImageLoad] = useState<boolean>(true);
  const [myDate, setMyDate] = useState(new Date(Date.now()));
  const [myTime, setMyTime] = useState(new Date(Date.now()));
  const [quantity, setQuantity] = useState('');
  const [isQuantitySelected, setIsQuantitySelected] = useState<boolean>();
  const [weight, setWeight] = useState('');
  const [isWeightSelected, setIsWeightSelected] = useState<boolean>();
  const [loader, setLoader] = useState(true);
  const [displayQuality, setDisplayQuality] = useState(false);
  const [displayWeight, setDisplayWeight] = useState(false);

  useEffect(() => {
    getTrucksData();
  }, []);

  const handleContinue = () => {
    const dashBoardData = {
      myDate: moment(myDate).format('L'),
      myTime: moment(myTime).format('LT'),
      quantity,
      weight,
      selectedTruckData,
    };
    if (selectedTruckData === '') {
      ShowMessage('error', 'Please Select a truck', 120);
    } else if (quantity === '') {
      startMoveQuantity();
      setIsQuantitySelected(true);
    } else if (weight === '') {
      startMoveWeight();
      setIsWeightSelected(true);
    } else {
      navigation.navigate('PicknDropLocations', {
        data: dashBoardData,
      });
    }
  };

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setdisplayDatenTime({
      isDisplay: true,
      selection: '',
    });
    if (displayDatenTime.selection === 'date') {
      setMyDate(currentDate);
      return;
    } else {
      setMyTime(currentDate);
      return;
    }
  };

  const getTrucksData = async () => {
    try {
      const response: any = await dispatch(getTrucks());
      setLoader(false);
      if (response?.payload?.data.length > 0) {
        setTrucksData(response?.payload?.data);
      } else if (response?.payload?.message == 'you failed authenticate') {
        AsyncStorage.clear();
        dispatch(resetData());
        navigation.replace('Login');
      } else if (response?.payload?.message) {
        Alert.alert(response?.payload?.message);
      } else {
        Alert.alert('Please Try Again');
      }
    } catch (error) {
      setLoader(false);
      console.log('Async thunk failed:', error);
    }
  };

  const startMoveQuantity = () => {
    Animated.sequence([
      Animated.timing(animatedQuantity, {
        toValue: -10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedQuantity, {
        toValue: 10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedQuantity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const startMoveWeight = () => {
    Animated.sequence([
      Animated.timing(animatedWeight, {
        toValue: -10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWeight, {
        toValue: 10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWeight, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const renderDateTimePicker = () => {
    return (
      <>
        {displayDatenTime.selection === 'date' ? (
          <RNDateTimePicker
            mode={'date'}
            value={myDate}
            minimumDate={new Date(Date.now())}
            onChange={onChangeDate}
          />
        ) : (
          displayDatenTime.selection === 'time' && (
            <RNDateTimePicker
              mode={'time'}
              value={myTime}
              minimumDate={new Date(Date.now())}
              onChange={onChangeDate}
            />
          )
        )}
      </>
    );
  };
  const renderBottomSection = () => {
    return (
      <View
        style={{
          paddingHorizontal: 18,
        }}>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            height: 0.7,
            backgroundColor: Colors.darkBlueColor,
            marginBottom: 10,
          }}
        />
        <View style={styles.selectionContainer}>
          <View style={styles.selectionItem}>
            <View style={styles.selectionOpacity}>
              <SmallText
                text="Select Date"
                style={[styles.greyColorStyle, {width: '80%'}]}
              />
              <TouchableOpacity
                onPress={() => {
                  setdisplayDatenTime({
                    isDisplay: true,
                    selection: 'date',
                  });
                }}>
                <Ionicons
                  name="calendar-outline"
                  style={[
                    styles.plusIconStyle,
                    {fontSize: responsiveFontSize(25)},
                  ]}
                />
              </TouchableOpacity>
            </View>
            <MediumText
              text={moment(myDate).format('Do MMM YY')}
              style={styles.blackColorStyle}
            />
          </View>
          <View style={styles.selectionItem}>
            <View style={styles.selectionOpacity}>
              <SmallText
                text="Select Time"
                style={[styles.greyColorStyle, {width: '80%'}]}
              />
              <TouchableOpacity
                onPress={() => {
                  setdisplayDatenTime({
                    isDisplay: true,
                    selection: 'time',
                  });
                }}>
                <Feather
                  name="clock"
                  style={[
                    styles.plusIconStyle,
                    {fontSize: responsiveFontSize(25)},
                  ]}
                />
              </TouchableOpacity>
            </View>
            <MediumText
              text={moment(myTime).format('LT')}
              style={styles.blackColorStyle}
            />
          </View>
          {/* @ts-ignore */}
          <Dropdown
            style={styles.dropDownContainer}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropDownChildContainer}
            itemTextStyle={styles.blackColorStyle}
            data={APPJSONFILES.dashboardQuantityTypes}
            maxHeight={200}
            onFocus={() => setDisplayQuality(true)}
            onBlur={() => setDisplayQuality(false)}
            onChange={item => {
              setIsQuantitySelected(false);
              setQuantity(item.value);
            }}
            mode="default"
            autoScroll
            showsVerticalScrollIndicator={false}
            dropdownPosition="top"
            renderItem={item => {
              return (
                <View style={{gap: 2}}>
                  <Text style={styles.rederItemsStyle}>{item.label}</Text>
                </View>
              );
            }}
            renderLeftIcon={() => (
              <Animated.View
                style={[styles.renderLeftContainer, animateQuantityStyle]}>
                <SmallText
                  text="Select Quantity"
                  style={{
                    color: isQuantitySelected
                      ? Colors.redColor
                      : Colors.darkGreyColor,
                  }}
                />
                <MediumText
                  text={quantity !== '' && quantity + ' item'}
                  style={styles.blackColorStyle}
                />
              </Animated.View>
            )}
            renderRightIcon={() => (
              <View>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  style={[styles.plusIconStyle, styles.dropDownRightIcon]}
                />
              </View>
            )}
          />
          {/* @ts-ignore */}
          <Dropdown
            style={styles.dropDownContainer}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropDownChildContainer}
            itemTextStyle={styles.blackColorStyle}
            data={APPJSONFILES.dashboardWeightTypes}
            maxHeight={200}
            onFocus={() => setDisplayWeight(true)}
            onBlur={() => setDisplayWeight(false)}
            onChange={item => {
              setIsWeightSelected(false);
              setWeight(item.value);
            }}
            mode="default"
            autoScroll
            showsVerticalScrollIndicator={false}
            dropdownPosition="top"
            renderItem={item => {
              return (
                <View style={{gap: 2}}>
                  <Text style={styles.rederItemsStyle}>{item.label}</Text>
                </View>
              );
            }}
            renderLeftIcon={() => (
              <Animated.View
                style={[styles.renderLeftContainer, animateWeightStyle]}>
                <SmallText
                  text="Select Weight/Amount"
                  style={{
                    color: isWeightSelected
                      ? Colors.redColor
                      : Colors.darkGreyColor,
                  }}
                />
                <MediumText
                  text={weight !== '' && weight + ' tons'}
                  style={styles.blackColorStyle}
                />
              </Animated.View>
            )}
            renderRightIcon={() => (
              <View>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  style={[styles.plusIconStyle, styles.dropDownRightIcon]}
                />
              </View>
            )}
          />
        </View>
        <Button
          title="Continue"
          isInverted={false}
          onPress={handleContinue}
          containerStyle={styles.continueButton}
        />
      </View>
    );
  };

  const renderItems = ({item, index}) => {
    return (
      <View
        key={index}
        style={[
          styles.mapContainer,
          {
            backgroundColor:
              selectedTruck === index ? Colors.primaryColor : Colors.whiteColor,
          },
        ]}>
        <View
          style={[
            styles.truckContainerSkeleton,
            {
              justifyContent: 'center',
            },
          ]}>
          <Image
            source={
              item.picture && item.picture !== ''
                ? {uri: item.picture}
                : require('../../../theme/assets/images/truck1.png')
            }
            style={styles.truckImage}
            onError={() => {
              setImageLoad(false);
            }}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.horizontalLine, styles.widthAndMargin]} />
        <View style={styles.imgDescriptionContainer}>
          <View style={{width: '80%'}}>
            <SmallText
              text="Ever Lowest Price!"
              // text= {item?.description ||"Ever Lowest Price!" }
              style={{color: Colors.blueColor}}
            />

            <MediumText
              text={item.title}
              style={[
                styles.blackColorStyle,
                {
                  width: '100%',
                  color:
                    selectedTruck === index
                      ? Colors.whiteColor
                      : Colors.blackColor,
                },
              ]}
            />
          </View>
          {selectedTruck !== index && (
            <TouchableOpacity
              onPress={() => {
                setSelectedTruckData(item._id);
                setSelectedTruck(index);
              }}
              style={styles.widthStyle}>
              <Feather
                name="plus-square"
                style={[styles.plusIconStyle, styles.lightGreyStyle]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  function ListEmpty() {
    return (
      <>
        {loader ? (
          <Skeleton type={'truck'} count={4} />
        ) : (
          <Text style={styles.listEmpty}>No Truck Found</Text>
        )}
      </>
    );
  }

  function ListSeparator() {
    return <View style={{height: getResponsiveSize(2).height}} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topOuterView}>
        <CustomerTopBar
          showArrow={true}
          showTitle={true}
          onPressArrow={() => {
            navigation.goBack();
          }}
          titleTxt="Trucks"
          inverted={false}
          containerStyle={styles.topContainer}
        />
      </View>

      <FlatList
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        style={styles.scrollViewContainer}
        contentContainerStyle={{
          paddingHorizontal: 18,
        }}
        // showsVerticalScrollIndicator={false}
        data={trucksData}
        renderItem={renderItems}
        ListEmptyComponent={() => <ListEmpty />}
        ItemSeparatorComponent={() => <ListSeparator />}
      />

      {renderBottomSection()}
      {renderDateTimePicker()}
    </SafeAreaView>
  );
};

export default AllTruck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mediumGrayClor,
    justifyContent: 'space-between',
  },
  topOuterView: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
  },

  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    padding: getResponsiveSize(1).height,
    paddingVertical: getResponsiveSize(2).height,
    backgroundColor: Colors.primaryColor,
  },

  scrollViewContainer: {
    flex: 1,
    marginVertical: getResponsiveSize(2).height,
  },
  parentImageStyle: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: getResponsiveSize(1).height,
  },
  horizontalLine: {
    borderBottomColor: Colors.mediumGrayClor,
    borderBottomWidth: 0.7,
    width: '95%',
    alignSelf: 'center',
    marginBottom: getResponsiveSize(1).height,
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginVertical: getResponsiveSize(1).height,
  },
  rederItemsStyle: {
    fontSize: responsiveFontSize(14),
    fontFamily: FONTS.MONTSERRAT_Medium,
    color: Colors.blackColor,
    margin: responsiveFontSize(2),
    marginHorizontal: 5,
    backgroundColor: Colors.inputPlaceHolder,
    borderRadius: responsiveFontSize(2),
    padding: responsiveFontSize(4),
  },
  blackColorStyle: {
    color: Colors.blackColor,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(16),
    color: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
    backgroundColor: Colors.redColor,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.blackColor,
    width: 100,
  },
  iconStyle: {
    width: getResponsiveSize(5).width,
    height: getResponsiveSize(5).height,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Colors.blackColor,
  },
  lightGreyStyle: {
    color: Colors.lightGreyColor,
  },
  greyColorStyle: {
    color: Colors.darkGreyColor,
  },
  errorColorStyle: {
    color: Colors.redColor,
  },
  widthAndMargin: {
    width: '100%',
    marginBottom: 0,
  },
  locationContainer: {
    backgroundColor: Colors.primaryColor,
    borderRadius: responsiveFontSize(20),
    padding: responsiveFontSize(10),
    justifyContent: 'space-between',
    gap: responsiveFontSize(10),
    width: '48%',
  },
  locationDetilsView: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryColor,
    borderRadius: getResponsiveSize(10).width,
    width: '100%',
  },
  widthStyle: {
    width: '20%',
    alignItems: 'flex-end',
  },
  mapIconStyle: {
    fontSize: responsiveFontSize(25),
    padding: getResponsiveSize(3).width,
    backgroundColor: Colors.whiteColor,
    color: Colors.primaryColor,
    borderRadius: getResponsiveSize(10).width,
  },
  myLocationContainer: {
    marginLeft: getResponsiveSize(2).width,
    width: '80%',
  },
  myLocationTxt: {
    color: Colors.lightGreyColor,
    width: '80%',
  },
  plusIconStyle: {
    fontSize: responsiveFontSize(25),
    color: Colors.lightPrimaryColor,
  },
  dropDownRightIcon: {
    fontSize: responsiveFontSize(30),
    alignSelf: 'flex-start',
    top: getResponsiveSize(-1.5).height,
  },
  dropDownChildContainer: {
    backgroundColor: Colors.inputPlaceHolder,
    borderRadius: 5,
    padding: 5,
  },
  renderLeftContainer: {
    flexDirection: 'column',
    width: '80%',
    paddingHorizontal: getResponsiveSize(2).width,
  },
  trucksContainer: {
    flex: 1,
    marginTop: getResponsiveSize(2).height,
  },
  trucksTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapContainer: {
    backgroundColor: Colors.whiteColor,
    borderRadius: getResponsiveSize(3).width,
    width: '48%',
  },
  truckContainerSkeleton: {
    height: getResponsiveSize(15).height,
  },
  truckImage: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'silver',
  },
  imgDescriptionContainer: {
    flexDirection: 'row',
    padding: getResponsiveSize(2).width,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  widthAndGap: {
    width: '80%',
    gap: responsiveFontSize(5),
  },
  skeletonsmallTxt: {
    width: getResponsiveSize(20).width,
    height: getResponsiveSize(3).height,
  },
  skeletonLengthyTxt: {
    width: getResponsiveSize(30).width,
    height: getResponsiveSize(3).height,
  },
  selectionContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  selectionItem: {
    width: '48%',
    backgroundColor: Colors.whiteColor,
    borderRadius: getResponsiveSize(2).width,
    padding: getResponsiveSize(4).width,
    marginBottom: getResponsiveSize(2).height,
  },
  dropDownContainer: {
    width: '48%',
    height: getResponsiveSize(11).height,
    padding: getResponsiveSize(2).width,
    backgroundColor: Colors.whiteColor,
    marginBottom: getResponsiveSize(2).height,
    borderRadius: getResponsiveSize(2).width,
  },
  selectionOpacity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueButton: {
    width: '95%',
    bottom: getResponsiveSize(2).height,
  },
  newTrackingOpacity: {
    justifyContent: 'center',
    width: getResponsiveSize(41).width,
    height: getResponsiveSize(7.5).height,
    alignSelf: 'center',
    transform: [{rotate: `180deg`}, {scaleY: -1}],
  },
  newTrackingTruckImg: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveFontSize(15),
  },
  listEmpty: {
    marginTop: '75%',
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),

    color: 'silver',
  },
});
