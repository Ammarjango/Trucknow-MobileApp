import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {notificationData, saveLoginData} from '../../../redux/slice/dataSlice';
import {OneSignal} from 'react-native-onesignal';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  useEffect(() => {
    sessionCheck();
  }, []);

  const sessionCheck = () => {
    setTimeout(async () => {
      const result = await AsyncStorage.getItem('isLoggedIn');
      const userDetails = await AsyncStorage.getItem('user');
      AsyncStorage.setItem('isInsideChats', 'false');
      if (result) {
        const parsedResult = JSON.parse(result);
        if (parsedResult != null && parsedResult != 'null') {
          if (userDetails) {
            dispatch(saveLoginData(userDetails));
            OneSignal.Notifications.addEventListener('click', (event: any) => {
              console.log('OneSignal: notification clicked:', event);
              if (event.notification) {
                dispatch(notificationData(event.notification));
                navigation.navigate('UserBillingHistory');
                return;
              } else {
                navigation.replace('Home');
                return;
              }
            });
            navigation.replace('Home');
          }
        }
      } else {
        navigation.replace('Welcome');
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../theme/assets/images/logo.png')}
        style={styles.imgStyle}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    width: '100%',
    height: 400,
  },
});
