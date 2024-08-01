import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export function responsiveFontSize(size: number) {
  const baseWidth = 375; // Width on which the base font size was designed
  const scaleFactor = SCREEN_WIDTH / baseWidth;
  const newSize = Math.round(size * scaleFactor);
  return newSize;
}

export function getResponsiveSize(percentage:number) {
  if (percentage > 100) {
    percentage = 100; // Ensure the percentage is within a valid range
  }
  const responsiveWidth = (percentage / 100) * SCREEN_WIDTH;
  const responsiveHeight = (percentage / 100) * SCREEN_HEIGHT;
  return { width: responsiveWidth, height: responsiveHeight };
}