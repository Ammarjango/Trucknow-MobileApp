/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/navigators/Main';
import {Provider} from 'react-redux';
import {store} from './src/store';
import Toast from 'react-native-toast-message';

function App() {
  // const toastConfig = {
  //   /*
  //     Overwrite 'success' type,
  //     by modifying the existing `BaseToast` component
  //   */
  //   success: props => (
  //     <BaseToast
  //       {...props}
  //       style={{borderLeftColor: 'pink'}}
  //       contentContainerStyle={{paddingHorizontal: 15}}
  //       text1Style={{
  //         fontSize: 15,
  //         fontWeight: '400',
  //       }}
  //     />
  //   ),
  //   /*
  //     Overwrite 'error' type,
  //     by modifying the existing `ErrorToast` component
  //   */
  //   error: props => (
  //     <ErrorToast
  //       {...props}
  //       text1Style={{
  //         fontSize: 17,
  //       }}
  //       text2Style={{
  //         fontSize: 15,
  //       }}
  //     />
  //   ),
  //   /*
  //     Or create a completely new type - `tomatoToast`,
  //     building the layout from scratch.

  //     I can consume any custom `props` I want.
  //     They will be passed when calling the `show` method (see below)
  //   */
  //   tomatoToast: ({text1, props}) => (
  //     <View style={{height: 60, width: '80%', backgroundColor: 'tomato'}}>
  //       <Text>{text1}</Text>
  //     </View>
  //   ),
  // };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
