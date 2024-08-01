import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import React from 'react';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {resetPass} from '../../../redux/slice/dataSlice';
import {AppDispatch} from '../../../store/store';
import {TRootStack} from '../../../types/mainStack';
import {resetPassSchema} from '../../../types/schemas';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import CustomBackArrow from '../../../components/backArrow';
import {ShowMessage} from '../../../utils/ShowMessage';
type Props = NativeStackScreenProps<TRootStack, 'ResetPassword'>;

const ResetPassword = ({navigation}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = async (values: any) => {
    try {
      const response: any = await dispatch(resetPass(values));
      console.log('ResetPassword Res :: ', response?.payload);
      if (response?.payload?.success) {
        // ToastAndroid.showWithGravity(
        //     response?.payload?.message,
        //     ToastAndroid.LONG,
        //     ToastAndroid.CENTER,
        // );
        ShowMessage('success', response?.payload?.message || '');
        navigation.navigate('Login');
      } else {
        // ToastAndroid.showWithGravity(
        //   response?.payload?.message,
        //   ToastAndroid.LONG,
        //   ToastAndroid.CENTER,
        // );
        ShowMessage('error', response?.payload?.message || '');
      }
    } catch (error) {
      console.error('Async thunk failed:', error);
    }
  };
  return (
    <View style={styles.container}>
      <CustomBackArrow
        showArrow={true}
        inverted={false}
        containerStyle={styles.containerStyle}
        onPressArrow={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.titleTxtContainer}>
        <LargeText style={styles.heading} text="Reset" isInverted={false} />
        <LargeText
          style={styles.subHeading}
          text=" Password"
          isInverted={false}
        />
      </View>

      <View style={styles.form}>
        <ScrollView>
          <Formik
            initialValues={{
              password: '',
              otp: '',
            }}
            validationSchema={resetPassSchema}
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
                <MediumText
                  text={`Enter the OTP and New Password for your account`}
                  style={styles.forgotDescription}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP code"
                  placeholderTextColor="white"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText={handleChange('otp')}
                  onBlur={handleBlur('otp')}
                  value={values.otp}
                />
                {touched.otp && errors.otp && (
                  <SmallText style={styles.errorText} text={errors.otp} />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  placeholderTextColor="white"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <SmallText style={styles.errorText} text={errors.password} />
                )}
                <Button
                  title="Send"
                  onPress={() => {
                    handleSubmit();
                  }}
                  isInverted={true}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  containerStyle: {
    alignSelf: 'flex-start',
    margin: responsiveFontSize(10),
  },
  titleTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: responsiveFontSize(32),
  },
  subHeading: {
    fontSize: responsiveFontSize(32),
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: getResponsiveSize(3).height,
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
    color: 'white',
    marginBottom: getResponsiveSize(0.5).height,
    paddingHorizontal: 10,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  forgotDescription: {
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: getResponsiveSize(2).height,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  errorText: {
    color: Colors.redColor,
    marginBottom: getResponsiveSize(1).height,
    fontFamily: FONTS.MONTSERRAT_Regular,
    marginLeft: getResponsiveSize(2).width,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    paddingBottom: getResponsiveSize(3).height,
  },
  text: {
    color: Colors.whiteColor,
    fontSize: responsiveFontSize(15),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(15).width,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
});
