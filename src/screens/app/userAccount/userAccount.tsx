import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS, request} from 'react-native-permissions';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import CustomerTopBar from '../../../components/customerTopBar';
import {SmallText} from '../../../components/text';
import {UserImg} from '../../../components/userImg';
import {keyboardType, userProfileSchema} from '../../../types/schemas';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {
  deleteUserProfileImage,
  getUserProfileDetails,
  isLoader,
  saveLoginData,
  updateUserProfileDetails,
} from '../../../redux/slice/dataSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Chat_Production_URl, ProductionURl, s3Bucket} from '../../../../env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ShowMessage} from '../../../utils/ShowMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const UserAccount = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const reduxData = useSelector((state: any) => state?.data?.loginData);
  let userData: any;

  //checking if the redux data is in string or not
  if (typeof reduxData === 'string') {
    userData = JSON.parse(reduxData);
  } else {
    userData = reduxData;
  }
  const [initialValues, setInitialValues] = useState<any>();
  //   const [passwordVisibility, setPasswordVisibility] = useState(true);
  //   const [rightIcon, setRightIcon] = useState('eye-off');
  const [userImg, setUserImg] = useState<any>('');

  //1. get user profile details
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await dispatch(getUserProfileDetails());
        if (response?.payload) {
          const userDetails = response?.payload?.data;
          setInitialValues({
            firstname: userDetails?.firstname,
            lastname: userDetails?.lastname,
            userName: userDetails?.userName,
            phone: userDetails?.phoneno,
            email: userDetails?.email,
            address: userDetails?.address,
            profileImgUrl: userDetails?.s3Images[0],
          });
          if (userDetails?.s3Images[0]) {
            setUserImg(s3Bucket + userDetails?.s3Images[0]);
          }
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

    getUserProfile();
  }, []);

  //2. update user profile
  const handleupdateProfile = async (values: any) => {
    try {
      await dispatch(isLoader(true));
      let paramValues = {
        userName: values?.userName,
        address: values?.address,
        email: values?.email,
        firstname: values?.firstname,
        lastname: values?.lastname,
      };
      const response: any = await dispatch(
        updateUserProfileDetails(paramValues),
      );
      // console.log('******** response?.payload?.data : ', response?.payload);
      if (response?.payload) {
        if (userImg.path) {
          deletePrevImage();
        } else {
          await dispatch(isLoader(false));
          updateReduxUser(response?.payload?.data);
        }
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

  //3. delete the previous image, if user selected new profile image
  const deletePrevImage = async () => {
    try {
      const response = await dispatch(
        deleteUserProfileImage(initialValues?.profileImgUrl),
      );
      if (response?.payload) {
        uploadImage();
      } else {
        await dispatch(isLoader(false));
        if (response?.payload?.message) {
          Alert.alert(response?.payload?.message);
        } else {
          Alert.alert('Please Try Again');
        }
      }
    } catch (error) {
      await dispatch(isLoader(false));
      console.log('Async thunk failed:', error);
    }
  };

  //4. upload updated image(if user selected new profile image)
  const uploadImage = async () => {
    const uploadObj = {
      uri: userImg.path,
      type: userImg.mime,
      name: userImg.modificationDate || 'image',
    };
    // console.log('uploadObj: ', uploadObj);
    var formData = new FormData();
    formData.append('file', uploadObj);

    try {
      const response = await axios.post(
        ProductionURl + '/trucknow/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData?.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      // console.log('***** response?.data : ', response?.data);
      if (response?.data?.success) {
        updateRedux(response?.data);
      }
    } catch (error) {
      await dispatch(isLoader(false));
      ShowMessage('error', 'Uploading image error');
      console.log('catchhh', error);
    }
  };

  //5. update redux, so profile updates in real-time
  const updateRedux = async (updatedData: any) => {
    userData.user.s3Images[0] = updatedData.key;
    AsyncStorage.setItem('user', JSON.stringify(userData));
    dispatch(saveLoginData(JSON.stringify(userData)));
    await dispatch(isLoader(false));
    ShowMessage('success', 'profile updated');
    // ToastAndroid.showWithGravityAndOffset(
    //   'profile updated',
    //   ToastAndroid.SHORT,
    //   ToastAndroid.BOTTOM,
    //   25,
    //   30,
    // );
  };

  //5. update redux, so profile updates in real-time
  const updateReduxUser = async (data: any) => {
    userData.user = data;
    console.log('userData: ', userData);
    AsyncStorage.setItem('user', JSON.stringify(userData));
    dispatch(saveLoginData(JSON.stringify(userData)));
    await dispatch(isLoader(false));
    ShowMessage('success', 'profile updated');
  };

  const getGalleryPermissions = () => {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
        .then(statuses => {
          if (statuses) {
            imagePicker();
          }
        })
        .catch(err => {
          console.log(
            'Please Try Again, or go to setting and allow permissions',
            err,
          );
        });
    } else {
      request(PERMISSIONS.IOS.MEDIA_LIBRARY)
        .then(statuses => {
          if (statuses) {
            imagePicker();
          }
        })
        .catch(err => {
          console.log(
            'Please Try Again, or go to setting and allow permissions',
            err,
          );
        });
    }
  };

  const imagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image: any) => {
        setUserImg(image);
      })
      .catch(err => {
        console.log(err);
      });
  };

  //display the screen, when profile data fetched

  return (
    <View style={styles.contaier}>
      <View style={styles.topOuterView}>
        <CustomerTopBar
          showArrow={true}
          showTitle={true}
          onPressArrow={() => {
            navigation.goBack();
          }}
          titleTxt="Account"
          inverted={false}
          containerStyle={styles.topContainer}
        />
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        {initialValues ? (
          <>
            <View style={styles.imgView}>
              {userImg === '' ? (
                <UserImg
                  skeletonStyle={styles.profileSkeleton}
                  imageContainer={styles.imgContainer}
                />
              ) : (
                <UserImg
                  skeletonStyle={styles.profileSkeleton}
                  imageContainer={styles.imgContainer}
                  imageSource={userImg?.path ? userImg?.path : userImg}
                />
              )}
              <TouchableOpacity
                style={styles.editImgIcon}
                onPress={() => {
                  getGalleryPermissions();
                }}>
                <Feather size={18} name="camera" color={Colors.whiteColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Formik
                initialValues={initialValues}
                validationSchema={userProfileSchema}
                onSubmit={handleupdateProfile}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={styles.formContainer}>
                    <View style={styles.inputParent}>
                      <SmallText
                        text={'First name'}
                        style={styles.inputTitleTxt}
                      />
                      <TextInput
                        style={styles.input}
                        keyboardType={keyboardType}
                        scrollEnabled={false}
                        placeholder="firstname"
                        placeholderTextColor={Colors.lightGreyColor}
                        onChangeText={handleChange('firstname')}
                        onBlur={handleBlur('firstname')}
                        value={String(values?.firstname)}
                      />
                      {touched.firstname && errors.firstname && (
                        <SmallText text={errors.firstname} error={true} />
                      )}
                    </View>

                    <View style={styles.inputParent}>
                      <SmallText
                        text={'Last name'}
                        style={styles.inputTitleTxt}
                      />
                      <TextInput
                        style={styles.input}
                        keyboardType={keyboardType}
                        scrollEnabled={false}
                        placeholder="lastname"
                        placeholderTextColor={Colors.lightGreyColor}
                        onChangeText={handleChange('lastname')}
                        onBlur={handleBlur('lastname')}
                        value={String(values?.lastname)}
                      />
                      {touched.lastname && errors.lastname && (
                        <SmallText text={errors.lastname} error={true} />
                      )}
                    </View>

                    <View style={styles.inputParent}>
                      <SmallText
                        text={'Username'}
                        style={styles.inputTitleTxt}
                      />
                      <TextInput
                        style={styles.input}
                        keyboardType={keyboardType}
                        scrollEnabled={false}
                        placeholder="userName"
                        placeholderTextColor={Colors.lightGreyColor}
                        onChangeText={handleChange('userName')}
                        onBlur={handleBlur('userName')}
                        value={String(values?.userName)}
                      />
                      {touched.userName && errors.userName && (
                        <SmallText text={errors.userName} error={true} />
                      )}
                    </View>

                    <View style={styles.inputParent}>
                      <SmallText text={'Phone'} style={styles.inputTitleTxt} />
                      <TextInput
                        style={styles.input}
                        placeholder="phone"
                        keyboardType={keyboardType}
                        editable={false}
                        placeholderTextColor={Colors.lightGreyColor}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={String(values?.phone)}
                      />
                      {touched.phone && errors.phone && (
                        <SmallText text={errors.phone} error={true} />
                      )}
                    </View>

                    <View style={styles.inputParent}>
                      <SmallText text={'Email'} style={styles.inputTitleTxt} />
                      <TextInput
                        style={styles.input}
                        keyboardType={keyboardType}
                        placeholder="Email"
                        placeholderTextColor={Colors.lightGreyColor}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={String(values?.email)}
                      />
                      {touched.email && errors.email && (
                        <SmallText text={errors.email} error={true} />
                      )}
                    </View>

                    <View style={styles.inputParent}>
                      <SmallText
                        text={'Address'}
                        style={styles.inputTitleTxt}
                      />
                      <TextInput
                        style={styles.input}
                        keyboardType={keyboardType}
                        placeholder="address"
                        placeholderTextColor={Colors.lightGreyColor}
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('address')}
                        value={String(values?.address)}
                      />
                      {touched.address && errors.address && (
                        <SmallText text={errors.address} error={true} />
                      )}
                    </View>

                    <Button
                      title="Update Profile"
                      onPress={handleSubmit}
                      isInverted={false}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </>
        ) : (
          <ActivityIndicator
            size={'large'}
            color={Colors.primaryColor}
            style={{alignSelf: 'center', top: '50%'}}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  contaier: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    gap: responsiveFontSize(15),
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
  imgView: {
    alignSelf: 'center',
  },
  imgContainer: {
    // width: getResponsiveSize(25).width,
    // height: getResponsiveSize(13).height,
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
  },
  editImgIcon: {
    backgroundColor: Colors.lightPrimaryColor,
    alignSelf: 'flex-end',
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    marginTop: getResponsiveSize(-4).height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    justifyContent: 'space-between',
  },
  formContainer: {
    padding: getResponsiveSize(5).width,
    gap: responsiveFontSize(15),
  },
  inputParent: {
    gap: responsiveFontSize(3),
  },
  inputTitleTxt: {
    color: Colors.lightGreyColor,
  },
  input: {
    borderColor: Colors.lightGreyColor,
    borderWidth: 1,
    borderRadius: responsiveFontSize(4),
    color: Colors.blackColor,
    paddingHorizontal: responsiveFontSize(10),
    padding: responsiveFontSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
  passInputParentView: {
    width: '100%',
    borderColor: Colors.lightGreyColor,
    borderWidth: 1,
    borderRadius: responsiveFontSize(4),
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: responsiveFontSize(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  passInputStyle: {
    padding: responsiveFontSize(5),
    fontFamily: FONTS.MONTSERRAT_Medium,
    width: '90%',
    color: Colors.blackColor,
  },
  passIcon: {
    color: Colors.blackColor,
    fontSize: responsiveFontSize(20),
    marginRight: getResponsiveSize(1).width,
  },
  dropDownContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    padding: getResponsiveSize(0.2).height,
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getResponsiveSize(2).width,
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
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Colors.blackColor,
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
  renderLeftContainer: {
    flexDirection: 'column',
    paddingHorizontal: getResponsiveSize(2).width,
  },
  plusIconStyle: {
    fontSize: responsiveFontSize(30),
    color: Colors.blackColor,
  },
  iconStyle: {
    fontSize: responsiveFontSize(17),
    color: Colors.whiteColor,
  },
  dropDownContainerStyle: {
    backgroundColor: Colors.inputPlaceHolder,
    borderRadius: 5,
    padding: 5,
  },
  profileSkeleton: {
    width: getResponsiveSize(25).width,
    height: getResponsiveSize(13).height,
  },
});

export default UserAccount;
