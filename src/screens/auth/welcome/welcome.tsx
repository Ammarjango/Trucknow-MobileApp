import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import { Button, ImageSlider } from '../../../components';
import { LargeText, MediumText, SmallText } from '../../../components/text';
import { getResponsiveSize, responsiveFontSize } from '../../../utils';
import { TRootStack } from '../../../types/mainStack';

type Props = NativeStackScreenProps<TRootStack, 'Welcome'>;

const Welcome = ({ navigation }: Props) => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageSlider />
        <LargeText
          style={styles.heading}
          text='Take the hassle out of trucking - from request to delivery'
          isInverted={false}
        />
        <MediumText
          style={[styles.heading, styles.mediumFont]}
          text={`Premier Trucking Services - with our app, you'll wonder how you ever did it any other way`}
          isInverted={false}
        />
        <Button
          onPress={() => navigation.navigate('EnterPhoneNumber')}
          title='Get Started'
          containerStyle={styles.button}
        />
        <View style={styles.row}>
          <SmallText
            text='Already have an account?'
            isInverted={false}
            style={[styles.text, { paddingHorizontal: 0 }]}
          />
          <Pressable onPress={() => navigation.navigate('Login')}>
            <SmallText
              text=' Log In'
              style={[styles.text, styles.login]}
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor
  },
  heading: {
    fontSize: responsiveFontSize(32),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(5).width,
  },
  mediumFont: {
    fontSize: responsiveFontSize(15),
    fontFamily: FONTS.MONTSERRAT_Regular
  },
  text: {
    color: Colors.blackColor,
    fontSize: responsiveFontSize(15),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSize(15).width,
    marginTop: getResponsiveSize(1).height,
    fontFamily: FONTS.MONTSERRAT_Regular
  },
  login: {
    color: Colors.lightPrimaryColor,
    paddingHorizontal: 0
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    marginTop: getResponsiveSize(3.5).height,
  }
})