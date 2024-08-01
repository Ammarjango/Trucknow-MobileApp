import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../assets/colors/Colors';
import FONTS from '../assets/fonts/FONTS';
import {
  locationSelectionMODALType,
  requestStatusMODALType,
  truckBreakDownsMODALType,
  yesNoTitleDescMODALType,
} from '../types/AppInterfaceTypes';
import {getResponsiveSize, responsiveFontSize} from '../utils';
import {LargeText, MediumText, SmallText} from './text';
import {UserImg} from './userImg';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Maps_API_KEY} from '../../env';
import {Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS} from '../theme/constant';

export const LogoutPopUpMODAL: React.FC<yesNoTitleDescMODALType> = ({
  isVisible = false,
  title = 'Title',
  description = 'Description',
  cancelTxt = 'Cancel',
  acceptTxt = 'Log Out',
  onPressCancel,
  onPressAccept,
  onModalCLose,
  containerStyle,
  contentContainerStyle,
  titleTxtStyle,
  contentTxtStyle,
  cancelButtonStyle,
  acceptButtonStyle,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onModalCLose}>
      <View style={[styles.modalContainer, containerStyle]}>
        <View
          style={[
            styles.contentContainer,
            contentContainerStyle,
            styles.logoutContentContainer,
          ]}>
          <LargeText text={title} style={[styles.titleText, titleTxtStyle]} />
          <MediumText
            text={description}
            style={[styles.contentText, contentTxtStyle]}
          />
          <View style={styles.twoRowItemsContainer}>
            <TouchableOpacity
              onPress={onPressCancel}
              style={[
                styles.buttonOpacity,
                {backgroundColor: Colors.lightGreyColor},
              ]}>
              <MediumText
                text={cancelTxt}
                style={[styles.cancelTxtStyles, cancelButtonStyle]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressAccept}
              style={[
                styles.buttonOpacity,
                {backgroundColor: Colors.primaryColor},
              ]}>
              <MediumText
                text={acceptTxt}
                style={[styles.acceptTxtStyles, acceptButtonStyle]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const NtoficationMODAL: React.FC<yesNoTitleDescMODALType> = ({
  isVisible = false,
  title = 'Title',
  description = 'Description',
  acceptTxt = 'Ok',
  onPressCancel,
  onPressAccept,
  onModalCLose,
  containerStyle,
  contentContainerStyle,
  titleTxtStyle,
  contentTxtStyle,
  acceptButtonStyle,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onModalCLose}>
      <View style={[styles.modalContainer, containerStyle]}>
        <View
          style={[
            styles.contentContainer,
            contentContainerStyle,
            styles.logoutContentContainer,
          ]}>
          <TouchableOpacity onPress={onPressCancel} style={styles.crossOpacity}>
            <MaterialIcons
              name="cancel"
              color={Colors.redColor}
              size={responsiveFontSize(30)}
            />
          </TouchableOpacity>
          <LargeText text={title} style={[styles.titleText, titleTxtStyle]} />
          <MediumText
            text={description}
            style={[styles.contentText, contentTxtStyle]}
          />
          <View style={styles.twoRowItemsContainer}>
            <TouchableOpacity
              onPress={onPressAccept}
              style={[
                styles.longButton,
                {backgroundColor: Colors.primaryColor},
              ]}>
              <MediumText
                text={acceptTxt}
                style={[styles.acceptTxtStyles, acceptButtonStyle]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const TruckBreakDownMODAL: React.FC<truckBreakDownsMODALType> = ({
  containerStyle,
  isVisible = true,
  breakDown = true,
  driverName = 'John Doe',
  orderNumber = '#76428901',
  ratingsNumber = 3,
  ratingTxt = '3.0',
  alertReason = 'I must say that my experience with the app was quite impressive.',
  alertDetails = 'I must say that my experience with the app was quite impressive. From the ease of registration to the smooth bidding process, everything felt effortless. I was able to match my requirements in no time, and the communication with the driver was also excellent. ',
  onPressRightButton,
  onPressleftButton,
  onModalCLose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onModalCLose}>
      <View
        style={[
          styles.modalContainer,
          containerStyle,
          {justifyContent: 'flex-end'},
        ]}>
        <View
          style={[[styles.contentContainer, {gap: responsiveFontSize(15)}]]}>
          <View style={styles.titlenIconContainer}>
            {breakDown ? (
              <Feather
                name="alert-triangle"
                style={[
                  styles.iconStyle,
                  {color: breakDown ? Colors.redColor : Colors.greenColor},
                ]}
              />
            ) : (
              <AntDesign
                name="checkcircleo"
                style={[
                  styles.iconStyle,
                  {color: breakDown ? Colors.redColor : Colors.greenColor},
                ]}
              />
            )}
            <LargeText
              text={breakDown ? 'Truck Breakdown' : 'Truck Breakdown Fixed'}
              style={[styles.titleText, {fontFamily: FONTS.MONTSERRAT_Bold}]}
            />
          </View>
          <View style={styles.twoRowItemsContainer}>
            <View style={styles.imageAndContentView}>
              <UserImg imageContainer={styles.userImgContainer} />
              <View>
                <MediumText
                  text={driverName}
                  style={{color: Colors.blackColor}}
                />
                <View style={styles.starContainer}>
                  <StarRatingDisplay
                    rating={ratingsNumber}
                    starStyle={{width: getResponsiveSize(1).width, left: -7}}
                    starSize={responsiveFontSize(14)}
                  />
                  <MediumText
                    text={ratingTxt}
                    style={{color: Colors.lightGreyColor}}
                  />
                </View>
              </View>
            </View>
            <View>
              <MediumText
                text={'Order Number'}
                style={{
                  color: Colors.darkGreyColor,
                  fontFamily: FONTS.MONTSERRAT_Regular,
                }}
              />
              <MediumText
                text={orderNumber}
                style={{color: Colors.blackColor}}
              />
            </View>
          </View>

          <View style={styles.twoRowItemsContainer}>
            <TouchableOpacity
              onPress={onPressleftButton}
              style={[
                styles.buttonOpacity,
                {backgroundColor: Colors.primaryColor},
              ]}>
              <MediumText text={'Message'} style={[styles.cancelTxtStyles]} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressRightButton}
              style={[
                styles.buttonOpacity,
                {backgroundColor: Colors.primaryColor},
              ]}>
              <MediumText text={'Call'} style={[styles.acceptTxtStyles]} />
            </TouchableOpacity>
          </View>

          <View style={styles.alertNDetailContainer}>
            <View>
              <MediumText
                text={'Alert Reason'}
                style={styles.blackColorStyle}
              />
              <SmallText text={alertReason} style={styles.greyColorStyle} />
            </View>
            <View>
              <MediumText text={'Details'} style={styles.blackColorStyle} />
              <SmallText text={alertDetails} style={styles.greyColorStyle} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const RequestStatusMODAL: React.FC<requestStatusMODALType> = ({
  containerStyle,
  isVisible = true,
  alertTitle = 'Request Cancelled',
  alertIcon = 'icon',
  isSuccess = true,
  alertDetails = `We're sorry to inform you that your request has been cancelled. The trucking company could not find any trucks available to transport the product. To try your request again, please click the "Request Again" button. If you'd like to cancel your order entirely, click the "Cancel Request" button. We apologize for any inconvenience this may cause.`,
  onPressRightButton,
  onPressleftButton,
  onModalCLose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onModalCLose}>
      <View
        style={[
          styles.modalContainer,
          containerStyle,
          {justifyContent: 'flex-end'},
        ]}>
        <View
          style={[[styles.contentContainer, {gap: responsiveFontSize(15)}]]}>
          <View style={styles.titlenIconContainer}>
            {isSuccess ? (
              <MaterialIcons
                name="do-not-disturb"
                style={[
                  styles.iconStyle,
                  {color: isSuccess ? Colors.redColor : Colors.greenColor},
                ]}
              />
            ) : (
              <AntDesign
                name="checkcircleo"
                style={[
                  styles.iconStyle,
                  {color: isSuccess ? Colors.redColor : Colors.greenColor},
                ]}
              />
            )}
            <LargeText
              text={alertTitle}
              style={[styles.titleText, {fontFamily: FONTS.MONTSERRAT_Bold}]}
            />
          </View>

          <View>
            <MediumText text={'Details'} style={styles.blackColorStyle} />
            <SmallText text={alertDetails} style={styles.greyColorStyle} />
          </View>

          <View style={styles.twoRowItemsContainer}>
            <TouchableOpacity
              onPress={onPressleftButton}
              style={[
                styles.buttonOpacity,
                {backgroundColor: Colors.mediumGrayClor},
              ]}>
              <SmallText
                text={'Cancel Request'}
                style={[
                  styles.blackColorStyle,
                  {padding: responsiveFontSize(8)},
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressRightButton}
              style={[
                styles.buttonOpacity,
                {backgroundColor: Colors.primaryColor},
              ]}>
              <SmallText
                text={'Request Again'}
                style={styles.acceptTxtStyles}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const LocationSelectionMODAL: React.FC<locationSelectionMODALType> = ({
  locationIconStyle,
  locationIcon = require('../theme/assets/images/load.png'),
  buttonTxt,
  isVisible,
  placeHoldertxt,
  onPressListTxt,
  onPressButton,
  onModalCLose,
}) => {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent={true}
      onRequestClose={onModalCLose}>
      <SafeAreaView style={styles.pickupModalContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <KeyboardAvoidingView
            style={styles.pickupModalChild}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
            <View style={styles.locationImgView}>
              <Image
                source={locationIcon}
                style={[styles.imageStyle, locationIconStyle]}
                resizeMode="contain"
              />
            </View>
            <View style={styles.modalChildView}>
              <SimpleLineIcons
                name="location-pin"
                color="black"
                style={styles.locationMarkerStyle}
              />
              <GooglePlacesAutocomplete
                placeholder={placeHoldertxt}
                onPress={onPressListTxt}
                textInputProps={{
                  placeholderTextColor: Colors.blackColor,
                  clearButtonMode: 'never',
                  autoFocus: true,
                  clearTextOnFocus: true,
                }}
                fetchDetails={true}
                enableHighAccuracyLocation={true}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                minLength={1}
                debounce={200}
                styles={{
                  description: {
                    color: Colors.blackColor,
                    fontFamily: FONTS.MONTSERRAT_Regular,
                  },
                  container: {
                    height: '100%',
                  },
                  textInputContainer: {},
                  textInput: {
                    color: Colors.blackColor,
                    fontFamily: FONTS.MONTSERRAT_Regular,
                    fontSize: 14,
                  },
                  listView: {
                    maxHeight: 160,
                  },
                }}
                query={{
                  key: Maps_API_KEY,
                  language: 'en',
                  components: 'country:us',
                  location: 'lat,lng',
                }}
                onFail={error => console.error(error)}
              />
            </View>

            <TouchableOpacity
              onPress={onPressButton}
              style={styles.useCurrentOpacity}>
              <MediumText text={buttonTxt} style={styles.acceptTxtStyles} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{position: 'absolute', top: 5, right: 5, padding: 5}}
              onPress={onModalCLose}>
              <AntDesign
                name="closecircleo"
                color={Colors.silverColor}
                size={18}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparentColor,
  },
  contentContainer: {
    backgroundColor: Colors.whiteColor,
    width: '100%',
    padding: responsiveFontSize(20),
    borderTopRightRadius: responsiveFontSize(10),
    borderTopLeftRadius: responsiveFontSize(10),
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContent: {},
  crossOpacity: {
    alignSelf: 'flex-end',
  },
  logoutContentContainer: {
    width: '95%',
    borderRadius: responsiveFontSize(10),
    padding: responsiveFontSize(20),
  },
  titleText: {
    color: Colors.blackColor,
  },
  contentText: {
    marginVertical: responsiveFontSize(10),
    color: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  buttonOpacity: {
    width: '45%',
    backgroundColor: Colors.lightGreyColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveFontSize(5),
  },
  longButton: {
    width: '100%',
    backgroundColor: Colors.lightGreyColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveFontSize(5),
  },
  cancelTxtStyles: {
    padding: responsiveFontSize(8),
    alignSelf: 'center',
  },
  blackColorStyle: {
    color: Colors.blackColor,
  },
  greyColorStyle: {
    color: Colors.darkGreyColor,
  },
  acceptTxtStyles: {
    padding: responsiveFontSize(8),
    borderRadius: responsiveFontSize(5),
    alignSelf: 'center',
  },
  titlenIconContainer: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.mediumGrayClor,
    gap: responsiveFontSize(10),
    paddingVertical: getResponsiveSize(2).height,
    borderRadius: responsiveFontSize(10),
  },
  iconStyle: {
    fontSize: responsiveFontSize(60),
  },
  twoRowItemsContainer: {
    width: '95%',
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
  alertNDetailContainer: {
    gap: responsiveFontSize(15),
    backgroundColor: Colors.mediumGrayClor,
    padding: responsiveFontSize(10),
    borderRadius: responsiveFontSize(10),
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: responsiveFontSize(4),
  },
  pickupModalContainer: {
    flex: 1,

    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopLeftRadius: responsiveFontSize(10),
    borderTopRightRadius: responsiveFontSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupModalChild: {
    backgroundColor: Colors.extraLightBlueColor,
    width: '90%',
    borderRadius: responsiveFontSize(5),
  },
  locationImgView: {
    width: getResponsiveSize(90).width,
    height: getResponsiveSize(20).height,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  useCurrentOpacity: {
    backgroundColor: Colors.lightPrimaryColor,
    width: '90%',
    alignSelf: 'center',
    margin: '2%',
    padding: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveFontSize(10),
  },
  modalChildView: {
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    width: '95%',
    marginHorizontal: '2.5%',
    borderRadius: responsiveFontSize(10),
    marginVertical: '4%',
    justifyContent: 'space-between',
    paddingRight: '3%',
  },
  locationMarkerStyle: {
    marginHorizontal: '3%',
    marginVertical: '4%',
    fontSize: responsiveFontSize(20),
  },
});
