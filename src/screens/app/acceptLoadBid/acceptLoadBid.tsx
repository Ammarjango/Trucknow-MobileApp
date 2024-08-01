import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Octicons from 'react-native-vector-icons/Octicons';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import CustomBackArrow from '../../../components/customerTopBar';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {SVG} from '../../../theme/assets';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {useDispatch} from 'react-redux';
import {
  getAvailableBids,
  postingAcceptedBid,
} from '../../../redux/slice/dataSlice';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ShowMessage} from '../../../utils/ShowMessage';
const AcceptLoadBid = () => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const [isFiltered, setIsFiltered] = useState(false);
  const [biddingData, setBiddingData] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>(null);

  useEffect(() => {
    getBids();
  }, []);

  const getBids = async () => {
    try {
      const response: any = await dispatch(
        getAvailableBids(route?.params?.reqId),
      );
      if (response?.payload?.success) {
        setBiddingData(response?.payload?.data);
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

  const postAcceptedBid = async () => {
    try {
      const user: any = await AsyncStorage.getItem('user');
      let myParams;
      if (user) {
        myParams = {
          requestId: selectedItems?.requestId?._id,
          bidId: selectedItems?._id,
          biderId: selectedItems?.createdBy?._id,
        };
      }
      const response: any = await dispatch(postingAcceptedBid(myParams));
      if (response?.payload?.success) {
        navigation.goBack();
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

  const toggleCheckbox = (itemId: number, items: any) => {
    if (selectedItems?._id === itemId) {
      // If the same item is clicked again, deselect it
      setSelectedItems(null);
    } else {
      // Select the clicked item
      setSelectedItems(items);
    }
  };

  const toggleFilter = () => {
    setIsFiltered(!isFiltered);

    // Sorting function based on the 'createdAt' property
    const sortingFunction = (a: any, b: any) => {
      const createdAtA: any = new Date(a.createdAt);
      const createdAtB: any = new Date(b.createdAt);

      if (isFiltered) {
        return createdAtA - createdAtB;
      } else {
        return createdAtB - createdAtA;
      }
    };

    // Create a new sorted array
    const sortedArray = [...biddingData].sort(sortingFunction);

    // Update the state with the sorted array
    setBiddingData(sortedArray);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <CustomBackArrow
          showArrow={true}
          onPressArrow={() => {
            navigation.goBack();
          }}
          inverted={false}
          ArrowIconStyles={styles.arrowContainer}
        />
        <View style={styles.topInnerContainer}>
          <View style={styles.twoRowItemsContainer}>
            <LargeText text={'Available Bids'} style={styles.bidTxt} />
            <TouchableOpacity
              onPress={() => {
                toggleFilter();
              }}>
              {isFiltered ? (
                <SvgXml xml={SVG.icons.filteredArrow} />
              ) : (
                <SvgXml
                  xml={SVG.icons.filteredArrow}
                  style={{transform: [{rotate: '180deg'}]}}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {biddingData?.length <= 0 ? (
        <LargeText
          text={'No Bids yet!'}
          style={[styles.blackColorStyle, {alignSelf: 'center'}]}
        />
      ) : (
        biddingData?.map((item: any, index: number) => {
          console.log('item: ', item);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                toggleCheckbox(item._id, item);
              }}
              style={styles.selectableView}>
              <View style={styles.truckImgContainer}>
                <Image
                  source={
                    item?.requestId?.truckId?.picture &&
                    item?.requestId?.truckId?.picture != ''
                      ? {uri: item?.requestId?.truckId?.picture}
                      : require('../../../theme/assets/images/truck1.png')
                  }
                  style={styles.truckImg}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.companyDetailsContainer}>
                <MediumText
                  text={
                    item.createdBy.firstname + ' ' + item.createdBy.lastname
                  }
                  style={styles.blackColorStyle}
                />
                <View style={styles.companyDetailsChildContainer}>
                  <SmallText
                    text={item?.requestId?.truckId?.title}
                    numOfLines={1}
                    style={[
                      styles.primaryColorAndMediumTxt,
                      styles.darkGreyColorStyle,
                      {width: '50%'},
                    ]}
                  />
                  <Octicons name="dot-fill" style={styles.dotIconStyle} />
                  <SmallText
                    text={`${item.price}/hr`}
                    style={styles.primaryColorAndMediumTxt}
                  />
                </View>
              </View>
              <View style={styles.userDetailsContainer}>
                <View style={[styles.ratingContainer, {width: '50%'}]}>
                  <StarRatingDisplay
                    rating={4.5}
                    starStyle={[
                      styles.starStyle,
                      {width: getResponsiveSize(1.5).width},
                    ]}
                    starSize={responsiveFontSize(15)}
                  />
                </View>
                <View
                  style={[
                    styles.companyDetailsChildContainer,
                    {
                      alignSelf: 'center',
                    },
                  ]}>
                  <MediumText
                    text={'4.5/5.0'}
                    style={[
                      styles.darkGreyColorStyle,
                      {
                        alignSelf: 'center',
                      },
                    ]}
                  />
                </View>
              </View>
              <View>
                {selectedItems?._id === item._id ? (
                  <SvgXml xml={SVG.icons.checkedBox} />
                ) : (
                  <SvgXml xml={SVG.icons.unCheckedBox} />
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}

      <Button
        title="Continue"
        isInverted={false}
        onPress={() => {
          if (selectedItems === null) {
            ShowMessage('error', 'Please Select a Bid!');
            // ToastAndroid.showWithGravityAndOffset(
            //   'Please Select a Bid!',
            //   ToastAndroid.SHORT,
            //   ToastAndroid.BOTTOM,
            //   25,
            //   50,
            // );
          } else {
            postAcceptedBid();
          }
        }}
        containerStyle={styles.continueButton}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    backgroundColor: Colors.primaryColor,
    justifyContent: 'space-around',
    borderBottomLeftRadius: responsiveFontSize(25),
    borderBottomRightRadius: responsiveFontSize(25),
    gap: getResponsiveSize(3).height,
  },
  topInnerContainer: {
    width: '95%',
    alignSelf: 'center',
    gap: getResponsiveSize(3).height,
    paddingBottom: getResponsiveSize(3).height,
  },
  twoRowItemsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  arrowContainer: {
    alignSelf: 'flex-start',
    marginTop: getResponsiveSize(3).height,
    marginLeft: getResponsiveSize(2).width,
  },
  bidTxt: {
    fontSize: responsiveFontSize(25),
  },
  inputStyle: {
    backgroundColor: Colors.whiteColor,
    width: '85%',
    borderRadius: responsiveFontSize(6),
    fontFamily: FONTS.MONTSERRAT_Regular,
    paddingLeft: getResponsiveSize(4).width,
    color: Colors.blackColor,
  },
  blackColorStyle: {
    color: Colors.blackColor,
  },
  darkGreyColorStyle: {
    color: Colors.darkGreyColor,
  },
  searchIconOpacity: {
    borderRadius: responsiveFontSize(6),
    borderColor: Colors.lightPrimaryColor,
    padding: responsiveFontSize(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  searchIcon: {
    fontSize: responsiveFontSize(25),
    color: Colors.whiteColor,
  },
  selectableView: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  truckImgContainer: {
    width: getResponsiveSize(25).width,
    height: getResponsiveSize(7).height,
    backgroundColor: Colors.mediumGrayClor,
    borderRadius: responsiveFontSize(8),
    marginVertical: responsiveFontSize(10),
  },
  truckImg: {
    width: '100%',
    height: '100%',
  },
  continueButton: {
    width: '95%',
    position: 'absolute',
    bottom: 10,
    marginVertical: getResponsiveSize(2).height,
    backgroundColor: Colors.primaryColor,
  },
  companyDetailsContainer: {
    width: '40%',
  },
  companyDetailsChildContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starStyle: {
    left: -7,
  },
  dotIconStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.blackColor,
  },
  primaryColorAndMediumTxt: {
    color: Colors.lightPrimaryColor,
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
  userDetailsContainer: {
    width: '20%',
    justifyContent: 'center',
  },
});

export default AcceptLoadBid;
