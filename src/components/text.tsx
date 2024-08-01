import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Colors from '../assets/colors/Colors';
import FONTS from '../assets/fonts/FONTS';
import {textProps} from '../types/AppInterfaceTypes';
import {getResponsiveSize, responsiveFontSize} from '../utils';

export const LargeText: React.FC<textProps> = ({
  text,
  style,
  isInverted = true,
  numOfLines,
}) => {
  return (
    <Text
      numberOfLines={numOfLines}
      style={[
        styles.largeText,
        {color: isInverted ? Colors.whiteColor : Colors.blackColor},
        style,
      ]}>
      {text}
    </Text>
  );
};

export const MediumText: React.FC<textProps> = ({
  text,
  style,
  isInverted = true,
  ref,
  numOfLines,
}) => {
  return (
    <Text
      numberOfLines={numOfLines}
      ref={ref}
      style={[
        styles.mediumText,
        {color: isInverted ? Colors.whiteColor : Colors.blackColor},
        style,
      ]}>
      {text}
    </Text>
  );
};

export const SmallText: React.FC<textProps> = ({
  text,
  style,
  isInverted = true,
  error = false,
  numOfLines,
}) => {
  return (
    <Text
      numberOfLines={numOfLines}
      style={
        error
          ? [styles.errorStyle, style]
          : [
              styles.smallText,
              {color: isInverted ? Colors.whiteColor : Colors.blackColor},
              style,
            ]
      }>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  largeText: {
    fontSize: responsiveFontSize(20),
    color: Colors.whiteColor,
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
  mediumText: {
    fontSize: responsiveFontSize(14),
    fontFamily: FONTS.MONTSERRAT_Medium,
    alignSelf: 'flex-start',
  },
  smallText: {
    fontSize: responsiveFontSize(12),
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.whiteColor,
  },
  errorStyle: {
    color: Colors.redColor,
    marginBottom: getResponsiveSize(1).height,
    fontSize: responsiveFontSize(12),
    fontFamily: FONTS.MONTSERRAT_Regular,
    marginLeft: getResponsiveSize(2).width,
  },
});
