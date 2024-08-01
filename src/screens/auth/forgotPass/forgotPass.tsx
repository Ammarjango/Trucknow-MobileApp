import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {userForgetPass} from '../../../redux/slice/dataSlice';
import {AppDispatch} from '../../../store/store';
import {TRootStack} from '../../../types/mainStack';
import {forgetPassSchema} from '../../../types/schemas';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import CustomBackArrow from '../../../components/backArrow';
import {ShowMessage} from '../../../utils/ShowMessage';
type Props = NativeStackScreenProps<TRootStack, 'ForgotPassword'>;

const ForgotPassword = ({navigation}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = async (values: any) => {
    try {
      const response: any = await dispatch(userForgetPass(values));
      if (response?.payload?.success) {
        navigation.navigate('ResetPassword');
      } else {
        ShowMessage(
          'error',
          response?.payload?.message
            ? response?.payload?.message
            : 'Please enter correct credentials \n(eg: 92xxxxxxxxx)',
        );
        // if (Platform.OS === 'android') {
        //   ToastAndroid.show(
        //     response?.payload?.message
        //       ? response?.payload?.message
        //       : 'Please enter correct credentials \n(eg: 92xxxxxxxxx)',
        //     ToastAndroid.LONG,
        //   );
        // } else {
        //   Alert.alert(
        //     '',
        //     response?.payload?.message
        //       ? response?.payload?.message
        //       : 'Please enter correct credentials \n(eg: 92xxxxxxxxx)',
        //   );
        // }
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
        <LargeText style={styles.heading} text="Forgot" isInverted={false} />
        <LargeText
          style={styles.subHeading}
          text=" Password?"
          isInverted={false}
        />
      </View>
      <View style={styles.form}>
        <ScrollView>
          <Formik
            initialValues={{phoneno: ''}}
            validationSchema={forgetPassSchema}
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
                  text={`Enter the Phone Number associated with the\naccount. We will text you an OTP to reset\nthe password`}
                  style={styles.forgotDescription}
                />
                <TextInput
                  style={styles.input}
                  placeholder={'Enter Phone with country code'}
                  placeholderTextColor={Colors?.silverColor}
                  keyboardType="number-pad"
                  onChangeText={handleChange('phoneno')}
                  onBlur={handleBlur('phoneno')}
                  value={values.phoneno}
                />
                {touched.phoneno && errors.phoneno && (
                  <SmallText style={styles.errorText} text={errors.phoneno} />
                )}

                <Button title="Send" onPress={handleSubmit} isInverted={true} />
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

export default ForgotPassword;

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
    color: Colors.whiteColor,
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
