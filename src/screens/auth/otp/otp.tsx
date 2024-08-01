import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useRef, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from '../../../components';
import {IMAGES} from '../../../theme/assets';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {useRoute} from '@react-navigation/native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
// @ts-ignore
import CountDownTimer from 'react-native-countdown-timer-hooks';
import {useDispatch} from 'react-redux';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {LargeText, MediumText} from '../../../components/text';
import {
  confirmOtpForReg,
  enterPhoneForReg,
} from '../../../redux/slice/dataSlice';
import {AppDispatch} from '../../../store/store';
import {TRootStack} from '../../../types/mainStack';
import CustomBackArrow from '../../../components/backArrow';
import {ShowMessage} from '../../../utils/ShowMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<TRootStack, 'Otp'>;

const CELL_COUNT = 6;
const Otp = ({navigation}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const route: any = useRoute();
  const [userNumber, setUserNumber] = useState(route?.params?.phone);
  const refTimer: any = useRef();
  const [timerEnd, setTimerEnd] = useState(false);
  const timerCallbackFunc = (timerFlag: any) => {
    setTimerEnd(timerFlag);
  };

  const [value, setValue] = useState<any>('');

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const validateInput = async () => {
    if (value.length == CELL_COUNT) {
      try {
        const response: any = await dispatch(confirmOtpForReg(value));

        if (response?.payload?.success) {
          navigation.replace('Register', {
            phone: route?.params?.phone?.phoneno,
          });
        } else {
          ShowMessage('error', response?.payload?.message || 'Invalid Otp');
        }
      } catch (error) {
        console.error('Async thunk failed:', error);
      }
    } else {
      ShowMessage('error', 'OTP should be 6 digit long');
    }
  };

  const postResendRequest = async () => {
    try {
      const response: any = await dispatch(enterPhoneForReg(userNumber));
      if (response?.payload?.success) {
        setValue('');
        refTimer?.current?.resetTimer();
        ShowMessage('success', 'Otp sent again');
      } else {
        ShowMessage('error', response?.payload?.message || '');
      }
    } catch (error) {
      console.error('Async thunk failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomBackArrow
        showArrow={true}
        inverted={false}
        containerStyle={styles.containerStyle}
        onPressArrow={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.scrollViewContainer}>
        <Image style={styles.parentImgStyle} source={IMAGES.otp} />
        <View style={styles.body}>
          <View style={styles.verificationContainer}>
            <LargeText text="Verification Code" style={styles.heading} />
            <MediumText
              text={`Please enter your code sent to +${userNumber?.phoneno}`}
              style={styles.subHeading}
            />
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="numeric"
              textContentType="oneTimeCode"
              autoCapitalize="none"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>
          <View>
            <Button
              isInverted={true}
              title={'Verify'}
              onPress={() => validateInput()}
              containerStyle={styles.marginTopStyle}
            />
            <View style={styles.row}>
              <View style={styles.countDownContainer}>
                <MediumText
                  text={`Didn’t receive the verification code? `}
                  style={[styles.text, {paddingHorizontal: 0}]}
                />
                <View
                  style={{
                    display: timerEnd ? 'none' : 'flex',
                    flexDirection: 'row',
                  }}>
                  <CountDownTimer
                    ref={refTimer}
                    timestamp={120}
                    timerCallback={timerCallbackFunc}
                    containerStyle={styles.timerContainer}
                    textStyle={styles.timerTxtStyle}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.centerAligning,
                    {
                      display: timerEnd ? 'flex' : 'none',
                    },
                  ]}
                  onPress={() => {
                    postResendRequest();
                    setTimerEnd(false);
                  }}>
                  <MediumText
                    text={` Resend OTP`}
                    style={[styles.text, styles.login]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

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
    fontSize: responsiveFontSize(32),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(1).width,
  },
  parentImgStyle: {
    alignSelf: 'center',
    marginVertical: getResponsiveSize(3).height,
  },
  subHeading: {
    color: Colors.whiteColor,
    textAlign: 'center',
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000050',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingTop: getResponsiveSize(5).height,
  },
  scrollViewContainer: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  countDownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
  timerTxtStyle: {
    fontSize: responsiveFontSize(15),
    color: Colors.secondaryColor,
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
  centerAligning: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    color: Colors.blueColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    paddingBottom: getResponsiveSize(3).height,
  },
  text: {
    textAlign: 'center',
    marginVertical: getResponsiveSize(2).height,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  marginTopStyle: {
    marginTop: getResponsiveSize(Platform.OS === 'ios' ? 14 : 17).height,
  },
  verificationContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
  },
  codeFieldRoot: {
    marginTop: getResponsiveSize(2).height,
    width: '90%',
  },
  cell: {
    width: getResponsiveSize(11).width,
    height: getResponsiveSize(5.5).height,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: Colors.whiteColor,
    textAlign: 'center',
    color: Colors.whiteColor,
  },
  focusCell: {
    borderColor: Colors.whiteColor,
  },
});

export default Otp;
