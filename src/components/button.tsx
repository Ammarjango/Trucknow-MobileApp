import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {getResponsiveSize} from '../utils';
import Colors from '../assets/colors/Colors';
import FONTS from '../assets/fonts/FONTS';

const Button = ({onPress, title, containerStyle, isInverted}: any) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {backgroundColor: isInverted ? Colors.whiteColor : Colors.primaryColor},
        containerStyle,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.buttonText,
          {color: isInverted ? Colors.primaryColor : Colors.whiteColor},
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: getResponsiveSize(3.5).width,
    width: getResponsiveSize(90).width,
    alignSelf: 'center',
    marginTop: getResponsiveSize(2).height,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: FONTS.MONTSERRAT_Medium,
  },
});

export default Button;
