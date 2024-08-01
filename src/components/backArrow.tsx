import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../assets/colors/Colors';
import FONTS from '../assets/fonts/FONTS';
import { responsiveFontSize } from '../utils';
const CustomBackArrow = ({
  onPress,
  containerStyle,
  IconStyle,
}: any) => {
  const navigation = useNavigation();

  const handlePress = onPress || (() => navigation.goBack());

  return (
    <TouchableOpacity
      style={[styles.button, containerStyle]} onPress={handlePress}>
      <Ionicons name='arrow-back-circle-sharp' style={[styles.iconStyle, IconStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    borderRadius: 5,
  },
  iconStyle: {
    fontSize: responsiveFontSize(30),
    color: Colors.blackColor,
    fontFamily: FONTS.MONTSERRAT_Regular
  },
});

export default CustomBackArrow;
