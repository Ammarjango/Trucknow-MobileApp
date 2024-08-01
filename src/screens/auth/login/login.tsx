import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {LoginUser} from '../../../redux/slice/dataSlice';
import {AppDispatch} from '../../../store/store';
import {autheniticateUserRequest} from '../../../types/axiosRequests';
import {TRootStack} from '../../../types/mainStack';
import {loginValidationSchema} from '../../../types/schemas';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {OneSignal} from 'react-native-onesignal';
import {ShowMessage} from '../../../utils/ShowMessage';

type Props = NativeStackScreenProps<TRootStack, 'Login'>;

const Login = ({navigation}: Props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [eyeIcon, setEyeIcon] = useState('eye-off');
  const dispatch = useDispatch<AppDispatch>();

  const LoginFunction = async (values: autheniticateUserRequest) => {
    const itemData: any = {
      phoneNo: values?.phoneNo,
      password: values?.password,
      role: 'user',
    };
    try {
      const response: any = await dispatch(LoginUser(itemData));
      console.log('response LoginUser: ', response);
      if (response?.payload?.success) {
        if (Platform.OS === 'android') {
          requestMultiple([
            PERMISSIONS.ANDROID.READ_CALENDAR,
            PERMISSIONS.ANDROID.WRITE_CALENDAR,
          ])
            .then(statuses => {
              if (
                PERMISSIONS.ANDROID.READ_CALENDAR &&
                PERMISSIONS.ANDROID.WRITE_CALENDAR
              ) {
                console.log('CALENDAR Permission ::', statuses);
                if (statuses) {
                  goToHome(response);
                }
              }
            })
            .catch(() => {
              ShowMessage(
                'error',
                response?.payload?.message ||
                  'Please Try Again, or go to setting and allow permissions',
              );
            });
        } else {
          goToHome(response);
        }
      } else {
        ShowMessage(
          'error',
          response?.payload?.message ||
            'Please enter correct credentials \n(eg: 92xxxxxxxxx)',
        );
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  const goToHome = (response: any) => {
    console.log('response: ', response);
    AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
    AsyncStorage.setItem('user', JSON.stringify(response?.payload));
    OneSignal.login(response?.payload?.user?._id), navigation.replace('Home');
  };

  const askForCalenderPermission = async (values: any) => {
    LoginFunction(values);
  };

  const handleLogin = (values: any) => {
    askForCalenderPermission(values);
  };

  const handlePasswordVisibility = () => {
    if (eyeIcon === 'eye-off') {
      setEyeIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    } else if (eyeIcon === 'eye') {
      setEyeIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  return (
    <View style={styles.container}>
      <LargeText style={styles.heading} text="Welcome," />
      <LargeText
        style={[styles.heading, {fontFamily: FONTS.MONTSERRAT_Regular}]}
        text="Glad to see you!"
      />
      <View style={styles.form}>
        <ScrollView>
          <Formik
            initialValues={{
              phoneNo: '', //923365678234
              password: '', //11223355
            }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone (with country code)"
                  placeholderTextColor={Colors.inputPlaceHolder}
                  onChangeText={handleChange('phoneNo')}
                  keyboardType="decimal-pad"
                  onBlur={handleBlur('phoneNo')}
                  value={values.phoneNo}
                />
                {touched.phoneNo && errors.phoneNo && (
                  <SmallText error={true} text={errors.phoneNo} />
                )}

                <View style={[styles.input, styles.passContainer]}>
                  <TextInput
                    style={styles.passInputStyle}
                    placeholder="Password"
                    placeholderTextColor={Colors.inputPlaceHolder}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={passwordVisibility}
                  />
                  <TouchableOpacity onPress={() => handlePasswordVisibility()}>
                    <Feather name={eyeIcon} style={styles.passIcon} />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <SmallText text={errors.password} error={true} />
                )}
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={styles.forgetPassOpacity}>
                  <MediumText
                    style={[styles.text, styles.flexEndAndZeroPadding]}
                    text="Forgot your password?"
                  />
                </TouchableOpacity>
                <Button
                  title="Login as User"
                  onPress={handleSubmit}
                  isInverted={true}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
      <View style={styles.row}>
        <MediumText
          style={[styles.text, styles.flexEndAndZeroPadding]}
          text={`Don’t have an account?`}
        />

        <Pressable onPress={() => navigation.navigate('EnterPhoneNumber')}>
          <MediumText style={[styles.text, styles.login]} text={` Register`} />
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingTop: getResponsiveSize(5).height,
  },
  heading: {
    color: Colors.blackColor,
    fontSize: responsiveFontSize(32),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(5).width,
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
  passInputStyle: {
    flex: 1,
    color: Colors.whiteColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  formContainer: {
    flex: 1,
    padding: getResponsiveSize(5).width,
    paddingTop: getResponsiveSize(7).height,
  },
  passContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: getResponsiveSize(6.5).height,
    borderColor: Colors.whiteColor,
    borderWidth: 1,
    borderRadius: 5,
    color: Colors.whiteColor,
    marginBottom: getResponsiveSize(0.5).height,
    paddingHorizontal: 10,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  login: {
    paddingHorizontal: 0,
    color: Colors.lightPrimaryColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    paddingBottom: getResponsiveSize(3).height,
  },
  text: {
    color: Colors.whiteColor,
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(15).width,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  forgetPassOpacity: {
    width: '50%',
    alignSelf: 'flex-end',
    marginTop: responsiveFontSize(7),
  },
  flexEndAndZeroPadding: {
    alignSelf: 'flex-end',
    paddingHorizontal: 0,
  },
  passIcon: {
    color: Colors.whiteColor,
    fontSize: responsiveFontSize(20),
    marginRight: getResponsiveSize(1).width,
  },
});
