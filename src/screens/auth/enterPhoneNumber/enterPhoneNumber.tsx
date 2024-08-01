import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';
import {useDispatch} from 'react-redux';
import FONTS from '../../../assets/fonts/FONTS';
import {Button} from '../../../components';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {enterPhoneForReg} from '../../../redux/slice/dataSlice';
import {AppDispatch} from '../../../store/store';
import {IMAGES, SVG} from '../../../theme/assets';
import {phoneForRegRequest} from '../../../types/axiosRequests';
import {TRootStack} from '../../../types/mainStack';
import {enterPhoneForRegSchema} from '../../../types/schemas';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import Colors from '../../../assets/colors/Colors';
import CustomBackArrow from '../../../components/backArrow';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<TRootStack, 'EnterPhoneNumber'>;

const EnterPhoneNumber = ({navigation}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [country, setCountry] = useState<any>({
    cca2: 'US',
    callingCode: '1',
  });

  const [isVisible, setIsVisible] = useState(false);

  const handleSubmition = async (values: phoneForRegRequest) => {
    const obj = {phoneno: country?.callingCode + values.phoneno};

    try {
      const response: any = await dispatch(enterPhoneForReg(obj));
      console.log(
        '&&&&&&&&& handleSubmition register otp response: ',
        response,
      );
      if (response?.payload?.success) {
        navigation.replace('Otp', {
          phone: obj,
        });
      } else {
        if (response?.error) {
          Alert.alert(
            'Please try again with correct country code (eg: 9xxxxxxxxxx)',
          );
        } else {
          Alert.alert(
            response?.payload?.message + ' or try with correct country code',
          );
        }
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
        onPress={() => {
          navigation.replace('Login');
        }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}>
        <Image style={styles.imgStyle} source={IMAGES.otp} />
        <View style={styles.body}>
          <Formik
            initialValues={{
              phoneno: '',
            }}
            validationSchema={enterPhoneForRegSchema}
            onSubmit={handleSubmition}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <View style={styles.alignCenterContainer}>
                  <LargeText text="Verify your number" style={styles.heading} />
                  <MediumText
                    text={`Please enter your country and phone \n number`}
                    style={styles.subHeading}
                  />
                  <View style={styles.otpContainer}>
                    <View style={styles.rowContainer}>
                      <View style={styles.countryPicker}>
                        <CountryPicker
                          countryCode={country.cca2}
                          withFilter
                          withFlag
                          withAlphaFilter
                          withCallingCode
                          withEmoji
                          onSelect={option => {
                            console.log(option);
                            setIsVisible(false);
                            setCountry(option);
                          }}
                          visible={isVisible}
                        />
                        <TouchableOpacity onPress={() => setIsVisible(true)}>
                          <SvgXml xml={SVG.icons.down} />
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter Phone without country code"
                          placeholderTextColor={Colors.inputPlaceHolder}
                          onChangeText={handleChange('phoneno')}
                          onBlur={handleBlur('phoneno')}
                          value={values.phoneno}
                          keyboardType="decimal-pad"
                        />
                        {touched.phoneno && errors.phoneno && (
                          <SmallText
                            style={styles.errorText}
                            text={errors.phoneno}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                <Button
                  isInverted={true}
                  title={'Get OTP'}
                  onPress={handleSubmit}
                  containerStyle={styles.buttonStyle}
                />
              </>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EnterPhoneNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  containerStyle: {
    alignSelf: 'flex-start',
    margin: responsiveFontSize(10),
  },
  heading: {
    color: Colors.whiteColor,
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(1).width,
    fontSize: responsiveFontSize(32),
  },
  imgStyle: {
    alignSelf: 'center',
    marginBottom: getResponsiveSize(3).height,
  },
  subHeading: {
    color: Colors.whiteColor,
    textAlign: 'center',
    fontFamily: FONTS.MONTSERRAT_Regular,
    alignSelf: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingTop: getResponsiveSize(5).height,
  },
  alignCenterContainer: {
    alignItems: 'center',
  },
  otpContainer: {
    marginTop: getResponsiveSize(3).height,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  errorText: {
    color: Colors.redColor,
    paddingHorizontal: getResponsiveSize(4).width,
  },
  text: {
    color: Colors.whiteColor,
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(15).width,
  },
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getResponsiveSize(1).height,
    height: getResponsiveSize(6.5).height,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
    flexDirection: 'row',
    borderRadius: 5,
  },
  input: {
    height: getResponsiveSize(6.5).height,
    borderColor: Colors.whiteColor,
    borderWidth: 1,
    borderRadius: 5,
    color: Colors.whiteColor,
    marginBottom: getResponsiveSize(0.5).height,
    paddingHorizontal: 10,
    marginLeft: getResponsiveSize(3).width,
    width: getResponsiveSize(65).width,
  },
  buttonStyle: {
    marginVertical: getResponsiveSize(3).height,
  },
});
