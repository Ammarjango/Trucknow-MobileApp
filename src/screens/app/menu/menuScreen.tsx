import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import CustomerTopBar from '../../../components/customerTopBar';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {LogoutPopUpMODAL} from '../../../components/MODAL';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {resetData} from '../../../redux/slice/dataSlice';
import {UserImg} from '../../../components/userImg';
import {OneSignal} from 'react-native-onesignal';

const MenuScreen = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const [logoutModal, setLogoutModal] = useState(false);
  const reduxData = useSelector((state: any) => state?.data?.loginData);

  let userData: any;

  //checking if the redux data is in string or not
  if (typeof reduxData === 'string') {
    userData = JSON.parse(reduxData);
  } else {
    userData = reduxData;
  }
  // console.log('userData: ', userData);

  const logoutUser = () => {
    OneSignal.logout();
    AsyncStorage.clear();
    dispatch(resetData());
    setLogoutModal(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Login'}],
      }),
    );
  };
  return (
    <View style={styles.container}>
      <LogoutPopUpMODAL
        title="Logout"
        description="Are you sure !"
        cancelTxt="Cancel"
        acceptTxt="Log Out"
        isVisible={logoutModal}
        onModalCLose={() => setLogoutModal(false)}
        onPressCancel={() => setLogoutModal(false)}
        onPressAccept={() => {
          logoutUser();
        }}
      />
      <View style={styles.topOuterView}>
        <CustomerTopBar
          showArrow={true}
          showTitle={true}
          onPressArrow={() => {
            navigation.goBack();
          }}
          titleTxt="Profile"
          inverted={false}
          containerStyle={styles.topContainer}
        />
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.userImgView}>
          <UserImg
            skeletonStyle={styles.profileSkeleton}
            imageContainer={styles.userImg}
            onPressImg={() => {
              navigation.navigate('UserAccount');
            }}
          />
        </View>
        <View>
          <LargeText
            text={
              userData.user?.firstname
                ? userData.user?.firstname + ' ' + userData.user?.lastname
                : 'N/A'
            }
            style={styles.blackTxt}
          />
          <MediumText
            text={'Los Angeles, CA, United States'}
            style={[
              styles.lightGreyTxt,
              {fontFamily: FONTS.MONTSERRAT_Regular},
            ]}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserAccount');
          }}
          style={styles.rowContainer}>
          <View style={styles.singleItemContainer}>
            <FontAwesome name="user-circle-o" style={styles.darkIcon} />
            <View>
              <MediumText text={'Account'} style={styles.blackTxt} />
              <SmallText
                text={'Edit profile options'}
                style={styles.darkGreyTxt}
              />
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-right" style={styles.darkIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowContainer}>
          <View style={styles.singleItemContainer}>
            <Ionicons name="notifications-outline" style={styles.darkIcon} />
            <View>
              <MediumText text={'Notifications'} style={styles.blackTxt} />
              <SmallText
                text={'Message and call tones'}
                style={styles.darkGreyTxt}
              />
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-right" style={styles.darkIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserChats');
          }}
          style={styles.rowContainer}>
          <View style={styles.singleItemContainer}>
            <Ionicons name="chatbox-outline" style={styles.darkIcon} />
            <View>
              <MediumText text={'Chats'} style={styles.blackTxt} />
              <SmallText text={'Chat history'} style={styles.darkGreyTxt} />
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-right" style={styles.darkIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserBillingHistory');
          }}
          style={styles.rowContainer}>
          <View style={styles.singleItemContainer}>
            <MaterialIcons name="history" style={styles.darkIcon} />
            <View>
              <MediumText text={'Shipmnent History'} style={styles.blackTxt} />
              <SmallText
                text={'Track Total Shipmnents'}
                style={styles.darkGreyTxt}
              />
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-right" style={styles.darkIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowContainer}>
          <View style={styles.singleItemContainer}>
            <Feather name="help-circle" style={styles.darkIcon} />
            <View>
              <MediumText text={'Help'} style={styles.blackTxt} />
              <SmallText
                text={'Help center, contact us, privacy policy'}
                style={styles.darkGreyTxt}
              />
            </View>
          </View>
          <MaterialIcons name="keyboard-arrow-right" style={styles.darkIcon} />
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 1.5,
            backgroundColor: Colors.lightGreyColor,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setLogoutModal(true);
          }}
          style={styles.rowContainer}>
          <View style={styles.singleItemContainer}>
            <AntDesign
              name="logout"
              style={[
                styles.darkIcon,
                {
                  color: Colors.redColor,
                  transform: [
                    {
                      rotate: '270deg',
                    },
                  ],
                },
              ]}
            />
            <View>
              <MediumText text={'Log out'} style={{color: Colors.redColor}} />
              <SmallText
                text={'Sign out and end session'}
                style={{color: Colors.redColor}}
              />
            </View>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            style={[styles.darkIcon, {color: Colors.redColor}]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
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
  rowContainer: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  userInfoContainer: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: getResponsiveSize(3.5).height,
    flexDirection: 'row',
    gap: responsiveFontSize(10),
  },
  userImgView: {
    height: 62,
    width: 62,
    borderRadius: 62 / 2,
  },
  userImg: {
    width: '100%',
    height: '100%',
    borderRadius: 62 / 2,
  },
  blackTxt: {
    color: Colors.blackColor,
    letterSpacing: 0.5,
  },
  lightGreyTxt: {
    color: Colors.lightGreyColor,
  },
  darkGreyTxt: {
    color: Colors.darkGreyColor,
    letterSpacing: 0.5,
  },
  iconStyle: {
    fontSize: responsiveFontSize(17),
    color: Colors.whiteColor,
  },
  darkIcon: {
    fontSize: responsiveFontSize(25),
    color: Colors.darkGreyColor,
    alignSelf: 'center',
  },
  buttonStyle: {
    width: '40%',
    flexDirection: 'row',
    gap: responsiveFontSize(8),
    borderRadius: responsiveFontSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightPrimaryColor,
    padding: responsiveFontSize(8),
  },
  bottomContainer: {
    width: '100%',
    backgroundColor: Colors.lightChocolateColor,
    paddingVertical: getResponsiveSize(3).height,
    gap: getResponsiveSize(2).height,
  },
  singleItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: responsiveFontSize(12),
  },
  logoutModalContentContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModaltitleTxt: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  profileSkeleton: {
    width: getResponsiveSize(25).width,
    height: getResponsiveSize(13).height,
    backgroundColor: 'silver',
  },
});

export default MenuScreen;
