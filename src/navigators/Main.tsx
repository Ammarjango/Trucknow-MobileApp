/* 
// Created by Anjuman on 05/08/2023.
// Company: Codistan Pvt ltd.
//
// Current developer:  Shahzaib
// Edited by : [Shahzaib]
//
// Reference: [if any]
*/

import {createStackNavigator} from '@react-navigation/stack';
import {initStripe} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, SafeAreaView} from 'react-native';
import {useDispatch} from 'react-redux';
import {OneSIGNAL_API_KEY, Stripe_Publish_Key} from '../../env';
import Loader from '../components/loader';
import {
  AcceptLoadBid,
  ContractAcceptance,
  Home,
  AllTruck,
  MenuScreen,
  OpenChatsScreen,
  PaymentMethod,
  PicknDropLocations,
  RatingAndReview,
  RealTimeTracking,
  TotalUsersList,
  UserAccount,
  UserBillingHistory,
  UserChats,
  WriteReview,
} from '../screens/app';
import SplashScreen from '../screens/app/splashScreen/splashScreen';
import {
  EnterPhoneNumber,
  ForgotPassword,
  Login,
  Otp,
  Register,
  RegisterSelection,
  ResetPassword,
  Welcome,
} from '../screens/auth';
import {TRootStack} from '../types/mainStack';
import {OneSignal} from 'react-native-onesignal';
import {NtoficationMODAL} from '../components/MODAL';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {notificationData} from '../redux/slice/dataSlice';

const Stack = createStackNavigator<TRootStack>();
type Props = NativeStackScreenProps<TRootStack, 'Main'>;
// @refresh reset
const MainNavigator = () => {
  let loader = true;
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const [notificationLoader, setNotificationLoader] = useState(false);
  const [notificationsData, setNotificationsData] = useState<any>();
  useEffect(() => {
    initStripe({
      publishableKey: Stripe_Publish_Key,
    });
    NotificationHandler();
  }, []);

  const NotificationHandler = () => {
    OneSignal.Debug.setLogLevel(6);
    OneSignal.initialize(OneSIGNAL_API_KEY);
    OneSignal.Notifications.requestPermission(true)
      .then(response => {
        console.log(
          'OneSignal.Notifications.requestPermission response: ',
          response,
        );
        if (!response) {
          Alert.alert(
            'Push Notifications Disabled',
            'Please enable push notifications in your device settings to receive updates.',
          );
        }
      })
      .catch(err => {
        console.log('OneSignal.Notifications.requestPermission err: ', err);
      });
    OneSignal.User.addTag('key', 'value');
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      (event: any) => {
        console.log('OneSignal: Notification received in foreground:', event);
        setNotificationsData(event.notification);
        setNotificationLoader(true);
      },
    );
  };

  const UserChatStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="UserChat">
        <Stack.Screen name="UserChat" component={UserChats} />
        <Stack.Screen name="OpenChatsScreen" component={OpenChatsScreen} />
      </Stack.Navigator>
    );
  };

  if (!loader) {
    return <ActivityIndicator />;
  } else {
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="SplashScreen">
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen
              name="EnterPhoneNumber"
              component={EnterPhoneNumber}
            />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen
              name="RegisterSelection"
              component={RegisterSelection}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AllTruck" component={AllTruck} />
            <Stack.Screen
              name="PicknDropLocations"
              component={PicknDropLocations}
            />
            <Stack.Screen
              name="ContractAcceptance"
              component={ContractAcceptance}
            />
            <Stack.Screen name="AcceptLoadBid" component={AcceptLoadBid} />
            <Stack.Screen
              name="RealTimeTracking"
              component={RealTimeTracking}
            />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="WriteReview" component={WriteReview} />
            <Stack.Screen name="RatingAndReview" component={RatingAndReview} />
            <Stack.Screen
              name="UserBillingHistory"
              component={UserBillingHistory}
            />
            {/* <Stack.Screen name="UserChats" component={UserChats} /> */}
            {/* <Stack.Screen name="OpenChatsScreen" component={OpenChatsScreen} /> */}
            <Stack.Screen name="UserChats" component={UserChatStack} />
            <Stack.Screen name="MenuScreen" component={MenuScreen} />
            <Stack.Screen name="UserAccount" component={UserAccount} />
            <Stack.Screen name="TotalUsersList" component={TotalUsersList} />
          </Stack.Navigator>
          <Loader />
          <NtoficationMODAL
            title={`New Notification\n` + notificationsData?.title}
            description={notificationsData?.body}
            acceptTxt="Review"
            isVisible={notificationLoader}
            onPressAccept={() => {
              setNotificationLoader(false);
              dispatch(notificationData(notificationsData));
              navigation.navigate('UserBillingHistory');
            }}
            onPressCancel={() => {
              setNotificationLoader(false);
            }}
            onModalCLose={() => {
              setNotificationLoader(false);
            }}
          />
        </SafeAreaView>
      </>
    );
  }
};

export default MainNavigator;
