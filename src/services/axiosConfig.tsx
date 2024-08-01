import axios from 'axios';
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from 'react-native';
import {Chat_Production_URl, ProductionURl} from '../../env';
import {ShowMessage} from '../utils/ShowMessage';

export const navigationRef = createNavigationContainerRef();

// Function to fetch access token and to check if user in chat screens
const UseAccessToken = async () => {
  const user = await AsyncStorage.getItem('user');
  const isInsideChats = await AsyncStorage.getItem('isInsideChats');
  if (user) {
    const parseUser = JSON.parse(user);
    const baseURL =
      isInsideChats === 'true' ? Chat_Production_URl : ProductionURl;
    return {accessToken: parseUser?.accessToken, baseURL};
  } else {
    const baseURL =
      isInsideChats === 'true' ? Chat_Production_URl : ProductionURl;
    return {accessToken: null, baseURL};
  }
};

// Function to navigate when session expires
const navigate = () => {
  AsyncStorage.clear();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'MainNavigator',
            params: {
              screen: 'Login',
            },
          },
        ],
      }),
    );
  }
};

const dataServer = axios.create({
  timeout: 100000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

dataServer.interceptors.request.use(async config => {
  try {
    const {accessToken, baseURL}: any = await UseAccessToken();
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      // ToastAndroid.showWithGravityAndOffset(
      //     'Please check your internet connection',
      //     ToastAndroid.SHORT,
      //     ToastAndroid.BOTTOM,
      //     25,
      //     30,
      // );
      ShowMessage('error', 'Please check your internet connection');
      throw new Error('No internet connection');
    }
    if (config?.data && config?.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    if (accessToken) {
      config.baseURL = baseURL; // Set baseURL if accessToken is available
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      config.baseURL = baseURL;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

dataServer.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error?.response?.status === 401) {
      navigate();
    }
    return Promise.reject(error);
  },
);

export {dataServer};
