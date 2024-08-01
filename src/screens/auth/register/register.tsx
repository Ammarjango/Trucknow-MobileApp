import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {CreateUser} from '../../../redux/slice/dataSlice';
import {AppDispatch} from '../../../store/store';
import {cerateUserRequest} from '../../../types/axiosRequests';
import {TRootStack} from '../../../types/mainStack';
import {CreateUserSchema, keyboardType} from '../../../types/schemas';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {useRoute} from '@react-navigation/native';
import {ShowMessage} from '../../../utils/ShowMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<TRootStack, 'Register'>;

const Register = ({navigation}: Props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [passwordEyeIcon, setPasswordEyeIcon] = useState('eye-off');
  const route: any = useRoute();
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(true);
  const [confirmPasswordEyeIcon, setConfirmPasswordEyeIcon] =
    useState('eye-off');

  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = async (values: cerateUserRequest) => {
    try {
      const response: any = await dispatch(CreateUser(values));
      if (response?.payload?.success) {
        // ToastAndroid.show(
        //   'Registered successfully, you can login now',
        //   ToastAndroid.LONG,
        // );
        ShowMessage('success', 'Registered successfully, you can login now');
        navigation.navigate('Login');
      } else {
        ShowMessage('error', response?.payload?.message || '');
        // ToastAndroid.show(response?.payload?.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    } finally {
      console.log('inside final');
    }
  };

  const handlePasswordVisibility = () => {
    if (passwordEyeIcon === 'eye-off') {
      setPasswordEyeIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    } else if (passwordEyeIcon === 'eye') {
      setPasswordEyeIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const handleConfirmPasswordVisibility = () => {
    if (confirmPasswordEyeIcon === 'eye') {
      setConfirmPasswordEyeIcon('eye-off');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordEyeIcon === 'eye-off') {
      setConfirmPasswordEyeIcon('eye');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  };

  return (
    <View style={styles.container}>
      <LargeText
        text="Create Account"
        isInverted={false}
        style={styles.heading}
      />
      <LargeText
        text="to get started now!"
        isInverted={false}
        style={[styles.heading, {fontFamily: FONTS.MONTSERRAT_Regular}]}
      />
      <View style={styles.form}>
        <KeyboardAwareScrollView>
          <Formik
            initialValues={{
              firstname: '', //Shahzaibnn
              lastname: '', //Younusnn
              email: '', //shahzaib@123.comrr
              address: '', //abcr
              password: '', //112233444
              confirmPassword: '', //112233444
              phoneno: route?.params?.phone, //route?.params?.phone
            }}
            validationSchema={CreateUserSchema}
            onSubmit={handleSignup}>
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
                  keyboardType={keyboardType}
                  placeholder="First Name"
                  placeholderTextColor={Colors.inputPlaceHolder}
                  onChangeText={handleChange('firstname')}
                  onBlur={handleBlur('firstname')}
                  value={String(values.firstname)}
                />
                {touched.firstname && errors.firstname && (
                  <SmallText text={errors.firstname} error={true} />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  keyboardType={keyboardType}
                  placeholderTextColor={Colors.inputPlaceHolder}
                  onChangeText={handleChange('lastname')}
                  onBlur={handleBlur('lastname')}
                  value={String(values.lastname)}
                />
                {touched.lastname && errors.lastname && (
                  <SmallText text={errors.lastname} error={true} />
                )}

                <TextInput
                  style={styles.input}
                  keyboardType={keyboardType}
                  placeholder="Email"
                  placeholderTextColor={Colors.inputPlaceHolder}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={String(values.email)}
                />
                {touched.email && errors.email && (
                  <SmallText text={errors.email} error={true} />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor={Colors.inputPlaceHolder}
                  keyboardType={keyboardType}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={String(values.address)}
                />
                {touched.address && errors.address && (
                  <SmallText text={errors.address} error={true} />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Phone No (923000000)"
                  placeholderTextColor={Colors.inputPlaceHolder}
                  keyboardType={'numeric'}
                  editable={false}
                  onChangeText={handleChange('phoneno')}
                  onBlur={handleBlur('phoneno')}
                  value={String(values.phoneno)}
                />
                {touched.phoneno && errors.phoneno && (
                  <SmallText text={errors.phoneno} error={true} />
                )}

                <View style={[styles.input, styles.rowAndCenterAlign]}>
                  <TextInput
                    style={styles.passwordsContainer}
                    placeholder="Password"
                    placeholderTextColor={Colors.inputPlaceHolder}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={String(values.password)}
                    secureTextEntry={passwordVisibility}
                  />
                  <TouchableOpacity onPress={() => handlePasswordVisibility()}>
                    <Feather name={passwordEyeIcon} style={styles.passIcon} />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <SmallText text={errors.password} error={true} />
                )}

                <View style={[styles.input, styles.rowAndCenterAlign]}>
                  <TextInput
                    style={styles.passwordsContainer}
                    placeholder="Confirm Password"
                    placeholderTextColor={Colors.inputPlaceHolder}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={String(values.confirmPassword)}
                    secureTextEntry={confirmPasswordVisibility}
                  />
                  <TouchableOpacity
                    onPress={() => handleConfirmPasswordVisibility()}>
                    <Feather
                      name={confirmPasswordEyeIcon}
                      style={styles.passIcon}
                    />
                  </TouchableOpacity>
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <SmallText text={errors.confirmPassword} error={true} />
                )}

                <Button
                  title="Register as User"
                  onPress={handleSubmit}
                  isInverted={true}
                />
              </View>
            )}
          </Formik>
          <View style={styles.row}>
            <MediumText text="Already have an account?" style={styles.text} />
            <Pressable onPress={() => navigation.navigate('Login')}>
              <MediumText text=" Log In" style={[styles.text, styles.login]} />
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingTop: getResponsiveSize(5).height,
  },
  heading: {
    fontSize: responsiveFontSize(32),
    alignSelf: 'center',
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
  input: {
    height: getResponsiveSize(6.5).height,
    borderColor: Colors.whiteColor,
    borderWidth: 1,
    borderRadius: 5,
    color: Colors.whiteColor,
    marginBottom: getResponsiveSize(1).height,
    paddingHorizontal: 10,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  passwordsContainer: {
    flex: 1,
    color: Colors.whiteColor,
  },
  rowAndCenterAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  login: {
    paddingHorizontal: 0,
    color: Colors.lightPrimaryColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    marginBottom: getResponsiveSize(2).height,
  },
  text: {
    fontSize: responsiveFontSize(15),
    textAlign: 'center',
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  passIcon: {
    color: Colors.whiteColor,
    fontSize: responsiveFontSize(20),
    marginRight: getResponsiveSize(1).width,
  },
});
