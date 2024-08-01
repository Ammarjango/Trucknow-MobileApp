import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../assets/colors/Colors';
import FONTS from '../assets/fonts/FONTS';
import {topHeaderContainer} from '../types/AppInterfaceTypes';
import {responsiveFontSize} from '../utils';
import {LargeText} from './text';
export const CustomerTopBar: React.FC<topHeaderContainer> = ({
  inverted = true,
  showArrow = false,
  showTitle = false,
  showDots = false,
  onPressArrow,
  onPressDots,
  titleTxt = '',
  containerStyle,
  ArrowIconStyles,
  titleStyles,
  dotStyles,
  isGap = false,
}) => {
  const navigation = useNavigation();

  const handleArrowPress = onPressArrow || (() => navigation.goBack());
  const handleDotPress =
    onPressDots ||
    (() => {
      console.log('dot presssed');
    });

  return (
    <View style={[styles.container, containerStyle]}>
      {showArrow && (
        <TouchableOpacity style={styles.button} onPress={handleArrowPress}>
          <Ionicons
            name="arrow-back-circle-sharp"
            style={[
              styles.iconStyle,
              ArrowIconStyles,
              {color: inverted ? Colors.primaryColor : Colors.whiteColor},
            ]}
          />
        </TouchableOpacity>
      )}
      {showTitle && (
        <LargeText
          text={titleTxt}
          style={[
            styles.titleTxt,
            titleStyles,
            {color: inverted ? Colors.primaryColor : Colors.whiteColor},
          ]}
        />
      )}
      {showDots && (
        <TouchableOpacity style={styles.button} onPress={handleDotPress}>
          <Entypo
            name="dots-three-vertical"
            style={[
              styles.dotStyle,
              dotStyles,
              {color: inverted ? Colors.primaryColor : Colors.whiteColor},
            ]}
          />
        </TouchableOpacity>
      )}
      {!showDots && isGap && <View style={styles.dotWidthStyle} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    borderRadius: 5,
  },
  titleTxt: {
    fontSize: responsiveFontSize(18),
  },
  iconStyle: {
    fontSize: responsiveFontSize(30),
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  dotStyle: {
    fontSize: responsiveFontSize(20),
  },
  dotWidthStyle: {
    width: responsiveFontSize(20),
  },
});

export default CustomerTopBar;
