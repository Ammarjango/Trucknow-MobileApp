import Toast from 'react-native-toast-message';

export const ShowMessage = (
  type: string = 'success',
  error: string = 'Some Error',
  bottomOffset: number = 100,
  visibilityTime: number = 2200,
) => {
  return Toast.show({
    type: type,
    text1: error === '' ? 'Some Error' : error,
    position: 'bottom', // Position the toast in the center
    bottomOffset: bottomOffset,
    visibilityTime: visibilityTime,
  });
};
